const canais = [
  {
    nome: "Red Bull TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Red_Bull_TV_logo.svg",
    url: "https://rbmn-live.akamaized.net/hls/live/590934/BOB-RBMN-LINE4-BR/master.m3u8"
  },
  {
    nome: "NASA TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg",
    url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8"
  },
  {
    nome: "Andorra TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/32/Logo_Andorra_Televisi%C3%B3.png",
    url: "https://livesg1.rtva.hiway.media/11a6d6f4-ee13-47c7-9c27-7313cf5424e2/manifest.m3u8"
  }
];

function renderCanais() {
  const container = document.getElementById('channelsGrid');
  if (!container) return;

  container.innerHTML = '';

  canais.forEach((canal) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-status"><span class="live-dot"></span> AO VIVO</div>
      <img src="${canal.logo}" alt="${canal.nome}" class="card-icon" onerror="this.src='https://via.placeholder.com/50?text=TV'">
      <h3>${canal.nome}</h3>
      <button class="btn-watch" data-url="${canal.url}">▶ ASSISTIR</button>
    `;

    // Evento direto de clique no botão
    const btn = card.querySelector('.btn-watch');
    btn.addEventListener('click', () => {
      playStream(canal.url);
    });

    container.appendChild(card);
  });
}

function playStream(url) {
  const video = document.getElementById('videoPlayer');
  const playerContainer = document.getElementById('playerContainer');

  playerContainer.style.display = 'block';
  playerContainer.scrollIntoView({ behavior: 'smooth' });

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(err => console.log("Aguardando interação:", err));
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play();
  }
}

// Inicializa quando o documento carrega
document.addEventListener('DOMContentLoaded', () => {
  renderCanais();

  // Ação do botão "VER OS CANAIS"
  const btnVerCanais = document.getElementById('btnVerCanais');
  if (btnVerCanais) {
    btnVerCanais.addEventListener('click', () => {
      document.getElementById('canaisSection').scrollIntoView({ behavior: 'smooth' });
    });
  }
});
