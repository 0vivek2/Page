"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./landingpage.module.css";

interface PexelsPhoto {
  id: number;
  src: { landscape: string };
}

export default function LandingPage() {
  const categories = ["Mountain", "Forest", "City", "Beach", "Temple"];
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Ref for interval (TypeScript-safe with initial value)
  const intervalRef = useRef<number | undefined>(undefined);

  // Shuffle helper
  const shuffleArray = <T,>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

  // Fetch all images once
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const allImages: PexelsPhoto[] = [];
        await Promise.all(
          categories.map(async (category) => {
            const res = await fetch(`/api/pexels-wallpapers?category=${category}`);
            const data = await res.json();
            if (data.photos?.length) allImages.push(...data.photos);
          })
        );
        setImages(shuffleArray(allImages));
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    fetchImages();
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    if (!images.length) return;

    // Clear previous interval
    if (intervalRef.current !== undefined) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        setIsTransitioning(prev + 1 < images.length);
        return next;
      });
    }, 3000);

    return () => {
      if (intervalRef.current !== undefined) clearInterval(intervalRef.current);
    };
  }, [images]);

  // Reset transition after instant jump
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  // Fallback image
  const carouselImages =
    images.length > 0 ? images : [{ id: 0, src: { landscape: "" } }];

  return (
    <main className={styles.hero}>
      {/* Carousel */}
      <div
        className={styles.carouselTrack}
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
          transition: isTransitioning ? "transform 1s ease-in-out" : "none",
        }}
      >
        {carouselImages.map((img) => (
          <div
            key={img.id}
            className={styles.carouselSlide}
            style={{ backgroundImage: `url(${img.src.landscape})` }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className={styles.carouselOverlay} />

      {/* Hero content */}
      <div className={styles.heroContent}>
        <h1>Welcome to Travio</h1>
        <p>Discover amazing places and plan your next trip with Travio Community</p>
        <button className={styles.btnExplore}>Explore With Travio</button>
      </div>
    </main>
  );
}
