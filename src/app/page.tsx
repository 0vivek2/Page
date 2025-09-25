"use client";

import { useEffect, useState, useRef } from "react";

interface PexelsPhoto {
  id: number;
  src: { landscape: string };
}

export default function LandingPage() {
  const categories = ["Mountain", "Forest", "City"];
  const [allImages, setAllImages] = useState<Record<string, PexelsPhoto[]>>({
    Mountain: [],
    Forest: [],
    City: [],
  });
  const [currentCategory, setCurrentCategory] = useState("Mountain");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // Fetch images
  useEffect(() => {
    categories.forEach(async (category) => {
      try {
        const res = await fetch(`/api/pexels-wallpapers?category=${category}`);
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
          setAllImages((prev) => ({ ...prev, [category]: data.photos }));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  const images = allImages[currentCategory] || [];

  // Auto slide every 3 seconds
  useEffect(() => {
    if (images.length === 0) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= images.length) {
          // Reached last slide, jump to first without transition
          setIsTransitioning(false);
          return 0;
        }
        setIsTransitioning(true);
        return prev + 1;
      });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images]);

  // Reset transition after instant jump
  useEffect(() => {
    if (!isTransitioning) {
      // re-enable transition in next tick
      const timeout = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  return (
    <main className="hero">
      {/* Carousel */}
      <div
        className="carousel-track"
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
          transition: isTransitioning ? "transform 1s ease-in-out" : "none",
        }}
      >
        {images.length > 0
          ? images.map((img) => (
              <div
                key={img.id}
                className="carousel-slide"
                style={{
                  backgroundImage: `url(${img?.src?.landscape ?? "/travel1.jpg"})`,
                }}
              />
            ))
          : [
              <div
                key="fallback"
                className="carousel-slide"
                style={{ backgroundImage: "url(/travel1.jpg)" }}
              />,
            ]}
      </div>

      <div className="carousel-overlay" />
      <button className="btn-explore">Explore With Travio</button>

      <div className="hero-tagline">
        <h1>Welcome to Travio Website</h1>
        <p>
          Discover amazing places and plan your next trip with Travio Community
        </p>
      </div>

      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${cat === currentCategory ? "active" : ""}`}
            onClick={() => {
              setCurrentCategory(cat);
              setCurrentIndex(0);
              setIsTransitioning(false);
              setTimeout(() => setIsTransitioning(true), 50);
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </main>
  );
}
