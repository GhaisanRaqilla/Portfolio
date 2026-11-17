/* ukuran teks dihitung otomatis supaya lebarnya sama dengan desain
   (data-w = lebar teks dalam vw di desktop, data-wp = di HP) */
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

/* ===== ACHIEVEMENT: scroll horizontal + gerak kartu + lightbox ===== */
(function () {
  var sec = document.getElementById("achievement");
  if (!sec) return;
  var track = sec.querySelector(".ach__track");
  var probe = sec.querySelector(".ach__probe");
  var cards = [].slice.call(sec.querySelectorAll(".cert"));
  var countEl = sec.querySelector("[data-ach-count]");
  var railEl = sec.querySelector("[data-ach-rail]");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var target = 0, current = 0, raf = 0, lastIdx = -1;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* teks mengikuti lebar desain (data-u = lebar teks dalam satuan desain) */
  function fitU() {
    var u = probe.offsetWidth / 100;
    sec.querySelectorAll(".fit-u").forEach(function (e) {
      e.style.fontSize = "100px";
      var w = e.getBoundingClientRect().width;
      e.style.fontSize = (100 * (e.dataset.u * u)) / w + "px";
    });
  }
  function dist() { return Math.max(0, track.scrollWidth - innerWidth); }
  function progress() {
    var range = sec.offsetHeight - innerHeight;
    var p = range > 0 ? -sec.getBoundingClientRect().top / range : 0;
    return Math.min(1, Math.max(0, p));
  }

  function render() {
    track.style.transform = "translate3d(" + -current * dist() + "px,0,0)";
    var vw = innerWidth;
    var best = 0, bestD = Infinity;
    cards.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      var d = (r.left + r.width / 2 - vw / 2) / vw; /* 0 = di tengah layar */
      var a = Math.min(1, Math.abs(d));
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
      if (reduce) return;
      /* makin jauh dari tengah: sedikit turun, miring, dan mengecil */
      c.style.transform = "translateY(" + a * a * 3 + "vh) rotate(" + d * -3 + "deg) scale(" + (1 - a * 0.07) + ")";
    });
    var n = cards.length;
    var idx = best; /* kartu yang paling dekat ke tengah layar */
    if (idx !== lastIdx) { lastIdx = idx; countEl.textContent = pad(idx + 1) + " / " + pad(n); }
    railEl.style.transform = "scaleX(" + current + ")";
  }

  /* gerak dibuat halus: posisi mengejar target scroll */
  function loop() {
    current += (target - current) * (reduce ? 1 : 0.1);
    if (Math.abs(target - current) < 0.0004) current = target;
    render();
    raf = current !== target ? requestAnimationFrame(loop) : 0;
  }
  /* tahan halaman: selama section ini di layar, panggung dikunci (fixed), lalu dilepas di akhir */
  var pin = sec.querySelector(".ach__pin");
  function pinState() {
    var r = sec.getBoundingClientRect();
    pin.classList.toggle("is-fixed", r.top <= 0 && r.bottom > innerHeight);
    pin.classList.toggle("is-end", r.bottom <= innerHeight);
  }
  function onScroll() {
    pinState();
    target = progress();
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function layout() {
    fitU();
    sec.style.height = innerHeight + dist() + "px"; /* scroll tertahan sampai kartu terakhir */
    pinState();
    target = current = progress();
    render();
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", layout);
  addEventListener("load", layout);
  if (document.fonts) document.fonts.ready.then(layout);
  layout();

  /* ---------- lightbox ---------- */
  var lb = sec.querySelector(".ach-lb");
  var lbImg = lb.querySelector("[data-lb-img]");
  var lbTitle = lb.querySelector("[data-lb-title]");
  var lbCount = lb.querySelector("[data-lb-count]");
  var cur = 0;

  function show(i) {
    var n = cards.length;
    cur = (i + n) % n;
    var c = cards[cur];
    lbImg.src = c.dataset.full;
    lbImg.alt = "Sertifikat " + c.dataset.title;
    lbTitle.textContent = c.dataset.title;
    lbCount.textContent = pad(cur + 1) + " / " + pad(n);
  }
  function open(i) {
    show(i);
    if (!lb.open) lb.showModal();
    document.documentElement.classList.add("lb-open");
  }
  cards.forEach(function (c, i) {
    var img = c.querySelector(".cert__img");
    img.addEventListener("click", function () { open(i); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });
  lb.querySelector("[data-lb-close]").addEventListener("click", function () { lb.close(); });
  lb.querySelector("[data-lb-prev]").addEventListener("click", function () { show(cur - 1); });
  lb.querySelector("[data-lb-next]").addEventListener("click", function () { show(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener("close", function () { document.documentElement.classList.remove("lb-open"); });
  addEventListener("keydown", function (e) {
    if (!lb.open) return;
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
})();

// Make sure ScrollTrigger is loaded
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.14.2/ScrollTrigger.min.js"></script>

gsap.registerPlugin(ScrollTrigger);

const panels = document.querySelector("#panels");
if (panels) {
  const totalScroll = panels.scrollWidth - window.innerWidth;

  gsap.to(panels, {
    x: () => -(panels.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-section",
      start: "top top",
      end: () => `+=${panels.scrollWidth - window.innerWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  window.addEventListener("resize", () => ScrollTrigger.refresh());
}