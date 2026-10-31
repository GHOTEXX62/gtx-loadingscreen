(function () {
  "use strict";
  var config = window.GTXLoadingConfig || {};
  var total = null, needed = null, started = Date.now(), tip = 0;
  var demoTimer = null, live = false;
  function el(id) { return document.getElementById(id); }
  function text(id, value) { el(id).textContent = String(value); }
  function count(value) {
    if (value === null || value === "" || typeof value === "boolean") return null;
    var number = Number(value);
    return isFinite(number) && number >= 0 ? Math.floor(number) : null;
  }
  function engine() {
    if (!live) {
      live = true;
      if (demoTimer !== null) { clearInterval(demoTimer); demoTimer = null; total = null; needed = null; }
      render();
    }
  }
  function render() {
    var known = total !== null && total > 0 && needed !== null;
    var track = el("progress");
    track.className = "progress-track" + (known ? "" : " indeterminate");
    if (!known) {
      track.removeAttribute("aria-valuenow");
      text("percentage", "•••");
      text("file-count", needed !== null ? needed + " fichier(s) restant(s)" : "En attente des informations");
      el("progress-fill").style.width = "";
      return;
    }
    var done = Math.max(0, total - Math.min(total, needed));
    var percent = Math.floor(done / total * 100);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(percent));
    el("progress-fill").style.width = percent + "%";
    text("percentage", percent + "%");
    text("file-count", done + " / " + total + " fichiers");
    if (needed === 0) {
      text("status", "Préparation de la partie…");
      text("file-name", "Téléchargements terminés · Chargement de la carte et des ressources");
    }
  }
  // Callbacks natifs : https://wiki.facepunch.com/gmod/Loading_URL
  window.GameDetails = function (name, url, map, maxPlayers, steamid, gamemode, volume) {
    engine();
    if (window.GTXLoadingMusic) window.GTXLoadingMusic.start(volume);
    if (name) text("server-name", name);
    if (map) text("map-name", map);
    if (gamemode) text("game-mode", gamemode.toLowerCase() === "darkrp" ? "DarkRP" : gamemode);
  };
  window.SetFilesTotal = function (value) { engine(); total = count(value); render(); };
  window.SetFilesNeeded = function (value) { engine(); needed = count(value); render(); };
  window.DownloadingFile = function (name) { engine(); text("status", "Téléchargement des ressources…"); text("file-name", name || "Récupération des fichiers du serveur"); };
  window.SetStatusChanged = function (status) { engine(); if (status) text("status", status); };
  if (config.brand) { text("brand", config.brand); text("footer-brand", config.brand + " · BIENVENUE CHEZ VOUS"); }
  if (config.welcome) text("welcome", config.welcome);
  var tips = config.tips || [];
  function showTip() {
    if (!tips.length) return;
    text("tip-title", tips[tip].title); text("tip-body", tips[tip].body);
    document.querySelector(".card-index").textContent = ("0" + (tip + 1)).slice(-2) + " / " + ("0" + tips.length).slice(-2);
    var dots = document.querySelector(".dots");
    dots.textContent = "";
    for (var i = 0; i < tips.length; i++) { var dot = document.createElement("i"); dot.className = i === tip ? "active" : ""; dots.appendChild(dot); }
    tip = (tip + 1) % tips.length;
  }
  showTip();
  if (tips.length > 1) setInterval(showTip, Math.max(5000, Number(config.tipInterval) || 12000));
  setInterval(function () {
    var seconds = Math.floor((Date.now() - started) / 1000);
    text("elapsed", ("0" + Math.floor(seconds / 60)).slice(-2) + ":" + ("0" + seconds % 60).slice(-2));
  }, 1000);
  // Démo explicite, jamais activée par défaut. Le premier callback réel l'arrête.
  if (/(?:\?|&)demo=1(?:&|$)/.test(window.location.search)) {
    text("server-name", "GTX ROLEPLAY | DarkRP Serious RP");
    text("map-name", "Aperçu · carte du serveur");
    text("status", "Aperçu · Téléchargement des ressources…");
    total = 240; needed = 240;
    render();
    demoTimer = setInterval(function () {
      needed = Math.max(0, needed - 3);
      text("file-name", "Aperçu · materials/gtx/ressources_" + (total - needed) + ".vtf");
      render();
      if (needed === 0) { clearInterval(demoTimer); demoTimer = null; }
    }, 800);
  }
}());
