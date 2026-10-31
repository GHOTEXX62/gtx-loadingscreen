/* Playlist de fichiers audio locaux ou via URL directe. */
window.GTXLoadingConfig = {
  brand: "GTX ROLEPLAY",
  welcome: "Chaque rencontre est le début d’une nouvelle scène. Préparez votre arrivée, la ville vous attend.",
  tipInterval: 12000,
  music: {
    enabled: true,
    src: "", // Exemple : "assets/music/ambiance.mp3" ou URL HTTPS directe d'un fichier audio.
    // Liste vide : utilise src ci-dessus. Fichiers audio uniquement.
    playlist: [
      // { title: "Ambiance 1", src: "assets/music/ambiance-1.mp3" },
      // { title: "Ambiance 2", src: "assets/music/ambiance-2.ogg" },
      { title: "RnBoi - J'assume", src: "assets/music/RnBoi(J'assume).mp3" },
    ],
    title: "Ambiance GTX",
    volume: 0.25, // De 0 à 1, multiplié par le volume musique du joueur en jeu.
    loop: true
  },
  tips: [
    { title: "Faites vivre votre personnage.", body: "Donnez-lui une personnalité, des ambitions et des raisons d’aller vers les autres. Les meilleures histoires se construisent ensemble." },
    { title: "Laissez la scène se construire.", body: "Écoutez les autres joueurs, prenez le temps de réagir et acceptez les imprévus. Une scène réussie donne une place à chacun." },
    { title: "Gardez l’esprit roleplay.", body: "Séparez les informations de votre personnage de celles que vous connaissez en tant que joueur. En cas de doute, demandez conseil à l’équipe." }
  ]
};
