import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { familyMembers, occasions, moods } from "../data/familyData";
import { FiUpload, FiX, FiCheck, FiImage } from "react-icons/fi";

export default function Upload() {
  const { nightMode } = useTheme();
  const { addPhotos } = usePhotos();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Common fields for batch
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [occasion, setOccasion] = useState("");
  const [mood, setMood] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [caption, setCaption] = useState("");

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const onDrop = useCallback((acceptedFiles) => {
    const oversized = acceptedFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError(`${oversized.length} file(s) exceed 10MB limit and were skipped.`);
      setTimeout(() => setError(""), 4000);
    }
    const validFiles = acceptedFiles.filter((f) => f.size <= MAX_FILE_SIZE);
    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    multiple: true,
  });

  const removeFile = (id) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((m) => m !== memberId)
        : [...prev, memberId]
    );
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const photosToUpload = files.map((f) => ({
        file: f.file,
        members: selectedMembers.length > 0 ? selectedMembers : ["me"],
        occasion: occasion || "Random Day",
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        mood: mood || "Happy",
        caption: caption || "A beautiful memory",
      }));

      await addPhotos(photosToUpload);

      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setSelectedMembers([]);
      setOccasion("");
      setMood("");
      setCaption("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUploading(false);
    }
  };

  const selectClass = `w-full px-3 py-2 rounded-lg text-sm border transition-all outline-none ${
    nightMode
      ? "bg-[#2D1810] border-warm-800 text-warm-300 focus:border-warm-500"
      : "bg-white border-warm-200 text-warm-700 focus:border-warm-400"
  }`;

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
          Upload Memories
        </motion.h1>
        <p className={`font-hand text-xl mb-8 ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
          Add new photos to your family collection
        </p>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-sunset bg-sunset/10"
              : nightMode
              ? "border-warm-700 hover:border-warm-500 bg-[#2D1810]/50"
              : "border-warm-300 hover:border-warm-400 bg-warm-50"
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload size={40} className={`mx-auto mb-3 ${
            nightMode ? "text-warm-500" : "text-warm-400"
          }`} />
          <p className={`text-lg font-medium ${nightMode ? "text-warm-300" : "text-warm-600"}`}>
            {isDragActive ? "Drop your photos here!" : "Drag & drop photos here"}
          </p>
          <p className={`text-sm mt-1 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
            or click to browse (JPG, PNG, WebP)
          </p>
        </motion.div>

        {/* Preview grid */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <h3 className={`font-medium mb-3 ${nightMode ? "text-warm-300" : "text-warm-700"}`}>
              Selected Photos ({files.length})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {files.map((f) => (
                <div key={f.id} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img
                    src={f.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tagging form */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-6 rounded-2xl ${
              nightMode ? "bg-[#2D1810]/80" : "bg-white"
            } shadow-md`}
          >
            <h3 className={`font-display text-lg font-bold mb-4 ${
              nightMode ? "text-warm-200" : "text-warm-800"
            }`}>
              Tag These Memories
            </h3>

            {/* Members */}
            <div className="mb-4">
              <label className={`text-sm font-medium block mb-2 ${
                nightMode ? "text-warm-400" : "text-warm-600"
              }`}>
                Who's in these photos?
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(familyMembers).map((member) => (
                  <button
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedMembers.includes(member.id)
                        ? "text-white shadow-md"
                        : nightMode
                        ? "bg-warm-800/50 text-warm-400 hover:bg-warm-700/50"
                        : "bg-warm-50 text-warm-600 hover:bg-warm-100"
                    }`}
                    style={
                      selectedMembers.includes(member.id)
                        ? { background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})` }
                        : {}
                    }
                  >
                    {member.emoji} {member.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion & Mood */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  nightMode ? "text-warm-400" : "text-warm-600"
                }`}>Occasion</label>
                <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={selectClass}>
                  <option value="">Select occasion</option>
                  {occasions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  nightMode ? "text-warm-400" : "text-warm-600"
                }`}>Mood</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)} className={selectClass}>
                  <option value="">Select mood</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  nightMode ? "text-warm-400" : "text-warm-600"
                }`}>Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1990"
                  max="2030"
                  className={selectClass}
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  nightMode ? "text-warm-400" : "text-warm-600"
                }`}>Month</label>
                <input
                  type="number"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  min="1"
                  max="12"
                  className={selectClass}
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  nightMode ? "text-warm-400" : "text-warm-600"
                }`}>Day</label>
                <input
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  min="1"
                  max="31"
                  className={selectClass}
                />
              </div>
            </div>

            {/* Caption */}
            <div className="mb-6">
              <label className={`text-sm font-medium block mb-1 ${
                nightMode ? "text-warm-400" : "text-warm-600"
              }`}>Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe this memory..."
                className={selectClass}
              />
            </div>

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full glow-btn py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FiImage size={18} />
                  </motion.div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload size={18} />
                  Upload {files.length} Photo{files.length > 1 ? "s" : ""}
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-green-500 text-white flex items-center gap-2 shadow-xl"
            >
              <FiCheck size={18} />
              Photos uploaded successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-red-500 text-white flex items-center gap-2 shadow-xl"
            >
              <FiX size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
