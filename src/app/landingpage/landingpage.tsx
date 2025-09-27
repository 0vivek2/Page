"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./landingpage.module.css";

interface PexelsPhoto {
  id: string | number;
  src: { landscape: string };
}

export default function LandingPage() {
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Fetch hero images (limit 4 only)
  useEffect(() => {
    async function fetchImages() {
      try {
        const categories = ["mountain", "beach", "temple", "island"];
        let allImages: PexelsPhoto[] = [];

        for (const category of categories) {
          const res = await fetch(`/api/pexels-wallpapers?category=${category}`);
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            allImages = allImages.concat(data.photos.slice(0, 1)); // take 1 per category
          }
        }

        setImages(allImages.slice(0, 4)); // ensure max 4
      } catch (err) {
        console.error("Error fetching hero images:", err);
      }
    }
    fetchImages();
  }, []);

  // Hero carousel auto-slide
  useEffect(() => {
    if (images.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images]);

  // Infinite loop adjustment
  useEffect(() => {
    if (!trackRef.current) return;
    const totalSlides = images.length;
    if (currentIndex === totalSlides) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 1000);
    }
  }, [currentIndex, images.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  // If no images from API, use fallback
  const heroSlides =
    images.length > 0
      ? [...images, images[0]]
      : [
          { id: "1", src: { landscape: "" } },
          { id: "2", src: { landscape: "" } },
          { id: "3", src: { landscape: "" } },
          { id: "4", src: { landscape: "" } },
        ];

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsTransitioning(true);
  };

  return (
    <div className={styles.landingpageContainer}>
      <section className={styles.hero}>
        <div
          ref={trackRef}
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? "transform 1s ease-in-out" : "none",
          }}
        >
          {heroSlides.map((img, index) => (
            <div
              key={`${img.id}-${index}`}
              className={styles.carouselSlide}
              style={{ backgroundImage: `url(${img.src.landscape})` }}
            />
          ))}
        </div>

        <div className={styles.carouselOverlay} />

        <div className={styles.heroTagline}>
          <h1>Welcome to Travio</h1>
          <p>Discover amazing places and plan your next trip</p>
          <button className={styles.exploreBtn}>Explore With Travio</button>
        </div>

        {/* Pagination Dots */}
        <div className={styles.paginationDots}>
          {images.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
