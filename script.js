document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const audio = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const volumeBar = document.getElementById('volume-bar');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const albumCover = document.getElementById('album-cover');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const nowPlaying = document.getElementById('now-playing');
    const playlistContainer = document.getElementById('playlist-container');
    const searchBar = document.getElementById('search-bar');
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    const visitorCountEl = document.getElementById('visitor-count');
    const tabs = document.querySelectorAll('.tab-btn');

    // State Variables
    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];

    // --- DATA FETCHING & INITIALIZATION ---
    async function loadSongs() {
        try {
            const response = await fetch('data/songs.json');
            songs = await response.json();
            loadSong(songs[currentSongIndex]);
            renderPlaylist(songs);
            updateVisitorCount();
        } catch (error) {
            console.error("Could not load songs:", error);
        }
    }

    function loadSong(song) {
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        audio.src = song.filePath;
        albumCover.src = song.imagePath;
        nowPlaying.textContent = `Now Playing: ${song.title}`;
        updatePlayingUI();
        addToRecentlyPlayed(song.id);
    }

    // --- PLAYBACK CONTROLS ---
    function playSong() {
        isPlaying = true;
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.play-btn').classList.add('playing');
    }

    function pauseSong() {
        isPlaying = false;
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.play-btn').classList.remove('playing');
    }

    function playPauseToggle() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function prevSong() {
        if (isShuffle) {
            playRandomSong();
        } else {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            loadSong(songs[currentSongIndex]);
            playSong();
        }
    }

    function nextSong() {
        if (isShuffle) {
            playRandomSong();
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(songs[currentSongIndex]);
            playSong();
        }
    }
    
    function playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex);
        currentSongIndex = newIndex;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    // --- UI & TIME UPDATE ---
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        seekBar.value = currentTime;
        
        currentTimeEl.textContent = formatTime(currentTime);
    }

    function setDuration(e) {
        const { duration } = e.srcElement;
        seekBar.max = duration;
        totalDurationEl.textContent = formatTime(duration);
    }
    
    function setProgress(e) {
        audio.currentTime = e.target.value;
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- PLAYLIST MANAGEMENT ---
    function renderPlaylist(playlist) {
        playlistContainer.innerHTML = '';
        playlist.forEach((song, index) => {
            const isFavorited = favorites.includes(song.id);
            const songEl = document.createElement('div');
            songEl.classList.add('playlist-item');
            songEl.dataset.index = songs.findIndex(s => s.id === song.id); // Use original index
            
            songEl.innerHTML = `
                <img src="${song.imagePath}" alt="${song.title}">
                <div class="playlist-item-details">
                    <p class="playlist-item-title">${song.title}</p>
                    <p class="playlist-item-artist">${song.artist}</p>
                </div>
                <button class="fav-btn ${isFavorited ? 'favorited' : ''}" data-id="${song.id}">
                    <i class="fas fa-heart"></i>
                </button>
            `;
            playlistContainer.appendChild(songEl);
        });
        updatePlayingUI();
    }
    
    function updatePlayingUI() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach(item => {
            if (parseInt(item.dataset.index) === currentSongIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    function handlePlaylistClick(e) {
        const clickedItem = e.target.closest('.playlist-item');
        if (clickedItem && !e.target.closest('.fav-btn')) {
            currentSongIndex = parseInt(clickedItem.dataset.index);
            loadSong(songs[currentSongIndex]);
            playSong();
        }
        
        const favButton = e.target.closest('.fav-btn');
        if (favButton) {
            toggleFavorite(parseInt(favButton.dataset.id));
        }
    }

    // --- FEATURES: SEARCH, FAVORITES, RECENTLY PLAYED ---
    function searchSongs() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredSongs = songs.filter(song => 
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
        renderPlaylist(filteredSongs);
    }

    function toggleFavorite(songId) {
        const favIndex = favorites.indexOf(songId);
        if (favIndex > -1) {
            favorites.splice(favIndex, 1);
        } else {
            favorites.push(songId);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        // Re-render current view to update fav icon
        tabs.forEach(tab => {
            if(tab.classList.contains('active')) handleTabClick({ target: tab });
        });
    }

    function addToRecentlyPlayed(songId) {
        // Remove if already exists to move it to the top
        recentlyPlayed = recentlyPlayed.filter(id => id !== songId);
        // Add to the beginning
        recentlyPlayed.unshift(songId);
        // Keep the list to a reasonable size (e.g., 20)
        if (recentlyPlayed.length > 20) {
            recentlyPlayed.pop();
        }
        localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    }

    // --- TABS ---
    function handleTabClick(e) {
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');

        const tabType = e.target.dataset.tab;
        if (tabType === 'playlist') {
            renderPlaylist(songs);
        } else if (tabType === 'favorites') {
            const favoriteSongs = songs.filter(song => favorites.includes(song.id));
            renderPlaylist(favoriteSongs);
        } else if (tabType === 'recent') {
            const recentSongs = recentlyPlayed.map(id => songs.find(song => song.id === id)).filter(Boolean);
            renderPlaylist(recentSongs);
        }
    }

    // --- VOICE SEARCH ---
    function initVoiceSearch() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!window.SpeechRecognition) {
            alert("Your browser does not support voice recognition.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            searchBar.value = transcript;
            searchSongs();
        });

        voiceSearchBtn.addEventListener('click', () => {
            recognition.start();
        });
    }

    // --- VISITOR COUNTER ---
    function updateVisitorCount() {
        let count = localStorage.getItem('visitorCount');
        count = count ? parseInt(count) + 1 : 1;
        localStorage.setItem('visitorCount', count);
        visitorCountEl.textContent = count;
    }

    // --- EVENT LISTENERS ---
    playPauseBtn.addEventListener('click', playPauseToggle);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);
    audio.addEventListener('ended', () => isRepeat ? playSong() : nextSong());
    seekBar.addEventListener('input', setProgress);
    volumeBar.addEventListener('input', (e) => audio.volume = e.target.value);
    
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });
    
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
    });

    playlistContainer.addEventListener('click', handlePlaylistClick);
    searchBar.addEventListener('input', searchSongs);
    tabs.forEach(tab => tab.addEventListener('click', handleTabClick));

    // --- INITIALIZE ---
    loadSongs();
    initVoiceSearch();
});