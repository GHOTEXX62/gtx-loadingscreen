(function () {
  "use strict";
  var config = (window.GTXLoadingConfig || {}).music || {};
  if (!config.enabled) return;
  var tracks = (Array.isArray(config.playlist) ? config.playlist : []).map(function (track) {
    return typeof track === "string" ? { src: track } : track;
  }).filter(function (track) { return track && typeof track.src === "string" && track.src.trim(); });
  if (!tracks.length && typeof config.src === "string" && config.src.trim()) tracks = [{ src: config.src, title: config.title }];
  if (!tracks.length) return;
  var audio = document.getElementById("music");
  var caption = document.getElementById("music-caption");
  var title = document.getElementById("music-title");
  var gameVolume = 1, started = true, finished = false, blocked = false;
  var index = 0, revision = 0, failures = 0;
  function clamp(value, fallback) {
    if (value === null || value === undefined || value === "") return fallback;
    var number = Number(value);
    return isFinite(number) ? Math.max(0, Math.min(1, number)) : fallback;
  }
  var volume = clamp(config.volume, 0.25);
  function updateVolume() { audio.volume = volume * gameVolume; }
  function play() {
    if (!started || finished || gameVolume === 0) return;
    updateVolume();
    var attempt = revision;
    function rejected(error) {
      if (attempt !== revision) return;
      blocked = !!error && error.name === "NotAllowedError";
    }
    try {
      var result = audio.play();
      if (result && result.catch) result.catch(rejected);
    } catch (error) { rejected(error); }
  }
  function select(next) {
    revision++;
    audio.pause(); audio.removeAttribute("src"); audio.load();
    index = next;
    title.textContent = tracks[index].title || config.title || "Musique";
    caption.hidden = false;
    audio.src = tracks[index].src;
    updateVolume(); play();
  }
  function advance() {
    if (index + 1 >= tracks.length && config.loop === false) { finished = true; caption.hidden = true; return; }
    select((index + 1) % tracks.length);
  }
  audio.loop = false;
  audio.addEventListener("playing", function () { blocked = false; failures = 0; });
  audio.addEventListener("ended", advance);
  audio.addEventListener("error", function () {
    if (!audio.getAttribute("src") || finished) return;
    failures++;
    if (failures >= tracks.length) { finished = true; caption.hidden = true; return; }
    advance();
  });
  // Si le navigateur refuse l'autoplay, retenter lors d'une interaction avec la page.
  function retry() { if (blocked) { blocked = false; play(); } }
  document.addEventListener("pointerdown", retry);
  document.addEventListener("keydown", retry);
  window.GTXLoadingMusic = {
    start: function (value) {
      started = true; gameVolume = clamp(value, 1); updateVolume();
      if (gameVolume === 0) audio.pause();
      else play();
    }
  };
  select(0);
}());
