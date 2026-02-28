import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "../context/MusicContext";
import { useTheme } from "../context/ThemeContext";
import {
  FiPlus, FiTrash2, FiMusic, FiCheck, FiX,
  FiPlay, FiEdit2, FiSave,
} from "react-icons/fi";

function extractYoutubeId(input) {
  if (!input) return "";
  if (/^[\w-]{11}$/.test(input.trim())) return input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input.trim();
}

export default function ManageSongs() {
  const { nightMode } = useTheme();
  const {
    playlists, playlistsLoading, addSong, removeSong, updateSong,
    playSong, currentSong, isPlaying,
  } = useMusic();
  const [activeTab, setActiveTab] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [movie, setMovie] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [artist, setArtist] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMovie, setEditMovie] = useState("");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");
  const [editArtist, setEditArtist] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const playlistKeys = Object.keys(playlists);
  const selectedKey = activeTab || playlistKeys[0];
  const selectedPlaylist = playlists[selectedKey];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddSong = async () => {
    if (!title.trim() || !youtubeUrl.trim()) return;
    setAdding(true);
    try {
      const youtubeId = extractYoutubeId(youtubeUrl);
      const newSong = {
        id: `song_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        movie: movie.trim() || "Unknown",
        youtubeId,
        artist: artist.trim() || "Unknown",
      };
      await addSong(selectedKey, newSong);
      setTitle("");
      setMovie("");
      setYoutubeUrl("");
      setArtist("");
      setShowAddForm(false);
      showToast("Song added!");
    } catch (error) {
      console.error("Failed to add song:", error);
      showToast("Failed to add song", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveSong = async (song) => {
    setRemoving(song.id);
    try {
      await removeSong(selectedKey, song);
      showToast("Song removed");
    } catch (error) {
      console.error("Failed to remove song:", error);
      showToast("Failed to remove song", "error");
    } finally {
      setRemoving(null);
    }
  };

  const startEdit = (song) => {
    setEditingSong(song.id);
    setEditTitle(song.title);
    setEditMovie(song.movie || "");
    setEditYoutubeUrl(song.youtubeId || "");
    setEditArtist(song.artist || "");
  };

  const cancelEdit = () => {
    setEditingSong(null);
  };

  const handleSaveEdit = async (songId) => {
    if (!editTitle.trim() || !editYoutubeUrl.trim()) return;
    setSaving(true);
    try {
      await updateSong(selectedKey, songId, {
        title: editTitle.trim(),
        movie: editMovie.trim() || "Unknown",
        youtubeId: extractYoutubeId(editYoutubeUrl),
        artist: editArtist.trim() || "Unknown",
      });
      setEditingSong(null);
      showToast("Song updated!");
    } catch (error) {
      console.error("Failed to update song:", error);
      showToast("Failed to update song", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePlaySong = (song) => {
    playSong(song, selectedKey);
  };

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm border transition-all outline-none ${
    nightMode
      ? "bg-[#2D1810] border-warm-800 text-warm-300 focus:border-warm-500 placeholder-warm-600"
      : "bg-white border-warm-200 text-warm-700 focus:border-warm-400 placeholder-warm-400"
  }`;

  const editInputClass = `w-full px-2 py-1.5 rounded-md text-sm border transition-all outline-none ${
    nightMode
      ? "bg-[#1A0F0A] border-warm-700 text-warm-300 focus:border-warm-500 placeholder-warm-600"
      : "bg-warm-50 border-warm-200 text-warm-700 focus:border-warm-400 placeholder-warm-400"
  }`;

  if (playlistsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          <FiMusic />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-display text-3xl font-bold mb-2 ${
            nightMode ? "text-warm-200" : "text-warm-900"
          }`}
        >
          Manage Songs
        </motion.h1>
        <p className={`font-hand text-xl mb-8 ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
          Add, edit, play or remove songs from your playlists
        </p>

        {/* Playlist tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {playlistKeys.map((key) => {
            const pl = playlists[key];
            const isActive = key === selectedKey;
            return (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setShowAddForm(false); setEditingSong(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "glow-btn text-white shadow-md"
                    : nightMode
                    ? "bg-[#2D1810] text-warm-400 hover:text-warm-200 border border-warm-800"
                    : "bg-white text-warm-600 hover:text-warm-800 border border-warm-200 shadow-sm"
                }`}
              >
                <span>{pl.emoji}</span>
                <span>{pl.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20"
                    : nightMode ? "bg-warm-800" : "bg-warm-100"
                }`}>
                  {pl.songs?.length || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Song list */}
        {selectedPlaylist && (
          <motion.div
            key={selectedKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl overflow-hidden ${
              nightMode ? "bg-[#2D1810]/80" : "bg-white"
            } shadow-md`}
          >
            <div className={`px-5 py-4 flex items-center justify-between border-b ${
              nightMode ? "border-warm-800" : "border-warm-100"
            }`}>
              <div>
                <h2 className={`font-display text-lg font-bold ${
                  nightMode ? "text-warm-200" : "text-warm-800"
                }`}>
                  {selectedPlaylist.emoji} {selectedPlaylist.name}
                </h2>
                <p className={`text-sm ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
                  {selectedPlaylist.songs?.length || 0} songs
                </p>
              </div>
              <button
                onClick={() => { setShowAddForm(!showAddForm); setEditingSong(null); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showAddForm
                    ? "bg-warm-200 text-warm-700"
                    : "glow-btn text-white"
                }`}
              >
                {showAddForm ? <FiX size={16} /> : <FiPlus size={16} />}
                {showAddForm ? "Cancel" : "Add Song"}
              </button>
            </div>

            {/* Add song form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`px-5 py-4 space-y-3 border-b ${
                    nightMode ? "border-warm-800 bg-[#241008]" : "border-warm-100 bg-warm-50"
                  }`}>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`text-xs font-medium block mb-1 ${
                          nightMode ? "text-warm-400" : "text-warm-600"
                        }`}>Song Title *</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Kal Ho Naa Ho"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={`text-xs font-medium block mb-1 ${
                          nightMode ? "text-warm-400" : "text-warm-600"
                        }`}>Movie / Album</label>
                        <input
                          type="text"
                          value={movie}
                          onChange={(e) => setMovie(e.target.value)}
                          placeholder="e.g. Kal Ho Naa Ho"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`text-xs font-medium block mb-1 ${
                          nightMode ? "text-warm-400" : "text-warm-600"
                        }`}>YouTube URL or Video ID *</label>
                        <input
                          type="text"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          placeholder="e.g. https://youtube.com/watch?v=... or dQw4w9WgXcQ"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={`text-xs font-medium block mb-1 ${
                          nightMode ? "text-warm-400" : "text-warm-600"
                        }`}>Artist</label>
                        <input
                          type="text"
                          value={artist}
                          onChange={(e) => setArtist(e.target.value)}
                          placeholder="e.g. Sonu Nigam"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddSong}
                      disabled={adding || !title.trim() || !youtubeUrl.trim()}
                      className={`glow-btn text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        adding || !title.trim() || !youtubeUrl.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {adding ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <FiMusic size={14} />
                        </motion.span>
                      ) : (
                        <FiPlus size={14} />
                      )}
                      {adding ? "Adding..." : "Add to Playlist"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Songs list */}
            <div className={`divide-y ${nightMode ? "divide-warm-800/50" : "divide-warm-100"}`}>
              {(!selectedPlaylist.songs || selectedPlaylist.songs.length === 0) ? (
                <div className={`px-5 py-12 text-center ${
                  nightMode ? "text-warm-500" : "text-warm-400"
                }`}>
                  <FiMusic size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No songs in this playlist yet.</p>
                  <p className="text-xs mt-1">Click "Add Song" to get started!</p>
                </div>
              ) : (
                selectedPlaylist.songs.map((song, i) => {
                  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
                  const isEditing = editingSong === song.id;

                  return (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      {isEditing ? (
                        /* Edit mode */
                        <div className={`px-5 py-4 space-y-3 ${
                          nightMode ? "bg-[#241008]" : "bg-warm-50"
                        }`}>
                          <div className="grid sm:grid-cols-2 gap-2">
                            <div>
                              <label className={`text-xs block mb-0.5 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>Title</label>
                              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={editInputClass} />
                            </div>
                            <div>
                              <label className={`text-xs block mb-0.5 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>Movie</label>
                              <input type="text" value={editMovie} onChange={(e) => setEditMovie(e.target.value)} className={editInputClass} />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            <div>
                              <label className={`text-xs block mb-0.5 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>YouTube ID / URL</label>
                              <input type="text" value={editYoutubeUrl} onChange={(e) => setEditYoutubeUrl(e.target.value)} className={editInputClass} />
                            </div>
                            <div>
                              <label className={`text-xs block mb-0.5 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>Artist</label>
                              <input type="text" value={editArtist} onChange={(e) => setEditArtist(e.target.value)} className={editInputClass} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(song.id)}
                              disabled={saving || !editTitle.trim() || !editYoutubeUrl.trim()}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium glow-btn text-white ${
                                saving || !editTitle.trim() || !editYoutubeUrl.trim() ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <FiSave size={13} />
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${
                                nightMode ? "bg-warm-800 text-warm-300" : "bg-warm-100 text-warm-600"
                              }`}
                            >
                              <FiX size={13} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal view */
                        <div className={`flex items-center gap-3 px-5 py-3 group transition-colors ${
                          nightMode ? "hover:bg-warm-800/20" : "hover:bg-warm-50"
                        }`}>
                          {/* Play button */}
                          <button
                            onClick={() => handlePlaySong(song)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isCurrentlyPlaying
                                ? "glow-btn text-white"
                                : nightMode
                                ? "bg-warm-800/50 text-warm-400 hover:text-warm-200 group-hover:bg-warm-700/50"
                                : "bg-warm-100 text-warm-500 hover:text-warm-700 group-hover:bg-warm-200"
                            }`}
                          >
                            {isCurrentlyPlaying ? (
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            ) : (
                              <FiPlay size={14} className="ml-0.5" />
                            )}
                          </button>

                          {/* Song info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isCurrentlyPlaying
                                ? "text-sunset"
                                : nightMode ? "text-warm-200" : "text-warm-800"
                            }`}>
                              {song.title}
                            </p>
                            <p className={`text-xs truncate ${
                              nightMode ? "text-warm-500" : "text-warm-400"
                            }`}>
                              {song.movie}{song.artist ? ` \u2022 ${song.artist}` : ""}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => startEdit(song)}
                              className={`p-2 rounded-lg transition-all ${
                                nightMode
                                  ? "text-warm-500 hover:text-warm-200 hover:bg-warm-800/40"
                                  : "text-warm-400 hover:text-warm-700 hover:bg-warm-100"
                              }`}
                              title="Edit song"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleRemoveSong(song)}
                              disabled={removing === song.id}
                              className={`p-2 rounded-lg transition-all ${
                                removing === song.id
                                  ? "opacity-100"
                                  : nightMode
                                  ? "text-warm-500 hover:text-red-400 hover:bg-red-900/20"
                                  : "text-warm-400 hover:text-red-500 hover:bg-red-50"
                              }`}
                              title="Remove song"
                            >
                              {removing === song.id ? (
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <FiMusic size={14} />
                                </motion.span>
                              ) : (
                                <FiTrash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white flex items-center gap-2 shadow-xl ${
                toast.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {toast.type === "error" ? <FiX size={18} /> : <FiCheck size={18} />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
