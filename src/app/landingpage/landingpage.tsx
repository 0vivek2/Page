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
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [usePhone, setUsePhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      try {
        const categories = ["mountain", "beach", "temple", "island"];
        let allImages: PexelsPhoto[] = [];
        for (const category of categories) {
          const res = await fetch(`/api/pexels-wallpapers?category=${category}`);
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            allImages = allImages.concat(data.photos.slice(0, 1));
          }
        }
        setImages(allImages.slice(0, 4));
      } catch (err) {
        console.error("Error fetching hero images:", err);
      }
    }
    fetchImages();
  }, []);

  // Auto-slide
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

  // Infinite loop
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

  // === Auth Handlers ===
  const handleSendOtp = () => {
    setOtpSent(true);
    alert("OTP sent! (Demo only)");
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      alert("OTP Verified ✅ (Demo)");
    } else {
      alert("Invalid OTP ❌ (try 1234)");
    }
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

        {/* ===== AUTH CARD ===== */}
        <div className={styles.authCard}>
          {authMode === "signin" && (
            <>
              <h2>Sign In</h2>

              {!usePhone ? (
                <input type="email" placeholder="Email" className={styles.inputBox} />
              ) : (
                <div className={styles.phoneInputWrapper}>
                  <select className={styles.countryCodeSelect}>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input type="tel" placeholder="Phone number" className={styles.inputBox} />
                </div>
              )}

              <input type="password" placeholder="Password" className={styles.inputBox} />

              {/* OTP flow */}
              {usePhone && (
                <>
                  {!otpSent ? (
                    <button className={styles.primaryBtn} onClick={handleSendOtp}>
                      Send OTP
                    </button>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className={styles.inputBox}
                      />
                      <button className={styles.primaryBtn} onClick={handleVerifyOtp}>
                        Verify OTP
                      </button>
                    </>
                  )}
                </>
              )}

              {!usePhone && (
                <button className={styles.primaryBtn}>Sign In</button>
              )}

              <p className={styles.linkText}>
                <span onClick={() => setUsePhone(!usePhone)}>
                  {usePhone ? "Use Email Instead" : "Use Phone Number Instead"}
                </span>
              </p>

              <p className={styles.linkText} onClick={() => setAuthMode("forgot")}>
                Forgot Password?
              </p>

              <p className={styles.switchText}>
                Don't have an account?
                <span onClick={() => setAuthMode("signup")}> Sign Up</span>
              </p>
            </>
          )}

          {authMode === "signup" && (
            <>
              <h2>Create Account</h2>
              <input type="text" placeholder="Full Name" className={styles.inputBox} />
              <input type="email" placeholder="Email" className={styles.inputBox} />
              <input type="password" placeholder="Password" className={styles.inputBox} />
              <button className={styles.primaryBtn}>Sign Up</button>
              <p className={styles.switchText}>
                Already have an account?
                <span onClick={() => setAuthMode("signin")}> Sign In</span>
              </p>
            </>
          )}

          {authMode === "forgot" && (
            <>
              <h2>Reset Password</h2>
              <input
                type="text"
                placeholder="Enter email or phone"
                className={styles.inputBox}
              />
              <button
                className={styles.primaryBtn}
                onClick={() => alert("Reset link/OTP sent (Demo)")}
              >
                Send Reset Link
              </button>
              <p className={styles.switchText}>
                Back to
                <span onClick={() => setAuthMode("signin")}> Sign In</span>
              </p>
            </>
          )}
        </div>

        {/* Pagination */}
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
