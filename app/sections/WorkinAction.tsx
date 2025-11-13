"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionReveal } from "../components/anim";

type Slide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string; alt: string };

type WorkItem = {
  title: string;
  location?: string;
  slides: Slide[];
};

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
        kind: "image",
        src: "/portfolio/bathroom-thumb1.jpg",
        alt: "Alternative bathroom view",
      },
      {
        kind: "video",
        src: "/videos/bathroom-before-after-web.mp4",
        poster: "/portfolio/bathroom-thumb.jpg",
        alt: "Bathroom remodel video",
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
        alt: "Finished hardwood flooring",
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
        alt: "Finished deck",
      },
      {
        kind: "image",
        src: "/portfolio/Deck2.jpg",
        alt: "Deck build in progress",
      },
    ],
  },
];

// Para pinch-to-zoom solo necesitamos estos campos
type SimpleTouch = { clientX: number; clientY: number };

const distance = (a: SimpleTouch, b: SimpleTouch) => {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export default function WorkInAction() {
  // Índice de slide por tarjeta
  const [indexes, setIndexes] = useState<number[]>(() =>
    items.map(() => 0)
  );

  // Modal abierto: qué item y qué slide
  const [open, setOpen] = useState<{
    itemIndex: number;
    slideIndex: number;
  } | null>(null);

  // Zoom y gesto
  const [zoomScale, setZoomScale] = useState(1);
  const pinchState = useRef<{ baseDistance: number; baseScale: number } | null>(
    null
  );
  const dragStartY = useRef<number | null>(null);
  const dragDeltaY = useRef(0);

  // Cerrar con ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (!open) return;

      if (e.key === "ArrowRight") goModal(1);
      if (e.key === "ArrowLeft") goModal(-1);
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const gotoCardSlide = (cardIdx: number, dir: 1 | -1) => {
    setIndexes((prev) => {
      const next = [...prev];
      const len = items[cardIdx].slides.length;
      next[cardIdx] = (next[cardIdx] + dir + len) % len;
      return next;
    });
  };

  const openModal = (cardIdx: number, slideIdx: number) => {
    setZoomScale(1);
    pinchState.current = null;
    dragStartY.current = null;
    dragDeltaY.current = 0;
    setOpen({ itemIndex: cardIdx, slideIndex: slideIdx });
  };

  const closeModal = () => {
    setOpen(null);
  };

  const goModal = (dir: 1 | -1) => {
    if (!open) return;
    const item = items[open.itemIndex];
    const len = item.slides.length;
    const nextIndex = (open.slideIndex + dir + len) % len;
    setZoomScale(1);
    pinchState.current = null;
    setOpen({ ...open, slideIndex: nextIndex });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      dragStartY.current = e.touches[0].clientY;
      dragDeltaY.current = 0;
    }
    if (e.touches.length === 2) {
      e.stopPropagation();
      const d = distance(e.touches[0], e.touches[1]);
      pinchState.current = { baseDistance: d, baseScale: zoomScale };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && dragStartY.current != null) {
      const currentY = e.touches[0].clientY;
      dragDeltaY.current = currentY - dragStartY.current;
    }

    if (e.touches.length === 2 && pinchState.current) {
      e.preventDefault();
      e.stopPropagation();
      const d = distance(e.touches[0], e.touches[1]);
      const { baseDistance, baseScale } = pinchState.current;
      if (baseDistance > 0) {
        const scale = clamp((d / baseDistance) * baseScale, 1, 4);
        setZoomScale(scale);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) {
      // Drag to close
      if (Math.abs(dragDeltaY.current) > 120 && zoomScale <= 1.05) {
        closeModal();
      }
      dragStartY.current = null;
      dragDeltaY.current = 0;
      pinchState.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStartY.current = e.clientY;
    dragDeltaY.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStartY.current != null) {
      dragDeltaY.current = e.clientY - dragStartY.current;
    }
  };

  const handleMouseUp = () => {
    if (Math.abs(dragDeltaY.current) > 120 && zoomScale <= 1.05) {
      closeModal();
    }
    dragStartY.current = null;
    dragDeltaY.current = 0;
  };

  const currentItem = open ? items[open.itemIndex] : null;
  const currentSlide =
    open && currentItem ? currentItem.slides[open.slideIndex] : null;

  return (
    <SectionReveal>
      <section
        id="work"
        className="py-20 sm:py-24 md:py-28 bg-gray-50 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900"
          >
            Work in Action
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mt-4 text-base sm:text-lg md:text-xl text-gray-600"
          >
            Photos & short videos from recent projects across Maryland.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, cardIdx) => {
              const slide = item.slides[indexes[cardIdx]];
              const isVideo = slide.kind === "video";

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: cardIdx * 0.08 }}
                  className="group text-left rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md"
                >
                  <div className="relative w-full">
                    <div className="w-full" style={{ paddingTop: "56.25%" }} />

                    <div className="absolute inset-0 overflow-hidden">
                      {slide.kind === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <video
                          src={slide.src}
                          poster={slide.poster}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      )}
                    </div>

                    {/* Flechas card */}
                    <button
                      type="button"
                      aria-label="Previous media"
                      onClick={() => gotoCardSlide(cardIdx, -1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Next media"
                      onClick={() => gotoCardSlide(cardIdx, +1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                    >
                      ›
                    </button>

                    {/* Botón View / Play */}
                    <button
                      type="button"
                      onClick={() => openModal(cardIdx, indexes[cardIdx])}
                      className="absolute bottom-3 right-3 rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                    >
                      {isVideo ? "Play" : "View"}
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {item.slides.map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`h-2 w-2 rounded-full ${
                            dotIdx === indexes[cardIdx]
                              ? "bg-green-700"
                              : "bg-white/80"
                          } shadow`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    {item.location && (
                      <p className="text-sm text-gray-500">{item.location}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* MODAL */}
          {open && currentItem && currentSlide && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={closeModal}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="relative w-full max-w-5xl max-h-[90vh] bg-black/90 rounded-xl overflow-hidden flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {/* Contenido con zoom */}
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    touchAction: "none",
                  }}
                >
                  {currentSlide.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentSlide.src}
                      alt={currentSlide.alt}
                      className="max-h-[90vh] max-w-full object-contain select-none"
                      style={{
                        transform: `scale(${zoomScale})`,
                        transition: zoomScale === 1 ? "transform 0.2s" : "none",
                      }}
                      draggable={false}
                    />
                  ) : (
                    <video
                      src={currentSlide.src}
                      poster={currentSlide.poster}
                      className="max-h-[90vh] max-w-full"
                      autoPlay
                      controls
                      playsInline
                      muted
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      style={{
                        transform: `scale(${zoomScale})`,
                        transition: zoomScale === 1 ? "transform 0.2s" : "none",
                      }}
                    />
                  )}
                </div>

                {/* Flechas modal */}
                {currentItem.slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous media"
                      onClick={() => goModal(-1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Next media"
                      onClick={() => goModal(1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Cerrar */}
                <button
                  type="button"
                  className="absolute top-4 right-4 rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900 shadow hover:bg-white"
                  onClick={closeModal}
                  aria-label="Close viewer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </SectionReveal>
  );
}
