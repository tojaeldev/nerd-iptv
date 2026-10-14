// Lista de canais com URLs de teste públicos e estáveis (HTTPS)
const canais = [
  {
    nome: "RTP 1 (Test)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/RTP1_logo_2016.svg",
    url: "https://livesg1.rtva.hiway.media/11a6d6f4-ee13-47c7-9c27-7313cf5424e2/manifest.m3u8"
  },
  {
    nome: "Red Bull TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Red_Bull_TV_logo.svg",
    url: "https://rbmn-live.akamaized.net/hls/live/590934/BOB-RBMN-LINE4-BR/master.m3u8"
  },
  {
    nome: "NASA TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg",
    url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8"
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
      <button class="btn-watch" onclick="playStream('${canal.url}')">▶ ASSISTIR</button>
    `;

    container.appendChild(card);
  });
}

function playStream(url) {
  const video = document.getElementById('videoPlayer');
  const playerContainer = document.getElementById('playerContainer');

  playerContainer.style.display = 'block';
  playerContainer.scrollIntoView({ behavior: 'smooth' });

  if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });
    
    hls.loadSource(url);
    hls.attachMedia(video);

    // Evento de erro para detetar falhas de transmissão/CORS
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        console.error("Erro ao carregar o canal:", data);
        alert("Não foi possível carregar este canal (possível erro de CORS ou link offline). Tente outro canal!");
        hls.destroy();
      }
    });

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(e => console.log("Aguardando interação do utilizador para dar play"));
    });

  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play();
  } else {
    alert("O seu navegador não suporta reprodução de fluxos HLS.");
  }
}

document.addEventListener('DOMContentLoaded', renderCanais);
