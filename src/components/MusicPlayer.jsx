import { useState, useRef } from "react";
import { useMusic } from "../context/MusicContext";
import { useTheme } from "../context/ThemeContext";
import {
  FiPlay, FiPause, FiSkipForward, FiSkipBack,
  FiVolume2, FiVolumeX, FiShuffle, FiRepeat,
  FiChevronUp, FiChevronDown, FiMusic,
} from "react-icons/fi";

export default function MusicPlayer() {
  const {
    currentSong, currentPlaylist, isPlaying, isMuted, volume,
    shuffle, repeat, showPlayer, playSong,
    togglePlay, toggleMute, changeVolume, seekTo,
    currentTime, duration, handleNext, handlePrev,
    setShuffle, setRepeat, playlists,
  } = useMusic();
  const { nightMode } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const seekBarRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const rect = seekBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    seekTo(pct * duration);
  };

  if (!showPlayer) return null;

  const playlistInfo = currentPlaylist ? playlists[currentPlaylist] : null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        nightMode
          ? "bg-[#2D1810]/95 border-t border-amber-800/30"
          : "bg-white/95 border-t border-warm-200"
      } backdrop-blur-xl shadow-2xl`}
    >
      {/* Expanded view */}
      {expanded && (
        <div className="overflow-hidden">
          <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto">
            {/* Playlist songs */}
            {playlistInfo && (
              <div className="mb-3">
                <h4 className={`text-sm font-semibold mb-2 ${
                  nightMode ? "text-warm-300" : "text-warm-700"
                }`}>
                  {playlistInfo.emoji} {playlistInfo.name}
                </h4>
                <div className="space-y-1 max-h-40 sm:max-h-48 overflow-y-auto">
                  {playlistInfo.songs.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => playSong(song, currentPlaylist)}
                      className={`w-full text-left px-3 py-2.5 sm:py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        song.id === currentSong?.id
                          ? nightMode
                            ? "bg-warm-700/30 text-warm-200"
                            : "bg-warm-100 text-warm-800"
                          : nightMode
                          ? "text-warm-400 active:bg-warm-800/30"
                          : "text-warm-600 active:bg-warm-50"
                      }`}
                    >
                      {song.id === currentSong?.id && (
                        <span className="w-2 h-2 bg-sunset rounded-full animate-pulse flex-shrink-0" />
                      )}
                      <span className="truncate">{song.title}</span>
                      <span className={`text-xs ml-auto flex-shrink-0 ${
                        nightMode ? "text-warm-500" : "text-warm-400"
                      }`}>
                        {song.movie}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shuffle + Repeat + Volume row */}
            <div className="flex items-center gap-3 pb-2">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-full transition-all ${
                  shuffle
                    ? "text-sunset bg-sunset/15"
                    : nightMode
                    ? "text-warm-500 active:text-warm-300"
                    : "text-warm-400 active:text-warm-600"
                }`}
              >
                <FiShuffle size={16} />
              </button>
              <button
                onClick={() => setRepeat(!repeat)}
                className={`p-2 rounded-full transition-all ${
                  repeat
                    ? "text-sunset bg-sunset/15"
                    : nightMode
                    ? "text-warm-500 active:text-warm-300"
                    : "text-warm-400 active:text-warm-600"
                }`}
              >
                <FiRepeat size={16} />
              </button>
              <button onClick={toggleMute} className={`flex-shrink-0 ${nightMode ? "text-warm-400" : "text-warm-600"}`}>
                {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseInt(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FF6F61 ${isMuted ? 0 : volume}%, ${
                    nightMode ? "#3E2723" : "#FFE0B2"
                  } ${isMuted ? 0 : volume}%)`,
                }}
              />
              <span className={`text-xs w-8 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Seek bar */}
      {currentSong && duration > 0 && (
        <div className="px-4 max-w-2xl mx-auto pt-2 pb-0.5">
          <div
            ref={seekBarRef}
            className={`relative h-2 sm:h-1 rounded-full cursor-pointer group touch-none ${
              nightMode ? "bg-white/10" : "bg-black/8"
            }`}
            onClick={handleSeek}
            onTouchStart={handleSeek}
            onTouchMove={handleSeek}
          >
            <div
              className="h-full rounded-full relative transition-[width] duration-300 ease-linear"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                background: "linear-gradient(90deg, #FF6F61, #FF9A76)",
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-sm sm:scale-0 sm:group-hover:scale-100 transition-transform duration-150" />
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-[10px] tabular-nums ${nightMode ? "text-warm-500/70" : "text-warm-400/70"}`}>
              {formatTime(currentTime)}
            </span>
            <span className={`text-[10px] tabular-nums ${nightMode ? "text-warm-500/70" : "text-warm-400/70"}`}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}

      {/* Mini player bar */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Song info */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              nightMode ? "bg-warm-800/50" : "bg-warm-100"
            }`}>
              <FiMusic size={16} className={`${nightMode ? "text-warm-400" : "text-warm-600"} ${isPlaying ? "animate-pulse" : ""}`} />
            </div>
            <div className="text-left min-w-0">
              <p className={`text-xs sm:text-sm font-semibold truncate ${
                nightMode ? "text-warm-200" : "text-warm-800"
              }`}>
                {currentSong?.title || "No song playing"}
              </p>
              <p className={`text-[10px] sm:text-xs truncate ${
                nightMode ? "text-warm-500" : "text-warm-400"
              }`}>
                {currentSong?.movie || "Select a song"}
              </p>
            </div>
            {expanded ? (
              <FiChevronDown size={14} className={`flex-shrink-0 ${nightMode ? "text-warm-500" : "text-warm-400"}`} />
            ) : (
              <FiChevronUp size={14} className={`flex-shrink-0 ${nightMode ? "text-warm-500" : "text-warm-400"}`} />
            )}
          </button>

          {/* Controls — compact on mobile */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <button
              onClick={handlePrev}
              className={`p-2 rounded-full transition-all ${
                nightMode
                  ? "text-warm-300 active:text-warm-100"
                  : "text-warm-600 active:text-warm-800"
              }`}
            >
              <FiSkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="p-2 sm:p-2.5 rounded-full glow-btn text-white"
            >
              {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
            </button>

            <button
              onClick={handleNext}
              className={`p-2 rounded-full transition-all ${
                nightMode
                  ? "text-warm-300 active:text-warm-100"
                  : "text-warm-600 active:text-warm-800"
              }`}
            >
              <FiSkipForward size={18} />
            </button>

            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-full transition-all ${
                nightMode
                  ? "text-warm-400 active:text-warm-200"
                  : "text-warm-500 active:text-warm-700"
              }`}
            >
              {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
