document.addEventListener("DOMContentLoaded", () => {

  // ── NAVBAR SCROLL ─────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    });
  }

  // ── HAMBURGER ─────────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // ── SCROLL REVEAL (OBSERVER) ──────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => {
    revealObserver.observe(el);
  });

  // ── STAT COUNTER ─────────────────────────────────────────
  const statValues = document.querySelectorAll(".stat-value");
  if (statValues.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target) || 0;
            const suffix = el.dataset.suffix || "";
            let current = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              el.textContent = current + suffix;
            }, 30);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statValues.forEach((el) => counterObserver.observe(el));
  }

  // ── TYPEWRITER ────────────────────────────────────────────
  const typewriterEl = document.getElementById("typewriterText");
  if (typewriterEl) {
    const words = [
      "Videographer  ·  Sound Engineer  ·  Audio-Visual Tech",
      "Founder of Hoskey Production  ·  Storyteller  ·  Visionary",
      "Capturing Moments, Sharing Impact",
      "Cinematic storytelling from Ghana to the world",
      "Live Broadcast  ·  Commentary  ·  Event Coverage",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (!isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(typeEffect, 2500);
          return;
        }
        setTimeout(typeEffect, 60 + Math.random() * 40);
      } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(typeEffect, 400);
          return;
        }
        setTimeout(typeEffect, 30 + Math.random() * 20);
      }
    }
    setTimeout(typeEffect, 800);
  }

  // ── PARALLAX SCROLL ───────────────────────────────────────
  function updateParallax() {
    const parallaxEls = document.querySelectorAll(".parallax-bg");
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.speed || "0.3");
      const offset = rect.top * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
    const heroBg = document.querySelector(".hero-bg-img");
    if (heroBg) {
      const speed = 0.15;
      const yOffset = window.scrollY * speed;
      heroBg.style.transform = `translate3d(0, ${yOffset}px, 0) scale(1.05)`;
    }
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ── EXPAND / COLLAPSE ─────────────────────────────────────
  document.querySelectorAll(".expand-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const content = document.getElementById(targetId);
      if (!content) return;
      const isOpen = content.classList.contains("open");
      content.classList.toggle("open");
      btn.classList.toggle("active");
      const label = btn.querySelector(".expand-label");
      if (label) {
        label.textContent = isOpen
          ? (btn.dataset.closeText || "Read More")
          : (btn.dataset.openText || "Show Less");
      }
    });
  });

  // ── GALLERY LIGHTBOX ──────────────────────────────────────
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");
  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((item, i) => {
    const img = item.querySelector("img");
    if (img) {
      images.push({ src: img.src, alt: img.alt });
      item.addEventListener("click", () => openLightbox(i));
    }
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function updateLightbox() {
    const img = images[currentIndex];
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", prevImage);
  if (lightboxNext) lightboxNext.addEventListener("click", nextImage);

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ── CURSOR GLOW ───────────────────────────────────────────
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow) {
    let mouseX = -300, mouseY = -300;
    let currentX = -300, currentY = -300;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      cursorGlow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ── CONTACT FORM ──────────────────────────────────────────
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      btn.disabled = true;
      btn.textContent = "SENDING\u2026";
      const data = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        message: contactForm.message.value.trim(),
      };
      try {
        const res = await fetch("https://formsubmit.co/ajax/hoskeyproduction@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          contactFeedback.textContent = "\u2713 Message sent! I will get back to you soon.";
          contactFeedback.style.color = "#22c55e";
          contactFeedback.style.display = "block";
          contactForm.reset();
        } else {
          throw new Error("Failed");
        }
      } catch {
        contactFeedback.textContent = "Something went wrong. Try again or email me directly.";
        contactFeedback.style.color = "#ef4444";
        contactFeedback.style.display = "block";
      }
      btn.disabled = false;
      btn.textContent = "Send Message \u2192";
      setTimeout(() => { contactFeedback.style.display = "none"; }, 5000);
    });
  }


});
