"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  TouchEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionReveal } from "../components/anim";

type Slide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string; alt: string };

type WorkItem = {
  title: string;
  location?: string;
  slides: Slide[];
};

type OpenMedia = {
  cardIdx: number;
  slideIdx: number;
} | null;

const items: WorkItem[] = [
  {
    title: "Modern Bathroom Remodel",
    location: "Silver Spring, MD",
    slides: [
      {
        kind: "image",
        src: "/portfolio/bathroom-thumb.jpg",
        alt: "Bathroom after remodel",
      },
      {
        kind: "video",
        src: "/videos/bathroom-before-after-web.mp4",
        poster: "/portfolio/bathroom-thumb.jpg",
        alt: "Bathroom remodel video",
      },

      {
      kind: "image",
      src: "/portfolio/bathroom-thumb1.jpg",
      alt: "Bathroom remodel alternate angle",
      },
    ],
  },
  {
    title: "Premium Hardwood Flooring",
    location: "Columbia, MD",
    slides: [
      {
        kind: "image",
        src: "/portfolio/Flooring-thumb.jpg",
        alt: "Hardwood flooring being installed",
      },

      {
      kind: "image",
      src: "/portfolio/Flooring-thumb1.jpg", 
      // o usa el nombre REAL: "/portfolio/Flooring-thumb1.jpg.jpeg"
      alt: "Hardwood flooring in blue room",
      },

    ],
  },
  {
    title: "Custom Deck Build",
    location: "Frederick, MD",
    slides: [
      {
        kind: "image",
        src: "/portfolio/Deck1.jpg",
        alt: "Finished custom deck",
      },
      {
        kind: "image",
        src: "/portfolio/Deck2.jpg",
        alt: "Deck construction in progress",
      },
    ],
  },
];

const SWIPE_THRESHOLD = 50; // px to change slide
const DRAG_CLOSE_THRESHOLD = 120; // px to close modal
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

// Helper to compute distance between two touches
function distance(t1: Touch, t2: Touch): number {
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function WorkInAction() {
  const [indexes, setIndexes] = useState<number[]>(() => items.map(() => 0));
  const [openMedia, setOpenMedia] = useState<OpenMedia>(null);

  // swipe left/right in modal
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // pinch-to-zoom state for image inside modal
  const [zoomScale, setZoomScale] = useState(1);
  const pinchState = useRef<{ baseDistance: number; baseScale: number } | null>(
    null
  );

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Card carousel navigation
  const gotoCardSlide = useCallback((cardIdx: number, dir: 1 | -1) => {
    setIndexes((prev) => {
      const next = [...prev];
      const len = items[cardIdx].slides.length;
      next[cardIdx] = (next[cardIdx] + dir + len) % len;
      return next;
    });
  }, []);

  // Modal navigation within current project
  const gotoModalSlide = useCallback((dir: 1 | -1) => {
    setOpenMedia((current) => {
      if (!current) return current;
      const len = items[current.cardIdx].slides.length;
      return {
        ...current,
        slideIdx: (current.slideIdx + dir + len) % len,
      };
    });
  }, []);

  // ESC / Arrow keys in modal
  useEffect(() => {
    if (!openMedia) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMedia(null);
      } else if (e.key === "ArrowRight") {
        gotoModalSlide(1);
      } else if (e.key === "ArrowLeft") {
        gotoModalSlide(-1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMedia, gotoModalSlide]);

  // Touch handlers for swipe in modal (only when not zooming)
  const handleModalTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (zoomScale !== 1) return; // don’t swipe when zoomed
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleModalTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (zoomScale !== 1) return;
    if (touchStartX == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      gotoModalSlide(diff > 0 ? -1 : 1);
    }
    setTouchStartX(null);
  };

  const handleModalKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      gotoModalSlide(1);
    } else if (e.key === "ArrowLeft") {
      gotoModalSlide(-1);
    } else if (e.key === "Escape") {
      setOpenMedia(null);
    }
  };

  // Pinch-to-zoom handlers (on image only)
  const handleImageTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.stopPropagation();
      const d = distance(e.touches[0], e.touches[1]);
      pinchState.current = { baseDistance: d, baseScale: zoomScale };
    }
  };

  const handleImageTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchState.current) {
      e.stopPropagation();
      const d = distance(e.touches[0], e.touches[1]);
      const factor = d / pinchState.current.baseDistance;
      const nextScale = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, pinchState.current.baseScale * factor)
      );
      setZoomScale(nextScale);
    }
  };

  const handleImageTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (pinchState.current && e.touches.length < 2) {
      pinchState.current = null;
      if (zoomScale < 1.05) setZoomScale(1);
    }
  };

  // Reset zoom when changing slide / closing
  useEffect(() => {
    setZoomScale(1);
    pinchState.current = null;
  }, [openMedia?.cardIdx, openMedia?.slideIdx]);

  return (
    <SectionReveal>
      <section id="work" className="py-20 sm:py-24 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900"
          >
            Work in Action
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="mt-4 text-base sm:text-lg md:text-xl text-gray-600"
          >
            Photos &amp; short videos from recent projects across Maryland.
          </motion.p>

          {/* Cards grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, cardIdx) => {
              const slide = item.slides[indexes[cardIdx]];
              const isVideo = slide.kind === "video";

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: cardIdx * 0.08 }}
                  className="group text-left rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Media frame */}
                  <div className="relative w-full overflow-hidden">
                    <div className="w-full" style={{ paddingTop: "56.25%" }} />

                    <div className="absolute inset-0 overflow-hidden">
                      {slide.kind === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          className="w-full h-full object-cover transform transition-transform duration-300 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <video
                          className="w-full h-full object-cover transform transition-transform duration-300 ease-out group-hover:scale-105"
                          muted
                          playsInline
                          preload="metadata"
                          poster={slide.poster}
                        >
                          <source src={slide.src} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>

                    {/* Card arrows */}
                    {item.slides.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous media"
                          onClick={() => gotoCardSlide(cardIdx, -1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-900 text-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="Next media"
                          onClick={() => gotoCardSlide(cardIdx, 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-900 text-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Play / View overlay button */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMedia({ cardIdx, slideIdx: indexes[cardIdx] })
                    }
                      className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-900 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                    >
                      {isVideo ? "Play video" : "View photo"}
                    </button>

                    {/* Slide dots */}
                    {item.slides.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {item.slides.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={() =>
                              setIndexes((prev) => {
                                const next = [...prev];
                                next[cardIdx] = dotIdx;
                                return next;
                              })
                            }
                            aria-label={`Show slide ${
                              dotIdx + 1
                            } of ${item.slides.length}`}
                            className={`h-2.5 w-2.5 rounded-full border border-white/80 ${
                              dotIdx === indexes[cardIdx]
                                ? "bg-green-700"
                                : "bg-white/70"
                            } shadow`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card text */}
                  <div className="p-4 border-t">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    {item.location && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.location}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* MODAL */}
          <AnimatePresence>
            {openMedia && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenMedia(null)}
                role="dialog"
                aria-modal="true"
              >
                <motion.div
                  ref={modalRef}
                  className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900/90 rounded-2xl shadow-2xl flex flex-col"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={handleModalTouchStart}
                  onTouchEnd={handleModalTouchEnd}
                  onKeyDown={handleModalKeyDown}
                  tabIndex={0}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (
                      Math.abs(info.offset.y) > DRAG_CLOSE_THRESHOLD ||
                      Math.abs(info.velocity.y) > 800
                    ) {
                      setOpenMedia(null);
                    }
                  }}
                >
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 text-left">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {items[openMedia.cardIdx].title}
                      </p>
                      {items[openMedia.cardIdx].location && (
                        <p className="text-xs text-gray-300">
                          {items[openMedia.cardIdx].location}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                      onClick={() => setOpenMedia(null)}
                    >
                      Close
                    </button>
                  </div>

                  {/* Media area */}
                  <div className="relative flex-1 flex items-center justify-center px-3 sm:px-6 py-4">
                    <AnimatePresence mode="wait">
                      {(() => {
                        const slide =
                          items[openMedia.cardIdx].slides[
                            openMedia.slideIdx
                          ];

                        if (slide.kind === "video") {
                          return (
                            <motion.video
                              key={`video-${openMedia.cardIdx}-${openMedia.slideIdx}`}
                              controls
                              autoPlay
                              muted
                              playsInline
                              className="w-full max-h-[70vh] rounded-xl shadow-xl bg-black"
                              controlsList="nodownload noplaybackrate"
                              disablePictureInPicture
                              onContextMenu={(e) => e.preventDefault()}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                            >
                              <source src={slide.src} type="video/mp4" />
                              Your browser does not support the video tag.
                            </motion.video>
                          );
                        }

                        // Image with pinch-to-zoom
                        return (
                          <motion.div
                            key={`image-${openMedia.cardIdx}-${openMedia.slideIdx}`}
                            className="w-full max-h-[70vh] flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            onTouchStart={handleImageTouchStart}
                            onTouchMove={handleImageTouchMove}
                            onTouchEnd={handleImageTouchEnd}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.src}
                              alt={slide.alt}
                              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-xl bg-black select-none"
                              style={{
                                transform: `scale(${zoomScale})`,
                                transformOrigin: "center center",
                                transition:
                                  pinchState.current === null
                                    ? "transform 0.2s ease-out"
                                    : "none",
                              }}
                              draggable={false}
                            />
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>

                    {/* Modal arrows */}
                    {items[openMedia.cardIdx].slides.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => gotoModalSlide(-1)}
                          aria-label="Previous media"
                          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-900 text-lg shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => gotoModalSlide(1)}
                          aria-label="Next media"
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-900 text-lg shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails row */}
                  {items[openMedia.cardIdx].slides.length > 1 && (
                    <div className="px-3 sm:px-6 pb-4">
                      <div className="flex items-center justify-center gap-2 overflow-x-auto">
                        {items[openMedia.cardIdx].slides.map(
                          (thumb, thumbIdx) => {
                            const isActive =
                              thumbIdx === openMedia.slideIdx;

                            return (
                              <button
                                key={thumbIdx}
                                type="button"
                                onClick={() =>
                                  setOpenMedia({
                                    ...openMedia,
                                    slideIdx: thumbIdx,
                                  })
                                }
                                className={`relative flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden border ${
                                  isActive
                                    ? "border-green-500 shadow-md"
                                    : "border-white/20 opacity-80 hover:opacity-100"
                                }`}
                                aria-label={`Open slide ${thumbIdx + 1}`}
                              >
                                {thumb.kind === "image" ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={thumb.src}
                                    alt={thumb.alt}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-black flex items-center justify-center text-white text-xs">
                                    ▶
                                  </div>
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </SectionReveal>
  );
}
