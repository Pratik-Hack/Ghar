import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { FiX, FiHeart, FiChevronLeft, FiChevronRight, FiTrash2, FiEdit3, FiCheck } from "react-icons/fi";
import { useState } from "react";
import { occasions, moods, familyMembers } from "../data/familyData";

const memberKeys = Object.keys(familyMembers);

export default function PhotoModal({ photo, photos, onClose }) {
  const { nightMode } = useTheme();
  const { toggleFavorite, favorites, deletePhoto, updatePhoto } = usePhotos();
  const [imgError, setImgError] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(photo);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await deletePhoto(currentPhoto.id);
    setDeleting(false);
    setConfirmDelete(false);
    onClose();
  };

  const startEdit = () => {
    setEditData({
      caption: currentPhoto.caption || "",
      occasion: currentPhoto.occasion || "",
      mood: currentPhoto.mood || "",
      year: currentPhoto.year || new Date().getFullYear(),
      month: currentPhoto.month || 1,
      day: currentPhoto.day || 1,
      members: currentPhoto.members || [],
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePhoto(currentPhoto.id, editData);
    setCurrentPhoto({ ...currentPhoto, ...editData });
    setSaving(false);
    setEditing(false);
  };

  const toggleMember = (key) => {
    setEditData((prev) => ({
      ...prev,
      members: prev.members.includes(key)
        ? prev.members.filter((m) => m !== key)
        : [...prev.members, key],
    }));
  };

  if (!currentPhoto) return null;

  const isFav = favorites.has(currentPhoto.id);
  const currentIdx = photos?.findIndex((p) => p.id === currentPhoto.id) ?? -1;

  const goNext = () => {
    if (photos && currentIdx < photos.length - 1) {
      setCurrentPhoto(photos[currentIdx + 1]);
      setImgError(false);
      setEditing(false);
    }
  };

  const goPrev = () => {
    if (photos && currentIdx > 0) {
      setCurrentPhoto(photos[currentIdx - 1]);
      setImgError(false);
      setEditing(false);
    }
  };

  const inputClass = `w-full px-2 py-1.5 rounded-lg text-sm border outline-none transition-all ${
    nightMode
      ? "bg-warm-900/50 border-warm-700/50 text-warm-200 focus:border-sunset/50"
      : "bg-warm-50 border-warm-200 text-warm-800 focus:border-sunset/50"
  }`;

  const selectClass = `px-2 py-1.5 rounded-lg text-sm border outline-none transition-all ${
    nightMode
      ? "bg-warm-900/50 border-warm-700/50 text-warm-200 focus:border-sunset/50"
      : "bg-warm-50 border-warm-200 text-warm-800 focus:border-sunset/50"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Close button - fixed position, always accessible */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[110] p-2.5 rounded-full bg-black/50 text-white/90 hover:bg-black/70 hover:text-white transition-all backdrop-blur-sm"
      >
        <FiX size={22} />
      </button>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden">
          {imgError ? (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-warm-900/50 rounded-xl">
              <span className="text-6xl mb-4">📸</span>
              <p className="text-warm-300 font-hand text-xl">{currentPhoto.caption || "A beautiful memory"}</p>
            </div>
          ) : (
            <img
              src={currentPhoto.src}
              alt={currentPhoto.caption}
              className="max-w-full max-h-[70vh] object-contain rounded-xl"
              onError={() => setImgError(true)}
            />
          )}

          {/* Navigation arrows */}
          {photos && currentIdx > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          {photos && currentIdx < photos.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
            >
              <FiChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Info bar */}
        <div className={`mt-3 p-4 rounded-xl ${
          nightMode ? "bg-[#2D1810]/90" : "bg-white/90"
        } backdrop-blur-sm`}>
          {editing ? (
            /* Edit mode */
            <div className="space-y-3">
              {/* Caption */}
              <input
                type="text"
                value={editData.caption}
                onChange={(e) => setEditData({ ...editData, caption: e.target.value })}
                placeholder="Caption"
                className={inputClass}
              />

              {/* Occasion + Mood row */}
              <div className="flex gap-2">
                <select
                  value={editData.occasion}
                  onChange={(e) => setEditData({ ...editData, occasion: e.target.value })}
                  className={`flex-1 ${selectClass}`}
                >
                  <option value="">Occasion</option>
                  {occasions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <select
                  value={editData.mood}
                  onChange={(e) => setEditData({ ...editData, mood: e.target.value })}
                  className={`flex-1 ${selectClass}`}
                >
                  <option value="">Mood</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Date row */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={editData.day}
                  onChange={(e) => setEditData({ ...editData, day: parseInt(e.target.value) || 1 })}
                  min="1" max="31"
                  placeholder="Day"
                  className={`w-20 ${inputClass}`}
                />
                <input
                  type="number"
                  value={editData.month}
                  onChange={(e) => setEditData({ ...editData, month: parseInt(e.target.value) || 1 })}
                  min="1" max="12"
                  placeholder="Month"
                  className={`w-20 ${inputClass}`}
                />
                <input
                  type="number"
                  value={editData.year}
                  onChange={(e) => setEditData({ ...editData, year: parseInt(e.target.value) || 2024 })}
                  min="1990" max="2030"
                  placeholder="Year"
                  className={`w-24 ${inputClass}`}
                />
              </div>

              {/* Members */}
              <div className="flex flex-wrap gap-2">
                {memberKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleMember(key)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                      editData.members.includes(key)
                        ? "bg-sunset text-white"
                        : nightMode
                        ? "bg-warm-800/50 text-warm-400 hover:bg-warm-700/50"
                        : "bg-warm-100 text-warm-500 hover:bg-warm-200"
                    }`}
                  >
                    {familyMembers[key].emoji} {familyMembers[key].name}
                  </button>
                ))}
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                    saving ? "opacity-50" : ""
                  } bg-sunset text-white hover:bg-sunset/90`}
                >
                  <FiCheck size={14} />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    nightMode
                      ? "bg-warm-800/50 text-warm-300 hover:bg-warm-700/50"
                      : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`font-hand text-xl ${
                  nightMode ? "text-warm-200" : "text-warm-800"
                }`}>
                  {currentPhoto.caption}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {currentPhoto.occasion && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      nightMode ? "bg-warm-800/50 text-warm-300" : "bg-warm-100 text-warm-600"
                    }`}>
                      {currentPhoto.occasion}
                    </span>
                  )}
                  {currentPhoto.mood && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      nightMode ? "bg-warm-800/50 text-warm-300" : "bg-warm-100 text-warm-600"
                    }`}>
                      {currentPhoto.mood}
                    </span>
                  )}
                  {currentPhoto.year && (
                    <span className={`text-xs ${
                      nightMode ? "text-warm-500" : "text-warm-400"
                    }`}>
                      {currentPhoto.day}/{currentPhoto.month}/{currentPhoto.year}
                    </span>
                  )}
                  {currentPhoto.members?.map((m) => (
                    <span key={m} className={`text-xs px-2 py-1 rounded-full ${
                      nightMode ? "bg-warm-800/50 text-warm-300" : "bg-warm-100 text-warm-600"
                    }`}>
                      {familyMembers[m]?.name || m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={startEdit}
                  className={`p-2 rounded-full transition-all ${
                    nightMode
                      ? "bg-warm-800/50 text-warm-400 hover:text-sunset"
                      : "bg-warm-100 text-warm-400 hover:text-sunset"
                  }`}
                  title="Edit details"
                >
                  <FiEdit3 size={20} />
                </button>
                <button
                  onClick={() => toggleFavorite(currentPhoto.id)}
                  className={`p-2 rounded-full transition-all ${
                    isFav
                      ? "bg-rose-warm text-white"
                      : nightMode
                      ? "bg-warm-800/50 text-warm-400 hover:text-rose-warm"
                      : "bg-warm-100 text-warm-400 hover:text-rose-warm"
                  }`}
                >
                  <FiHeart size={20} fill={isFav ? "white" : "none"} />
                </button>
                <button
                  onClick={handleDelete}
                  onBlur={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className={`p-2 rounded-full transition-all ${
                    confirmDelete
                      ? "bg-red-500 text-white"
                      : nightMode
                      ? "bg-warm-800/50 text-warm-400 hover:text-red-400"
                      : "bg-warm-100 text-warm-400 hover:text-red-500"
                  } ${deleting ? "opacity-50" : ""}`}
                  title={confirmDelete ? "Click again to confirm" : "Delete photo"}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
