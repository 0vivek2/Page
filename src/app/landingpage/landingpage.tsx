"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./landingpage.module.css";

const heroImages = [
  "/travel1.jpg",
  "/travel2.jpg",
  "/travel3.jpg",
  "/travel4.jpg",
]; // local images in /public

const taglines = [
  { title: "Explore the Mountains", subtitle: "Find peace in nature's heights" },
  { title: "Relax by the Beaches", subtitle: "Sun, sand, and serenity await" },
  { title: "Discover New Cities", subtitle: "Uncover hidden urban gems" },
  { title: "Adventure Awaits", subtitle: "Make memories that last forever" },
];

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [fade, setFade] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // Auto-slide
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(true);
        setFade(true); // fade in
      }, 500);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reset to start when reaching the clone
  useEffect(() => {
    if (currentIndex === heroImages.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleDotClick = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(true);
      setFade(true);
    }, 300);
  };

  // Clone first image at the end
  const slides = [...heroImages, heroImages[0]];
  const displayIndex = currentIndex % heroImages.length;

  return (
    <div className={styles.landingpageContainer}>
      <section className={styles.hero}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? "transform 1s ease-in-out" : "none",
          }}
        >
          {slides.map((img, index) => (
            <div
              key={index}
              className={styles.carouselSlide}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className={styles.carouselOverlay} />

        {/* Cool Animated Tagline */}
        <div className={`${styles.heroTagline} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          <h1>{taglines[displayIndex].title}</h1>
          <p>{taglines[displayIndex].subtitle}</p>
          <button className={styles.exploreBtn}>Explore With Travio</button>
        </div>

        {/* Pagination Dots */}
        <div className={styles.paginationDots}>
          {heroImages.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${
                displayIndex === index ? styles.activeDot : ""
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
