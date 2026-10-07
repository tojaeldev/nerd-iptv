document.addEventListener('DOMContentLoaded', () => {
    // Dados dos canais com links funcionais de HLS (.m3u8)
    const channels = [
        {
            id: 'rtp1',
            name: 'RTP 1',
            streamUrl: 'https://streaming-live.rtp.pt/livereplay/smil:rtp1.smil/playlist.m3u8'
        },
        {
            id: 'rtp2',
            name: 'RTP 2',
            streamUrl: 'https://streaming-live.rtp.pt/livereplay/smil:rtp2.smil/playlist.m3u8'
        },
        {
            id: 'sic',
            name: 'SIC',
            streamUrl: 'https://d10738myii9edk.cloudfront.net/out/v1/a32dd5837ff249ea94056157f92b78ce/index.m3u8'
        }
    ];

    const cardsContainer = document.getElementById('cards-container');
    const playerModal = document.getElementById('player-modal');
    const videoPlayer = document.getElementById('video-player');
    const closeModal = document.getElementById('close-modal');
    let hls = null;

    // Renderizar os Cards na Tela
    function renderChannels() {
        cardsContainer.innerHTML = '';

        channels.forEach(channel => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <svg class="tv-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="14" width="52" height="36" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
                    <path d="M22 10L32 14L42 10" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="50" cy="24" r="2" fill="#38bdf8"/>
                    <circle cx="50" cy="32" r="2" fill="#38bdf8"/>
                    <rect x="12" y="20" width="30" height="24" rx="3" fill="#0f172a"/>
                </svg>
                <div class="card-status">
                    <span class="status-dot"></span> AO VIVO
                </div>
                <div class="card-title">${channel.name}</div>
                <div class="card-actions">
                    <button class="btn-watch" data-url="${channel.streamUrl}">
                        ▶ ASSISTIR
                    </button>
                    <button class="btn-fav">☆</button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });

        // Adicionar eventos nos botões de assistir
        document.querySelectorAll('.btn-watch').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.currentTarget.getAttribute('data-url');
                openPlayer(url);
            });
        });
    }

    // Função para abrir e reproduzir o canal
    function openPlayer(url) {
        playerModal.style.display = 'flex';

        if (Hls.isSupported()) {
            if (hls) hls.destroy();
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoPlayer.play();
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = url;
            videoPlayer.play();
        }
    }

    // Fechar o player
    closeModal.addEventListener('click', () => {
        playerModal.style.display = 'none';
        videoPlayer.pause();
        if (hls) hls.destroy();
    });

    renderChannels();
});
      
