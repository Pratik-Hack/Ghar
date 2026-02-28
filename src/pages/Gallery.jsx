import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { familyMembers, occasions, moods } from "../data/familyData";
import PhotoCard from "../components/PhotoCard";
import PhotoModal from "../components/PhotoModal";
import { FiFilter, FiX, FiGrid, FiColumns } from "react-icons/fi";

export default function Gallery() {
  const { nightMode } = useTheme();
  const { photos, getFilteredPhotos, getYears } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [masonry, setMasonry] = useState(true);

  // Filters
  const [filterMember, setFilterMember] = useState("");
  const [filterOccasion, setFilterOccasion] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMood, setFilterMood] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const years = getYears();

  const filteredPhotos = useMemo(() => {
    return getFilteredPhotos({
      member: filterMember || undefined,
      occasion: filterOccasion || undefined,
      year: filterYear || undefined,
      mood: filterMood || undefined,
      favoritesOnly,
    });
  }, [getFilteredPhotos, filterMember, filterOccasion, filterYear, filterMood, favoritesOnly]);

  const hasActiveFilters = filterMember || filterOccasion || filterYear || filterMood || favoritesOnly;

  const clearFilters = () => {
    setFilterMember("");
    setFilterOccasion("");
    setFilterYear("");
    setFilterMood("");
    setFavoritesOnly(false);
  };

  const selectClass = `px-3 py-2 rounded-lg text-sm border transition-all ${
    nightMode
      ? "bg-[#2D1810] border-warm-800 text-warm-300 focus:border-warm-500"
      : "bg-white border-warm-200 text-warm-700 focus:border-warm-400"
  } outline-none`;

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-display text-3xl font-bold ${
                nightMode ? "text-warm-200" : "text-warm-900"
              }`}
            >
              Photo Gallery
            </motion.h1>
            <p className={`text-sm mt-1 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
              {filteredPhotos.length} of {photos.length} memories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMasonry(!masonry)}
              className={`p-2 rounded-lg ${
                nightMode ? "text-warm-400 hover:bg-warm-800/50" : "text-warm-500 hover:bg-warm-100"
              }`}
            >
              {masonry ? <FiGrid size={20} /> : <FiColumns size={20} />}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                showFilters || hasActiveFilters
                  ? "glow-btn text-white"
                  : nightMode
                  ? "bg-[#2D1810] text-warm-300 hover:bg-warm-800/50"
                  : "bg-white text-warm-600 hover:bg-warm-100 shadow-sm"
              }`}
            >
              <FiFilter size={16} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-xl mb-6 ${
              nightMode ? "bg-[#2D1810]/80" : "bg-white"
            } shadow-md`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {/* Member */}
              <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} className={selectClass}>
                <option value="">All Members</option>
                {Object.values(familyMembers).map((m) => (
                  <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>
                ))}
              </select>

              {/* Occasion */}
              <select value={filterOccasion} onChange={(e) => setFilterOccasion(e.target.value)} className={selectClass}>
                <option value="">All Occasions</option>
                {occasions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>

              {/* Year */}
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={selectClass}>
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              {/* Mood */}
              <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)} className={selectClass}>
                <option value="">All Moods</option>
                {moods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Favorites */}
              <button
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  favoritesOnly
                    ? "bg-rose-warm text-white"
                    : nightMode
                    ? "bg-warm-800/50 text-warm-400"
                    : "bg-warm-50 text-warm-600"
                }`}
              >
                {favoritesOnly ? "❤️ Favorites" : "♡ Favorites"}
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`mt-3 flex items-center gap-1 text-sm ${
                  nightMode ? "text-warm-400" : "text-warm-500"
                } hover:underline`}
              >
                <FiX size={14} /> Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {/* Photos */}
        {filteredPhotos.length > 0 ? (
          masonry ? (
            <div className="masonry-grid">
              {filteredPhotos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={setSelectedPhoto}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={setSelectedPhoto}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">📷</span>
            <p className={`text-lg ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
              {hasActiveFilters ? "No photos match these filters" : "No photos yet. Upload some memories!"}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="glow-btn mt-4 px-6 py-2 rounded-full text-sm">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
