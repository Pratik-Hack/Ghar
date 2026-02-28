import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    togglePlay, toggleMute, changeVolume, handleNext, handlePrev,
    setShuffle, setRepeat, playlists,
  } = useMusic();
  const { nightMode } = useTheme();
  const [expanded, setExpanded] = useState(false);

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
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {playlistInfo.songs.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => playSong(song, currentPlaylist)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        song.id === currentSong?.id
                          ? nightMode
                            ? "bg-warm-700/30 text-warm-200"
                            : "bg-warm-100 text-warm-800"
                          : nightMode
                          ? "text-warm-400 hover:bg-warm-800/30"
                          : "text-warm-600 hover:bg-warm-50"
                      }`}
                    >
                      {song.id === currentSong?.id && (
                        <span className="w-2 h-2 bg-sunset rounded-full animate-pulse" />
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

            {/* Volume slider */}
            <div className="flex items-center gap-3 pb-2">
              <button onClick={toggleMute} className={nightMode ? "text-warm-400" : "text-warm-600"}>
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

      {/* Mini player bar */}
      <div className="px-4 py-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Song info */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              nightMode ? "bg-warm-800/50" : "bg-warm-100"
            }`}>
              <FiMusic size={18} className={`${nightMode ? "text-warm-400" : "text-warm-600"} ${isPlaying ? "animate-pulse" : ""}`} />
            </div>
            <div className="text-left min-w-0">
              <p className={`text-sm font-semibold truncate ${
                nightMode ? "text-warm-200" : "text-warm-800"
              }`}>
                {currentSong?.title || "No song playing"}
              </p>
              <p className={`text-xs truncate ${
                nightMode ? "text-warm-500" : "text-warm-400"
              }`}>
                {currentSong?.movie || "Select a song"}
              </p>
            </div>
            {expanded ? (
              <FiChevronDown size={16} className={`flex-shrink-0 ${nightMode ? "text-warm-500" : "text-warm-400"}`} />
            ) : (
              <FiChevronUp size={16} className={`flex-shrink-0 ${nightMode ? "text-warm-500" : "text-warm-400"}`} />
            )}
          </button>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-1.5 rounded-full transition-all hidden sm:block ${
                shuffle
                  ? "text-sunset"
                  : nightMode
                  ? "text-warm-500 hover:text-warm-300"
                  : "text-warm-400 hover:text-warm-600"
              }`}
            >
              <FiShuffle size={14} />
            </button>

            <button
              onClick={handlePrev}
              className={`p-2 rounded-full transition-all ${
                nightMode
                  ? "text-warm-300 hover:text-warm-100"
                  : "text-warm-600 hover:text-warm-800"
              }`}
            >
              <FiSkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full glow-btn text-white"
            >
              {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
            </button>

            <button
              onClick={handleNext}
              className={`p-2 rounded-full transition-all ${
                nightMode
                  ? "text-warm-300 hover:text-warm-100"
                  : "text-warm-600 hover:text-warm-800"
              }`}
            >
              <FiSkipForward size={18} />
            </button>

            <button
              onClick={() => setRepeat(!repeat)}
              className={`p-1.5 rounded-full transition-all hidden sm:block ${
                repeat
                  ? "text-sunset"
                  : nightMode
                  ? "text-warm-500 hover:text-warm-300"
                  : "text-warm-400 hover:text-warm-600"
              }`}
            >
              <FiRepeat size={14} />
            </button>

            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-full transition-all ${
                nightMode
                  ? "text-warm-400 hover:text-warm-200"
                  : "text-warm-500 hover:text-warm-700"
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
