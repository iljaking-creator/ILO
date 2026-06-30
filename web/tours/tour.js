/* Live-Room-Tour — horizontal pinned scroll walkthrough.
   Degrades to vertically stacked rooms if GSAP is missing or reduced motion. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var prog = document.querySelector(".t-prog");

  function setProg(p) { if (prog) prog.style.width = (p * 100).toFixed(2) + "%"; }

  if (!gsap || !ST || reduced) {
    document.body.classList.add("stacked");
    window.addEventListener("scroll", function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      setProg(max > 0 ? window.scrollY / max : 0);
    });
    return;
  }

  gsap.registerPlugin(ST);

  // Optional smooth scroll
  if (typeof window.Lenis !== "undefined") {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on("scroll", ST.update);
  }

  var track = document.querySelector(".track");
  var wrap = document.querySelector(".track-wrap");
  var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };

  var tween = gsap.to(track, {
    x: function () { return -distance(); },
    ease: "none",
    scrollTrigger: {
      trigger: wrap,
      start: "top top",
      end: function () { return "+=" + distance(); },
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) { setProg(self.progress); },
    },
  });

  // Reveal each room card as it scrolls into view (horizontal containerAnimation)
  document.querySelectorAll(".room__card").forEach(function (card) {
    gsap.from(card, {
      opacity: 0, y: 40, duration: 0.6, ease: "power3.out",
      scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 75%" },
    });
  });

  // Pointer parallax for depth layers within the visible room
  var layers = document.querySelectorAll("[data-depth]");
  window.addEventListener("pointermove", function (e) {
    var dx = e.clientX / window.innerWidth - 0.5;
    var dy = e.clientY / window.innerHeight - 0.5;
    layers.forEach(function (l) {
      var d = parseFloat(l.getAttribute("data-depth")) || 0;
      l.style.transform = "translate(" + dx * d * 40 + "px," + dy * d * 24 + "px)";
    });
  });
})();
