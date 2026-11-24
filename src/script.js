/* ================= GSAP ================= */
gsap.registerPlugin(ScrollTrigger);

/* ================= PRELOADER + SCROLL LOCK ================= */
document.documentElement.classList.add("is-loading");
window.preloaderComplete = false;

const preloader = document.querySelector("#preloader");

let halamanSiap = document.readyState === "complete";
let waktuMinimumSelesai = false;
let preloaderSelesai = false;

if (preloader) {
  const introPreloader = gsap.timeline({
    onComplete: () => {
      gsap.to(".preloader-logo", {
        rotation: "+=360",
        duration: 4,
        repeat: -1,
        ease: "none",
      });
    },
  });

  introPreloader
    .from(".preloader-title", {
      y: 120,
      opacity: 0,
      scale: 0.9,
      duration: 1.8,
      ease: "power4.out",
    })
    .from(
      ".preloader-logo",
      {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1.4,
        ease: "back.out(1.7)",
      },
      "-=0.7"
    );

  gsap.delayedCall(3, () => {
    waktuMinimumSelesai = true;
    cekPreloader();
  });

  window.addEventListener("load", () => {
    halamanSiap = true;
    cekPreloader();
  });

  function cekPreloader() {
    if (halamanSiap && waktuMinimumSelesai && !preloaderSelesai) {
      preloaderSelesai = true;
      keluarPreloader();
    }
  }

  function keluarPreloader() {
    gsap.killTweensOf(".preloader-logo");

    gsap.timeline({
      onStart: () => {
        window.preloaderComplete = true;
        window.dispatchEvent(new Event("preloaderComplete"));
      },
      onComplete: () => {
        gsap.set(preloader, {
          display: "none",
          visibility: "hidden",
          pointerEvents: "none",
        });

        document.documentElement.classList.remove("is-loading");

        requestAnimationFrame(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      },
    })
      .to(
        ".preloader-title",
        {
          scale: 1.08,
          opacity: 0,
          duration: 0.6,
          ease: "power3.in",
        },
        0
      )
      .to(
        ".preloader-logo",
        {
          rotation: "+=180",
          scale: 1.4,
          opacity: 0,
          duration: 0.7,
          ease: "power3.in",
        },
        0
      )
      .to(
        "#preloader",
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.2"
      );
  }
} else {
  window.preloaderComplete = true;
  document.documentElement.classList.remove("is-loading");
}

/* ================= FIT TEXT ================= */
function fit() {
  var portrait = innerWidth < innerHeight;

  document.querySelectorAll(".fit").forEach(function (e) {
    e.style.fontSize = "";
    var t = portrait ? e.dataset.wp : e.dataset.w;
    if (!t) return;

    e.style.fontSize = "100px";
    var w = e.getBoundingClientRect().width;
    e.style.fontSize = (100 * ((t / 100) * innerWidth)) / w + "px";
  });
}

fit();
addEventListener("resize", fit);
if (document.fonts) document.fonts.ready.then(fit);

const $ = (s) => document.querySelector(s);
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const panelsEl = $("#panels");

/* ================= SPLIT TEXT ================= */
function split(el) {
  if (!el) return [];

  const t = el.textContent.trim();
  el.setAttribute("aria-label", t);

  el.innerHTML = [...t]
    .map((c) => '<span class="ch" aria-hidden="true">' + c + "</span>")
    .join("");

  return el.querySelectorAll(".ch");
}

/* ================= PROGRESS BAR ================= */
const bar = document.createElement("div");
bar.className = "progress";
document.body.prepend(bar);

gsap.to(bar, {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    start: 0,
    end: "max",
    scrub: 0.3,
  },
});

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {

  /* ================= HERO ================= */
  const fullCh = split($("#full"));
  const stackCh = split($("#stack"));

  function jalankanAnimasiHome() {
    gsap.timeline({ defaults: { ease: "power4.out" } })
      .from(fullCh, {
        yPercent: 120,
        rotate: 12,
        opacity: 0,
        duration: 1.1,
        stagger: 0.07,
      })
      .from(stackCh, {
        yPercent: -120,
        rotate: -12,
        opacity: 0,
        duration: 1.1,
        stagger: 0.07,
      }, "<0.15")
      .from("#web, #front", {
        opacity: 0,
        xPercent: -20,
        duration: 0.8,
        stagger: 0.15,
      }, "-=0.6")
      .from("#star", {
        scale: 0,
        rotation: -270,
        duration: 1.2,
        ease: "back.out(1.7)",
      }, "-=0.9");
  }

  if (window.preloaderComplete === true) {
    jalankanAnimasiHome();
  } else {
    window.addEventListener("preloaderComplete", jalankanAnimasiHome, { once: true });
  }

  /* ================= HERO PARALLAX ================= */
  gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  })
    .to("#full", { xPercent: -18 }, 0)
    .to("#stack", { xPercent: 18 }, 0)
    .to("#web, #front", { opacity: 0 }, 0)
    .to("#star", { yPercent: 80 }, 0);

  /* ================= HERO MOUSE ================= */
  if (fine && $("#home")) {
    const layers = [
      ["#full", -14],
      ["#stack", 18],
      ["#web", -30],
      ["#front", 24],
      ["#star", 40],
    ].map(([sel, d]) => ({
      d,
      x: gsap.quickTo(sel, "x", { duration: 0.8, ease: "power3" }),
      y: gsap.quickTo(sel, "y", { duration: 0.8, ease: "power3" }),
    }));

    $("#home").addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;

      layers.forEach((l) => {
        l.x(nx * l.d);
        l.y(ny * l.d);
      });
    });
  }

  /* KLIK BINTANG HOME */
  if ($("#star")) {
    $("#star").addEventListener("click", () => {
      gsap.to("#star", {
        rotation: "+=720",
        duration: 1.4,
        ease: "power4.out",
      });
    });
  }

  /* ================= ABOUT ================= */
  gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top 60%",
      once: true,
    },
  })
    .fromTo("#h",
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1,
        ease: "power3.inOut",
        clearProps: "clipPath",
      }
    )
    .from("#p", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.5")
    .from("#hr", { scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power3.inOut" }, "-=0.5")
    .from("#ts", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
    .from("#d1, #s1, #d2, #s2", { y: 24, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" }, "-=0.3")
    .from("#photo", { yPercent: 100, duration: 1.2, ease: "power4.out" }, 0.2)
    .from("#astar", { scale: 0, duration: 0.9, ease: "back.out(2)" }, "-=0.8");

  /* ABOUT STAR */
  gsap.to("#astar", {
    rotation: 180,
    ease: "none",
    scrollTrigger: {
      trigger: "#about",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  /* ================= HEADER PENCAPAIAN & LOGO SPIN ================= */
  if ($(".header-pencapaian")) {
    gsap.from(".judul-section-pencapaian", {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#pencapaian",
        start: "top 80%",
        once: true,
      },
    });

    gsap.from("#pstar", {
      scale: 0,
      rotation: -180,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: "#pencapaian",
        start: "top 80%",
        once: true,
      },
    });
  }

  if ($("#pstar")) {
    $("#pstar").addEventListener("click", () => {
      gsap.to("#pstar", {
        rotation: "+=720",
        duration: 1.4,
        ease: "power4.out",
      });
    });
  }

  /* ================= PENCAPAIAN MENIMPA ABOUT & HORIZONTAL SCROLL ================= */
  const sectionAbout = document.querySelector("#about");
  const sectionPencapaian = document.querySelector("#pencapaian");
  const trekSertifikat = document.querySelector("#trek-sertifikat");
  const viewportSertifikat = document.querySelector(".viewport-sertifikat");

  // 1. Tahan #about agar #pencapaian meluncur naik menimpanya
  if (sectionAbout && sectionPencapaian) {
    ScrollTrigger.create({
      trigger: sectionAbout,
      start: () => (sectionAbout.offsetHeight <= window.innerHeight ? "top top" : "bottom bottom"),
      endTrigger: sectionPencapaian,
      end: "top top",
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });
  }

  // 2. Pin #pencapaian & geser horizontal sertifikat di desktop
  if (sectionPencapaian && trekSertifikat && viewportSertifikat) {
    mm.add("(min-width: 861px)", () => {
      const hitungJarakGeser = () => {
        return Math.max(0, trekSertifikat.scrollWidth - viewportSertifikat.clientWidth);
      };

      gsap.to(trekSertifikat, {
        x: () => -hitungJarakGeser(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionPencapaian,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${hitungJarakGeser() + 300}`,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  /* ================= MINI DINO RUNNER ================= */
  const arenaDino = document.querySelector("#arena-dino");
  const karakterDino = document.querySelector("#karakter-dino");
  const kaktus = document.querySelector("#rintangan-kaktus");

  if (arenaDino && karakterDino && kaktus) {
    let sedangLompat = false;

    function lompatDino() {
      if (sedangLompat) return;
      sedangLompat = true;
      karakterDino.classList.add("sedang-lompat");

      gsap.timeline({
        onComplete: () => {
          sedangLompat = false;
          karakterDino.classList.remove("sedang-lompat");
        },
      })
        .to(karakterDino, {
          y: -58,
          rotation: -8,
          duration: 0.28,
          ease: "power2.out",
        })
        .to(karakterDino, {
          y: 0,
          rotation: 0,
          duration: 0.28,
          ease: "power2.in",
        });
    }

    gsap.to(kaktus, {
      x: () => -(arenaDino.offsetWidth + 60),
      duration: 2.2,
      repeat: -1,
      ease: "none",
      onUpdate: function () {
        const rectDino = karakterDino.getBoundingClientRect();
        const rectKaktus = kaktus.getBoundingClientRect();
        const jarak = rectKaktus.left - rectDino.right;

        if (jarak > 0 && jarak < 45 && !sedangLompat) {
          lompatDino();
        }
      },
    });

    arenaDino.addEventListener("click", lompatDino);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        const rect = arenaDino.getBoundingClientRect();
        const terlihat = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (terlihat) {
          e.preventDefault();
          lompatDino();
        }
      }
    });
  }

  /* ================= ACHIEVEMENTS EXTRA EFFECTS ================= */
  if (panelsEl) {
    const skewSet = gsap.quickSetter(".panel", "skewX", "deg");
    const proxy = { skew: 0 };

    ScrollTrigger.create({
      trigger: ".horizontal-section",
      start: "top top",
      end: () => "+=" + (panelsEl.scrollWidth - innerWidth),
      onUpdate(self) {
        const s = gsap.utils.clamp(-8, 8, self.getVelocity() / -300);

        if (Math.abs(s) > Math.abs(proxy.skew)) {
          proxy.skew = s;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSet(proxy.skew),
          });
        }
      },
    });
  }

  /* PANEL 3D & CUSTOM CURSOR */
  if (fine) {
    gsap.set(".panel", { transformPerspective: 900 });

    document.querySelectorAll(".panel").forEach((p) => {
      const rx = gsap.quickTo(p, "rotationX", { duration: 0.5, ease: "power3" });
      const ry = gsap.quickTo(p, "rotationY", { duration: 0.5, ease: "power3" });

      p.addEventListener("pointermove", (e) => {
        const r = p.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
      });

      p.addEventListener("pointerleave", () => {
        rx(0);
        ry(0);
      });
    });

    const c = document.createElement("div");
    c.className = "cursor";
    document.body.append(c);

    gsap.set(c, { xPercent: -50, yPercent: -50 });

    const cx = gsap.quickTo(c, "x", { duration: 0.25, ease: "power3" });
    const cy = gsap.quickTo(c, "y", { duration: 0.25, ease: "power3" });

    let shown = false;

    addEventListener("pointermove", (e) => {
      if (!shown) {
        shown = true;
        c.style.opacity = 1;
      }
      cx(e.clientX);
      cy(e.clientY);
    });

    document.addEventListener("pointerover", (e) => {
      gsap.to(c, {
        scale: e.target.closest(".panel, .tech, #star, #pstar, .kartu-polaroid, .arena-dino") ? 3 : 1,
        duration: 0.3,
      });
    });
  }
});

/* ================= REFRESH & SORT ================= */
function refreshScrollTriggers() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

addEventListener("load", refreshScrollTriggers);
if (document.fonts) {
  document.fonts.ready.then(refreshScrollTriggers);
}

