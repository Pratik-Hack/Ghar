import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { useMusic } from "../context/MusicContext";
import { getGreeting, getRandomQuote, familyMembers } from "../data/familyData";
import { getTimeBasedPlaylist, isNightMode } from "../data/musicData";
import PhotoCard from "../components/PhotoCard";
import PhotoModal from "../components/PhotoModal";
import { FiHeart, FiMusic, FiStar, FiArrowRight } from "react-icons/fi";

export default function Home() {
  const { nightMode, festival } = useTheme();
  const { photos, getRandomPhoto, getOnThisDayPhotos } = usePhotos();
  const { autoPlayForContext, showPlayer, isMuted, toggleMute } = useMusic();
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [onThisDay, setOnThisDay] = useState([]);
  const [missingPhoto, setMissingPhoto] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setQuote(getRandomQuote());
    setHeroPhoto(getRandomPhoto());
    setOnThisDay(getOnThisDayPhotos());
  }, [getRandomPhoto, getOnThisDayPhotos]);

  const handleMissingThem = () => {
    const photo = getRandomPhoto();
    setMissingPhoto(photo);
    autoPlayForContext("missing");
  };

  const handleStartMusic = () => {
    if (isNightMode()) {
      autoPlayForContext("lateNight");
    } else {
      autoPlayForContext("auto");
    }
    if (isMuted) toggleMute();
  };

  const timePl = getTimeBasedPlaylist();

  return (
    <div className="min-h-screen pb-28">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background photo with overlay */}
        {heroPhoto && (
          <div className="absolute inset-0">
            <img
              src={heroPhoto.src}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className={`absolute inset-0 ${
              nightMode
                ? "bg-gradient-to-b from-[#1A0F0A]/80 via-[#1A0F0A]/60 to-[#1A0F0A]"
                : "bg-gradient-to-b from-warm-50/80 via-warm-50/60 to-warm-50"
            }`} />
          </div>
        )}

        {/* If no photo, gradient background */}
        {!heroPhoto && (
          <div className={`absolute inset-0 ${
            nightMode
              ? "bg-gradient-to-br from-[#1A0F0A] via-[#2D1810] to-[#1A0F0A]"
              : "bg-gradient-to-br from-warm-100 via-warm-50 to-warm-200"
          }`} />
        )}

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          {/* Festival badge */}
          {festival && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-bold"
            >
              {festival === "diwali" && "🪔 Happy Diwali!"}
              {festival === "holi" && "🎨 Happy Holi!"}
              {festival === "rakshaBandhan" && "🪢 Happy Raksha Bandhan!"}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ${
              nightMode ? "text-warm-200" : "text-warm-900"
            }`}
          >
            {greeting}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`font-hand text-2xl sm:text-3xl mb-2 ${
              nightMode ? "text-warm-400" : "text-warm-600"
            }`}
          >
            "{quote}"
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-sm mb-8 ${nightMode ? "text-warm-500" : "text-warm-400"}`}
          >
            {timePl.message}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={handleMissingThem}
              className="glow-btn px-6 py-3 rounded-full text-base flex items-center gap-2"
            >
              <FiHeart size={18} />
              Missing Them?
            </button>

            <button
              onClick={handleStartMusic}
              className={`px-6 py-3 rounded-full text-base flex items-center gap-2 border-2 transition-all ${
                nightMode
                  ? "border-warm-600 text-warm-300 hover:bg-warm-800/30"
                  : "border-warm-400 text-warm-700 hover:bg-warm-100"
              }`}
            >
              <FiMusic size={18} />
              Play Music
            </button>

            <Link
              to="/surprise"
              className={`px-6 py-3 rounded-full text-base flex items-center gap-2 border-2 transition-all ${
                nightMode
                  ? "border-warm-600 text-warm-300 hover:bg-warm-800/30"
                  : "border-warm-400 text-warm-700 hover:bg-warm-100"
              }`}
            >
              <FiStar size={18} />
              Surprise Me!
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Missing Them — random photo popup */}
      {missingPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          onClick={() => setMissingPhoto(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className={`relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl ${
              nightMode ? "bg-[#2D1810]" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80">
              <img
                src={missingPhoto.src}
                alt={missingPhoto.caption}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-6 text-center">
              <p className={`font-hand text-2xl ${
                nightMode ? "text-warm-200" : "text-warm-800"
              }`}>
                {missingPhoto.caption || "They're always with you in heart"}
              </p>
              <p className={`text-sm mt-2 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
                Kolhapur is just one thought away...
              </p>
              <button
                onClick={() => setMissingPhoto(null)}
                className="glow-btn mt-4 px-6 py-2 rounded-full text-sm"
              >
                Hold Them Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* On This Day */}
      {onThisDay.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`font-display text-2xl font-bold mb-6 flex items-center gap-2 ${
              nightMode ? "text-warm-200" : "text-warm-800"
            }`}>
              📅 On This Day
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {onThisDay.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={setSelectedPhoto}
                />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Family Members Quick Access */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`font-display text-2xl font-bold mb-8 text-center ${
            nightMode ? "text-warm-200" : "text-warm-800"
          }`}>
            Our Family
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Object.values(familyMembers).map((member, i) => (
              <Link key={member.id} to={`/family/${member.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Gradient background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(145deg, ${member.gradientFrom}, ${member.gradientTo})`,
                    }}
                  />
                  {/* Decorative circles */}
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
                    style={{ background: member.gradientTo }}
                  />
                  <div
                    className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-15"
                    style={{ background: member.gradientFrom }}
                  />

                  <div className="relative p-6 text-center">
                    {/* Avatar circle */}
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                      <span className="text-3xl">{member.emoji}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-white/70 mt-0.5">
                      {member.relation}
                    </p>
                    <p className="font-hand text-sm text-white/50 mt-2 line-clamp-1">
                      {member.tagline}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Recent Memories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-display text-2xl font-bold ${
              nightMode ? "text-warm-200" : "text-warm-800"
            }`}>
              Recent Memories
            </h2>
            <Link
              to="/gallery"
              className={`flex items-center gap-1 text-sm font-medium ${
                nightMode ? "text-warm-400 hover:text-warm-300" : "text-warm-600 hover:text-warm-800"
              }`}
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.slice(0, 8).map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                onClick={setSelectedPhoto}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Photo modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
