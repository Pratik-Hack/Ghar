import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { useMusic } from "../context/MusicContext";
import { familyMembers, getMemberGreeting } from "../data/familyData";
import { playlists, getPlaylistForMember } from "../data/musicData";
import PhotoCard from "../components/PhotoCard";
import PhotoModal from "../components/PhotoModal";
import { FiMusic, FiArrowLeft } from "react-icons/fi";
import { useState } from "react";

function MemberProfile({ member }) {
  const { nightMode } = useTheme();
  const { getFilteredPhotos } = usePhotos();
  const { autoPlayForContext, playPlaylist } = useMusic();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const memberPhotos = getFilteredPhotos({ member: member.id });
  const playlistKey = getPlaylistForMember(member.id);
  const playlist = playlists[playlistKey];

  useEffect(() => {
    // Auto-slideshow
    if (memberPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % memberPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [memberPhotos.length]);

  const handlePlayMusic = () => {
    autoPlayForContext(`member:${member.id}`);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        {/* Slideshow background */}
        {memberPhotos.length > 0 && (
          <div className="absolute inset-0">
            {memberPhotos.map((photo, i) => (
              <img
                key={photo.id}
                src={photo.src}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === slideIndex ? "opacity-100" : "opacity-0"
                }`}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ))}
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${member.gradientFrom}40 0%, ${
              nightMode ? "#1A0F0A" : "#FFF8F0"
            } 100%)`,
          }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-8">
          <Link
            to="/family"
            className={`inline-flex items-center gap-1 mb-4 text-sm ${
              nightMode ? "text-warm-400" : "text-warm-600"
            } hover:underline`}
          >
            <FiArrowLeft size={14} /> Back to Family
          </Link>

          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})` }}
            >
              {member.emoji}
            </div>
            <div>
              <h1 className={`font-display text-3xl sm:text-4xl font-bold ${
                nightMode ? "text-warm-200" : "text-warm-900"
              }`}>
                {member.name}
              </h1>
              <p className={`font-hand text-xl ${
                nightMode ? "text-warm-400" : "text-warm-500"
              }`}>
                {getMemberGreeting(member.id)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl mb-8 ${
            nightMode ? "bg-[#2D1810]/80" : "bg-white"
          } shadow-md`}
        >
          <p className={`text-lg leading-relaxed ${
            nightMode ? "text-warm-300" : "text-warm-700"
          }`}>
            {member.bio}
          </p>
        </motion.div>

        {/* Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className={`font-display text-xl font-bold mb-4 ${
            nightMode ? "text-warm-200" : "text-warm-800"
          }`}>
            Feelings
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {member.quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl font-hand text-lg ${
                  nightMode ? "bg-[#2D1810]/60 text-warm-300" : "bg-warm-50 text-warm-700"
                }`}
              >
                "{q}"
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl mb-8 ${
            nightMode ? "bg-[#2D1810]/80" : "bg-white"
          } shadow-md`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-display text-xl font-bold ${
              nightMode ? "text-warm-200" : "text-warm-800"
            }`}>
              {playlist?.emoji} {playlist?.name}
            </h2>
            <button
              onClick={handlePlayMusic}
              className="glow-btn px-4 py-2 rounded-full text-sm flex items-center gap-2"
            >
              <FiMusic size={14} /> Play All
            </button>
          </div>
          <div className="space-y-2">
            {playlist?.songs.map((song, i) => (
              <div
                key={song.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  nightMode
                    ? "hover:bg-warm-800/30 text-warm-300"
                    : "hover:bg-warm-50 text-warm-700"
                }`}
              >
                <span className={`text-sm w-6 ${nightMode ? "text-warm-600" : "text-warm-300"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className={`text-xs ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
                    {song.movie} &bull; {song.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={`font-display text-xl font-bold mb-4 ${
            nightMode ? "text-warm-200" : "text-warm-800"
          }`}>
            Memories ({memberPhotos.length})
          </h2>
          {memberPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {memberPhotos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={setSelectedPhoto}
                />
              ))}
            </div>
          ) : (
            <p className={`text-center py-12 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
              No photos yet. Upload some memories!
            </p>
          )}
        </motion.div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          photos={memberPhotos}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}

function FamilyList() {
  const { nightMode } = useTheme();

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-display text-3xl font-bold mb-2 ${
            nightMode ? "text-warm-200" : "text-warm-900"
          }`}
        >
          Our Family
        </motion.h1>
        <p className={`font-hand text-xl mb-8 ${
          nightMode ? "text-warm-400" : "text-warm-500"
        }`}>
          Four hearts, one home
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {Object.values(familyMembers).map((member, i) => (
            <Link key={member.id} to={`/family/${member.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl transition-all cursor-pointer shadow-md hover:shadow-xl ${
                  nightMode ? "bg-[#2D1810]/80" : "bg-white"
                }`}
                style={{
                  borderLeft: `4px solid ${member.color}`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                    style={{ background: `linear-gradient(135deg, ${member.gradientFrom}30, ${member.gradientTo}30)` }}
                  >
                    {member.emoji}
                  </div>
                  <div>
                    <h2 className={`font-display text-xl font-bold ${
                      nightMode ? "text-warm-200" : "text-warm-800"
                    }`}>
                      {member.name}
                    </h2>
                    <p className={`text-sm ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
                      {member.relation}
                    </p>
                  </div>
                </div>
                <p className={`mt-3 text-sm line-clamp-2 ${
                  nightMode ? "text-warm-400" : "text-warm-600"
                }`}>
                  {member.bio}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FamilyProfiles() {
  const { memberId } = useParams();

  if (memberId && familyMembers[memberId]) {
    return <MemberProfile member={familyMembers[memberId]} />;
  }

  return <FamilyList />;
}
