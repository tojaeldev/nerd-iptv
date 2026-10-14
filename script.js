// Lista de canais com links de transmissão
const canais = [
  {
    nome: "Red Bull bate asas TV",
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

let hlsInstance = null;

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
      <button class="btn-watch">▶ ASSISTIR</button>
    `;

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

  // Se já existir uma transmissão a rodar, destrói antes de abrir a nova
  if (hlsInstance) {
    hlsInstance.destroy();
  }

  // Utiliza um serviço de Proxy CORS para contornar o bloqueio dos navegadores
  const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);

  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      manifestLoadingTimeOut: 10000, // Desiste após 10 segundos em vez de processar para sempre
      levelLoadingTimeOut: 10000,
      fragLoadingTimeOut: 10000
    });

    // Tenta primeiro com o Proxy CORS
    hlsInstance.loadSource(corsProxyUrl);
    hlsInstance.attachMedia(video);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(e => console.log("Aguardando clique do utilizador para reproduzir."));
    });

    // Caso ocorra erro de carregamento
    hlsInstance.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        console.warn("Falha ao carregar via Proxy, a tentar link direto...");
        // Tenta uma última vez diretamente
        hlsInstance.loadSource(url);
      }
    });

  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCanais();

  const btnVerCanais = document.getElementById('btnVerCanais');
  if (btnVerCanais) {
    btnVerCanais.addEventListener('click', () => {
      document.getElementById('canaisSection').scrollIntoView({ behavior: 'smooth' });
    });
  }
});
