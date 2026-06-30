/* K&I Kundenwerke — site interactions. Degrades gracefully if any vendored
   library is missing or the user prefers reduced motion. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var ST = window.ScrollTrigger;
  if (hasGsap && ST) gsap.registerPlugin(ST);

  /* --- Smooth scroll (Lenis) ------------------------------------------- */
  if (!reduced && typeof window.Lenis !== "undefined") {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (ST) lenis.on("scroll", ST.update);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var el = document.querySelector(a.getAttribute("href"));
        if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -60 }); }
      });
    });
  }

  /* --- Reveals + kinetic headlines (GSAP) ------------------------------ */
  if (hasGsap && ST && !reduced) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
    var canSplit = typeof window.SplitText !== "undefined";
    document.querySelectorAll("[data-split]").forEach(function (el) {
      if (canSplit) {
        var split = new SplitText(el, { type: "chars,words" });
        gsap.from(split.chars, {
          yPercent: 120, opacity: 0, stagger: 0.012, duration: 0.7, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      } else {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 90%" } });
      }
    });
  } else {
    // No animation libs / reduced motion → ensure everything is visible.
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }

  /* --- Magnetic buttons ------------------------------------------------ */
  if (!reduced && hasGsap) {
    document.querySelectorAll("[data-magnet]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4 });
      });
      btn.addEventListener("pointerleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
      });
    });
  }

  /* --- Open the live chat widget (dogfooding) -------------------------- */
  document.querySelectorAll("[data-open-chat]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var launch = document.querySelector(".kiw-launch");
      if (launch) launch.click();
    });
  });

  /* --- KI-Studio: gallery + live generation ---------------------------- */
  var galleryEl = document.getElementById("gallery");
  var modeBadge = document.getElementById("studioMode");
  var form = document.getElementById("genForm");
  var promptEl = document.getElementById("genPrompt");
  var genBtn = document.getElementById("genBtn");
  var hint = document.getElementById("genHint");
  var liveEnabled = false;

  function tile(clip) {
    var t = document.createElement("div");
    t.className = "tile";
    if (clip.videoUrl) {
      var v = document.createElement("video");
      v.src = clip.videoUrl; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      if (clip.imageUrl) v.poster = clip.imageUrl;
      t.appendChild(v);
    } else if (clip.imageUrl) {
      var img = document.createElement("img"); img.src = clip.imageUrl; img.alt = clip.title || ""; t.appendChild(img);
    } else {
      var ph = document.createElement("div"); ph.className = "tile__ph";
      ph.textContent = clip.title || "Vorschau";
      t.appendChild(ph);
      return t; // placeholder already shows the title centered
    }
    if (clip.title) {
      var cap = document.createElement("div"); cap.className = "tile__t"; cap.textContent = clip.title;
      t.appendChild(cap);
    }
    return t;
  }

  function loadGallery() {
    if (!galleryEl) return;
    fetch("/api/media/gallery").then(function (r) { return r.json(); }).then(function (data) {
      liveEnabled = !!data.live;
      if (modeBadge) modeBadge.textContent = liveEnabled ? "Live-Generierung aktiv" : "Showcase-Modus";
      (data.clips || []).forEach(function (c) { galleryEl.appendChild(tile(c)); });
      if (!liveEnabled && genBtn) {
        genBtn.disabled = true;
        if (hint) hint.textContent = "Live-Generierung inaktiv — HF_CREDENTIALS hinterlegen, um echt zu erzeugen.";
      }
    }).catch(function () {
      if (modeBadge) modeBadge.textContent = "offline";
    });
  }

  function pollImage(requestId, t) {
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      fetch("/api/media/status/" + encodeURIComponent(requestId)).then(function (r) { return r.json(); }).then(function (s) {
        if (s.status === "completed" && s.imageUrls && s.imageUrls[0]) {
          clearInterval(iv);
          t.innerHTML = ""; var img = document.createElement("img"); img.src = s.imageUrls[0]; t.appendChild(img);
          if (hint) hint.textContent = "Fertig.";
        } else if (s.status === "failed" || s.status === "nsfw" || tries > 40) {
          clearInterval(iv); t.querySelector(".tile__ph") && (t.querySelector(".tile__ph").textContent = "fehlgeschlagen");
          if (hint) hint.textContent = "Generierung fehlgeschlagen.";
        }
      }).catch(function () { clearInterval(iv); });
    }, 3000);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var prompt = (promptEl.value || "").trim();
      if (!prompt) return;
      if (!liveEnabled) {
        if (hint) hint.textContent = "Live-Generierung inaktiv (HF_CREDENTIALS fehlt).";
        return;
      }
      if (hint) hint.textContent = "Generiere…";
      var t = tile({ title: "generiert…" });
      galleryEl.insertBefore(t, galleryEl.firstChild);
      fetch("/api/media/generate", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "image", prompt: prompt, aspect_ratio: "16:9" }),
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || !res.j.requestId) {
            if (hint) hint.textContent = res.j.detail || "Nicht verfügbar.";
            t.remove(); return;
          }
          pollImage(res.j.requestId, t);
        }).catch(function () { if (hint) hint.textContent = "Fehler."; t.remove(); });
    });
  }

  loadGallery();
})();
