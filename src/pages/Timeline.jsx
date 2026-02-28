import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { useMusic } from "../context/MusicContext";
import PhotoCard from "../components/PhotoCard";
import PhotoModal from "../components/PhotoModal";

const monthNames = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Timeline() {
  const { nightMode } = useTheme();
  const { getTimelineData, photos } = usePhotos();
  const { autoPlayForContext } = useMusic();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const timelineData = getTimelineData();
  const years = Object.keys(timelineData).sort((a, b) => b - a);

  useEffect(() => {
    autoPlayForContext("timeline");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

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
          Memory Timeline
        </motion.h1>
        <p className={`font-hand text-xl mb-8 ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
          A journey through our moments together...
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 ${
            nightMode ? "bg-warm-800" : "bg-warm-200"
          }`} />

          {years.map((year, yearIdx) => (
            <div key={year} className="mb-12">
              {/* Year marker */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-start sm:justify-center mb-8"
              >
                <div className={`z-10 px-6 py-2 rounded-full font-display text-xl font-bold shadow-lg ${
                  nightMode
                    ? "bg-warm-800 text-warm-200"
                    : "bg-warm-500 text-white"
                }`}>
                  {year}
                </div>
              </motion.div>

              {/* Photos for this year */}
              {timelineData[year].map((photo, photoIdx) => {
                const isLeft = photoIdx % 2 === 0;

                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: photoIdx * 0.05 }}
                    className={`relative mb-8 flex items-start ${
                      isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                    } flex-row`}
                  >
                    {/* Dot on timeline */}
                    <div className={`absolute left-4 sm:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-6 z-10 ${
                      nightMode ? "bg-warm-500" : "bg-sunset"
                    }`} />

                    {/* Spacer for mobile */}
                    <div className="w-10 sm:hidden flex-shrink-0" />

                    {/* Card */}
                    <div className={`flex-1 ${isLeft ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                      <div className={`inline-block text-left max-w-sm w-full`}>
                        {/* Date */}
                        <p className={`text-xs mb-2 ${nightMode ? "text-warm-500" : "text-warm-400"}`}>
                          {photo.day && photo.month
                            ? `${monthNames[photo.month]} ${photo.day}, ${photo.year}`
                            : photo.month
                            ? `${monthNames[photo.month]} ${photo.year}`
                            : year
                          }
                          {photo.occasion && ` — ${photo.occasion}`}
                        </p>

                        <PhotoCard
                          photo={photo}
                          index={photoIdx}
                          onClick={setSelectedPhoto}
                        />

                        {/* Caption below card */}
                        <p className={`font-hand text-base mt-2 ${
                          nightMode ? "text-warm-400" : "text-warm-600"
                        }`}>
                          {photo.caption}
                        </p>
                      </div>
                    </div>

                    {/* Other side spacer */}
                    <div className="hidden sm:block flex-1" />
                  </motion.div>
                );
              })}
            </div>
          ))}

          {years.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">🕐</span>
              <p className={`text-lg ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
                No memories in the timeline yet. Upload some photos to get started!
              </p>
            </div>
          )}
        </div>
      </div>

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
