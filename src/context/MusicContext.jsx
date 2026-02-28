import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { playlists as hardcodedPlaylists, getTimeBasedPlaylist } from "../data/musicData";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { addSongToPlaylist, removeSongFromPlaylist, updatePlaylistSongs, seedPlaylists } from "../lib/playlistService";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [playlists, setPlaylists] = useState(hardcodedPlaylists);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);
  const handleNextRef = useRef(null);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  // Real-time listener for playlists from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "playlists"),
      (snapshot) => {
        if (snapshot.empty) {
          // First run: seed Firestore with hardcoded data
          seedPlaylists(hardcodedPlaylists).then(() => {
            setPlaylistsLoading(false);
          });
        } else {
          const firestorePlaylists = {};
          snapshot.docs.forEach((doc) => {
            firestorePlaylists[doc.id] = doc.data();
          });
          setPlaylists(firestorePlaylists);
          setPlaylistsLoading(false);
        }
      },
      (error) => {
        console.error("Playlists listener error:", error);
        // Fall back to hardcoded
        setPlaylists(hardcodedPlaylists);
        setPlaylistsLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // Create YouTube container outside React's tree
  useEffect(() => {
    let container = document.getElementById("yt-player-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "yt-player-container";
      container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;overflow:hidden;pointer-events:none;";
      document.body.appendChild(container);
    }
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
        playerRef.current = null;
      }
    };
  }, []);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setPlayerReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setPlayerReady(true);
    };
  }, []);

  const initPlayer = useCallback((videoId) => {
    if (!window.YT || !window.YT.Player) return;

    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
      playerRef.current = null;
    }

    const container = document.getElementById("yt-player-container");
    if (!container) return;

    const oldDiv = document.getElementById("yt-player");
    if (oldDiv) oldDiv.remove();

    const playerDiv = document.createElement("div");
    playerDiv.id = "yt-player";
    container.appendChild(playerDiv);

    playerRef.current = new window.YT.Player("yt-player", {
      height: "0",
      width: "0",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(volumeRef.current);
          if (isMutedRef.current) event.target.mute();
          else event.target.unMute();
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            if (handleNextRef.current) handleNextRef.current();
          }
        },
      },
    });
  }, []);

  const playSong = useCallback(
    (song, playlistKey = null) => {
      setCurrentSong(song);
      setShowPlayer(true);
      setIsPlaying(true);

      if (playlistKey && playlists[playlistKey]) {
        setCurrentPlaylist(playlistKey);
      }

      if (playerReady) {
        initPlayer(song.youtubeId);
      }
    },
    [playerReady, initPlayer, playlists]
  );

  const playPlaylist = useCallback(
    (playlistKey, startIndex = 0) => {
      const pl = playlists[playlistKey];
      if (!pl || !pl.songs || pl.songs.length === 0) return;

      setCurrentPlaylist(playlistKey);
      const idx = shuffle ? Math.floor(Math.random() * pl.songs.length) : startIndex;
      playSong(pl.songs[idx], playlistKey);
    },
    [shuffle, playSong, playlists]
  );

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    } catch (e) { /* player not ready */ }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    } catch (e) { /* player not ready */ }
  }, [isMuted, volume]);

  const changeVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (playerRef.current) {
      try { playerRef.current.setVolume(newVolume); } catch (e) { /* ignore */ }
    }
  }, []);

  const handleNext = useCallback(() => {
    if (!currentPlaylist || !playlists[currentPlaylist]) return;
    const songs = playlists[currentPlaylist].songs;
    if (!songs || songs.length === 0) return;

    const currentIdx = songs.findIndex((s) => s.id === currentSong?.id);

    if (shuffle) {
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * songs.length);
      } while (nextIdx === currentIdx && songs.length > 1);
      playSong(songs[nextIdx], currentPlaylist);
    } else {
      const nextIdx = (currentIdx + 1) % songs.length;
      if (nextIdx === 0 && !repeat) {
        setIsPlaying(false);
        return;
      }
      playSong(songs[nextIdx], currentPlaylist);
    }
  }, [currentPlaylist, currentSong, shuffle, repeat, playSong, playlists]);

  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  const handlePrev = useCallback(() => {
    if (!currentPlaylist || !playlists[currentPlaylist]) return;
    const songs = playlists[currentPlaylist].songs;
    if (!songs || songs.length === 0) return;

    const currentIdx = songs.findIndex((s) => s.id === currentSong?.id);
    const prevIdx = currentIdx <= 0 ? songs.length - 1 : currentIdx - 1;
    playSong(songs[prevIdx], currentPlaylist);
  }, [currentPlaylist, currentSong, playSong, playlists]);

  const autoPlayForContext = useCallback(
    (context) => {
      if (context.startsWith("member:")) {
        const member = context.split(":")[1];
        const map = { mother: "maa", father: "papa", sister: "sister", me: "family" };
        playPlaylist(map[member] || "family");
      } else if (context === "timeline" || context === "missing") {
        playPlaylist("missingHome");
      } else if (context === "happy") {
        playPlaylist("happy");
      } else if (context === "morning") {
        playPlaylist("happy");
      } else if (context === "lateNight") {
        playPlaylist("missingHome");
      } else {
        const timePl = getTimeBasedPlaylist();
        playPlaylist(timePl.playlist);
      }
    },
    [playPlaylist]
  );

  // Song management
  const addSong = useCallback(async (playlistKey, song) => {
    await addSongToPlaylist(playlistKey, song);
  }, []);

  const removeSong = useCallback(async (playlistKey, song) => {
    await removeSongFromPlaylist(playlistKey, song);
  }, []);

  const updateSong = useCallback(async (playlistKey, songId, updates) => {
    const pl = playlists[playlistKey];
    if (!pl || !pl.songs) return;
    const updatedSongs = pl.songs.map((s) =>
      s.id === songId ? { ...s, ...updates } : s
    );
    await updatePlaylistSongs(playlistKey, updatedSongs);
  }, [playlists]);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        currentPlaylist,
        isPlaying,
        isMuted,
        volume,
        shuffle,
        repeat,
        showPlayer,
        playlistsLoading,
        playSong,
        playPlaylist,
        togglePlay,
        toggleMute,
        changeVolume,
        handleNext,
        handlePrev,
        setShuffle,
        setRepeat,
        setShowPlayer,
        autoPlayForContext,
        playlists,
        addSong,
        removeSong,
        updateSong,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
