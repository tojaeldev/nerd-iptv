// Cole aqui a lista completa de canais M3U que enviaste
const listaM3U = `
#EXTINF:-1 tvg-name="Kanali 7" tvg-logo="https://i.imgur.com/rL2v9pM.png" tvg-id="Kanali7.al" tvg-country="AL" group-title="Albania",Kanali 7
https://fe.tring.al/delta/105/out/u/1200_1.m3u8
#EXTINF:-1 tvg-name="A2 CNN Albania" tvg-logo="https://i.imgur.com/TgO3Lzi.png" tvg-id="A2CNN.al" tvg-country="AL" group-title="Albania",A2 CNN Albania
https://tv.a2news.com/live/smil:a2cnnweb.stream.smil/playlist.m3u8
#EXTINF:-1 tvg-name="Alpo TV" tvg-logo="https://i.imgur.com/Pr4ixiA.png" tvg-id="AlpoTV.al" tvg-country="AL" group-title="Albania",Alpo TV
https://5d00db0e0fcd5.streamlock.net/7236/7236/playlist.m3u8
#EXTINF:-1 tvg-name="Andorra TV" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/3/32/Logo_Andorra_Televisi%C3%B3.png" tvg-id="AndorraTV.ad" tvg-chno="1" tvg-country="AD" group-title="Andorra",Andorra TV
https://livesg1.rtva.hiway.media/11a6d6f4-ee13-47c7-9c27-7313cf5424e2/manifest.m3u8
#EXTINF:-1 tvg-name="Aunar" tvg-logo="http://tvabierta.weebly.com/uploads/5/1/3/4/51344345/aunar.png" tvg-id="Aunar.ar" tvg-chno="22.3" tvg-country="Argentina" group-title="Argentina",Aunar
https://5fb24b460df87.streamlock.net/live-cont.ar/mirador/playlist.m3u8
#EXTINF:-1 tvg-name="Cine.AR" tvg-logo="https://i.imgur.com/RPLyrIC.png" tvg-id="CineAr.ar" tvg-chno="22.4" tvg-country="Argentina" group-title="Argentina",Cine.AR
https://5fb24b460df87.streamlock.net/live-cont.ar/cinear/playlist.m3u8
#EXTINF:-1 tvg-name="Canal 26" tvg-logo="https://i.imgur.com/5pAaVih.png" tvg-id="Canal26.ar" tvg-chno="24.2" tvg-country="Argentina" group-title="Argentina",Canal 26
https://stream-gtlc.telecentro.net.ar/hls/canal26hls/main.m3u8
#EXTINF:-1 tvg-name="El Trece" tvg-logo="https://i.imgur.com/ZK7AQFg.png" tvg-id="ElTrece.ar" tvg-chno="33.1" tvg-country="Argentina" group-title="Argentina",El Trece
https://livetrx01.vodgc.net/eltrecetv/index.m3u8
#EXTINF:-1 tvg-name="América" tvg-logo="https://i.imgur.com/Jt7dOQm.png" tvg-id="AmericaTV.ar" tvg-chno="36.1" tvg-country="Argentina" group-title="Argentina",América
https://prepublish.f.qaotic.net/a07/americahls-100056/playlist_720p.m3u8
#EXTINF:-1 tvg-name="AZTV" tvg-logo="https://i.imgur.com/snBMMeH.png" tvg-id="AZTV.az" tvg-country="Azerbaijan" group-title="Azerbaijan",AZTV
https://str.yodacdn.net/azertv/index.m3u8
#EXTINF:-1 tvg-name="CBC Sport" tvg-logo="https://upload.wikimedia.org/wikipedia/az/0/04/CBC_Sport_TV_loqo.png" tvg-id="CBCSport.az" tvg-country="Azerbaijan" group-title="Azerbaijan",CBC Sport
https://mn-nl.mncdn.com/cbcsports_live/cbcsports/playlist.m3u8
#EXTINF:-1 tvg-name="İctimai TV" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/%C4%B0ctimai_TV_%282021%29.png/120px-%C4%B0ctimai_TV_%282021%29.png" tvg-id="IctimaiTV.az" tvg-country="Azerbaijan" group-title="Azerbaijan",İctimai TV
https://live.itv.az/itv.m3u8
`;

let hlsInstance = null;

// Função para converter o texto M3U em lista de objetos em JavaScript
function parseM3U(data) {
  const lines = data.split('\n');
  const channels = [];
  let currentChannel = {};

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/tvg-name="([^"]+)"/) || line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);

      currentChannel.name = nameMatch ? (nameMatch[1] || nameMatch[0]) : 'Canal';
      currentChannel.logo = logoMatch ? logoMatch[1] : '';
      currentChannel.group = groupMatch ? groupMatch[1] : 'Geral';
    } else if (line.startsWith('http')) {
      currentChannel.url = line;
      // Só adiciona se for link direto de stream (.m3u8 ou stream compatível)
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel);
      }
      currentChannel = {};
    }
  });

  return channels;
}

const canais = parseM3U(listaM3U);

function renderCanais() {
  const container = document.getElementById('channelsGrid');
  if (!container) return;

  container.innerHTML = '';

  if (canais.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum canal encontrado na lista.</p>';
    return;
  }

  canais.forEach((canal) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-status"><span class="live-dot"></span> ${canal.group}</div>
      <img src="${canal.logo}" alt="${canal.name}" class="card-icon" onerror="this.src='https://via.placeholder.com/50?text=TV'">
      <h3>${canal.name}</h3>
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

  if (hlsInstance) {
    hlsInstance.destroy();
  }

  // Proxy CORS para evitar bloqueios do navegador
  const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);

  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      manifestLoadingTimeOut: 10000,
      levelLoadingTimeOut: 10000,
      fragLoadingTimeOut: 10000
    });

    hlsInstance.loadSource(corsProxyUrl);
    hlsInstance.attachMedia(video);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(e => console.log("Aguardando clique para reproduzir."));
    });

    hlsInstance.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        console.warn("Falha no proxy, tentando link direto...");
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
