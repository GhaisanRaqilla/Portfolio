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