/* ==========================================
   CineFlow Core JavaScript Application
   ========================================== */

// --- Movie Database ---
const movies = [
    {
        id: "tears-of-steel",
        title: "Tears of Steel",
        year: 2012,
        genres: ["Sci-Fi", "Action"],
        rating: 8.2,
        duration: "12 mins",
        synopsis: "Set in an alternate future of Amsterdam, a group of scientists and warriors gather at the Oude Kerk in a desperate attempt to rescue the world from destructive giant robots using time travel technology.",
        cast: "Derek de Lint, Sergio Hasselbaink, Rogier Schippers, Vanja Rukavina",
        poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        featured: true
    },
    {
        id: "sintel",
        title: "Sintel",
        year: 2010,
        genres: ["Fantasy", "Animation", "Drama"],
        rating: 8.8,
        duration: "14 mins",
        synopsis: "A lonely young woman named Sintel rescues and befriends a baby dragon she names Scales. When Scales is kidnapped by an adult dragon, Sintel embarks on a dangerous and emotional quest to find him.",
        cast: "Halina Reijn, Thom Hoffman",
        poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        featured: false
    },
    {
        id: "big-buck-bunny",
        title: "Big Buck Bunny",
        year: 2008,
        genres: ["Animation", "Comedy"],
        rating: 7.9,
        duration: "9 mins",
        synopsis: "A giant, fluffy rabbit wakes up in his forest home, only to find three bullying rodents making life miserable for him and his forest friends. Bunny decides to take matters into his own hands with elaborate traps.",
        cast: "Bunny, Rodents, Forest Creatures",
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        featured: false
    },
    {
        id: "elephants-dream",
        title: "Elephants Dream",
        year: 2006,
        genres: ["Sci-Fi", "Animation", "Drama"],
        rating: 7.5,
        duration: "11 mins",
        synopsis: "In a bizarre, mechanical world, two characters—Proog, the mentor, and Emo, the student—explore the surreal rooms of a giant machine, revealing their differences in perspective, sanity, and reality.",
        cast: "Tygo Gernandt, Cas Jansen",
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        featured: false
    },
    {
        id: "epic-escapes",
        title: "Epic Escapes",
        year: 2019,
        genres: ["Action", "Drama"],
        rating: 7.8,
        duration: "15 mins",
        synopsis: "A high-octane visual journey tracking the world's most daring athletes as they escape the boundaries of normal life and scale heights never before attempted.",
        cast: "Alex Honnold, Jimmy Chin, Conrad Anker",
        poster: "https://images.unsplash.com/photo-1505635330303-319539796671?q=80&w=600&auto=format&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        featured: false
    },
    {
        id: "infinite-horizon",
        title: "Infinite Horizon",
        year: 2021,
        genres: ["Sci-Fi", "Drama"],
        rating: 8.0,
        duration: "14 mins",
        synopsis: "A cinematic look at the future of space exploration, charting human civilization's migration to the stars and the emotional ties that pull us back to Earth.",
        cast: "Jessica Chastain, Matthew McConaughey",
        poster: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600&auto=format&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        featured: false
    },
    {
        id: "the-joyride",
        title: "The Joyride",
        year: 2022,
        genres: ["Comedy", "Action"],
        rating: 7.4,
        duration: "11 mins",
        synopsis: "Two friends take a vintage sports car out for a quick spin, only to get caught in a series of highly chaotic and hilarious encounters that test their friendship to the limit.",
        cast: "Ryan Reynolds, Hugh Jackman",
        poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        featured: false
    }
];

// --- App State ---
let currentFilter = "all";
let searchQuery = "";
let currentView = "home"; // "home", "watchlist", "about", or "upload"
let watchlist = JSON.parse(localStorage.getItem("cineflow_watchlist")) || [];
let userMoviesList = [];
let selectedVideoFile = null;

// --- IndexedDB Database Config ---
const DB_NAME = "CineFlowDB";
const DB_VERSION = 1;
const STORE_NAME = "user_videos";
let db = null;

// --- DOM Elements ---
const moviesGrid = document.getElementById("movies-grid");
const genreFilters = document.getElementById("genre-filters");
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const emptyState = document.getElementById("empty-state");
const emptyResetBtn = document.getElementById("empty-reset-btn");
const watchlistBadge = document.getElementById("watchlist-badge");
const heroSection = document.getElementById("hero-section");
const catalogTitle = document.getElementById("catalog-title");

// Nav Buttons
const navHome = document.getElementById("nav-home");
const navWatchlist = document.getElementById("nav-watchlist");
const navAbout = document.getElementById("nav-about");
const navUpload = document.getElementById("nav-upload");
const logoBtn = document.getElementById("logo-btn");

// View Sections
const aboutSection = document.getElementById("about-section");
const uploadSection = document.getElementById("upload-section");

// Upload Panel Form Controls
const dropzone = document.getElementById("dropzone");
const videoFileInput = document.getElementById("video-file-input");
const previewCard = document.getElementById("preview-card");
const previewRemove = document.getElementById("preview-remove");
const previewVideoPlayer = document.getElementById("preview-video-player");
const previewFileName = document.getElementById("preview-file-name");
const previewFileSize = document.getElementById("preview-file-size");
const uploadForm = document.getElementById("upload-form");
const uploadTitle = document.getElementById("upload-title");
const uploadGenre = document.getElementById("upload-genre");
const uploadDesc = document.getElementById("upload-desc");
const uploadCast = document.getElementById("upload-cast");
const publishBtn = document.getElementById("publish-btn");
const uploadProgressOverlay = document.getElementById("upload-progress-overlay");
const progressBarFill = document.getElementById("progress-bar-fill");
const progressPercent = document.getElementById("progress-percent");
const progressStatusTitle = document.getElementById("progress-status-title");
const progressStatusDesc = document.getElementById("progress-status-desc");

// Modal Elements
const movieModal = document.getElementById("movie-modal");
const modalClose = document.getElementById("modal-close");
const modalPoster = document.getElementById("modal-poster");
const modalTitle = document.getElementById("modal-title");
const modalGenre = document.getElementById("modal-genre");
const modalYear = document.getElementById("modal-year");
const modalDuration = document.getElementById("modal-duration");
const modalRatingVal = document.getElementById("modal-rating-val");
const modalSynopsis = document.getElementById("modal-synopsis");
const modalCast = document.getElementById("modal-cast");
const modalWatchlistBtn = document.getElementById("modal-watchlist-btn");

// Hero elements
const heroTitle = document.getElementById("hero-title");
const heroDesc = document.getElementById("hero-desc");
const heroGenreBadge = document.getElementById("hero-genre-badge");
const heroRating = document.getElementById("hero-rating");
const heroYear = document.getElementById("hero-year");
const heroDuration = document.getElementById("hero-duration");
const heroBgImg = document.getElementById("hero-bg-img");
const heroPlayBtn = document.getElementById("hero-play-btn");
const heroWatchlistBtn = document.getElementById("hero-watchlist-btn");

// Custom Video Player Elements
const playerContainer = document.getElementById("player-container");
const videoPlayer = document.getElementById("main-video-player");
const playerPlayBtn = document.getElementById("player-play");
const centerPlayTrigger = document.getElementById("center-play-trigger");
const playerMuteBtn = document.getElementById("player-mute");
const volumeSlider = document.getElementById("volume-slider");
const currentTimeDisplay = document.getElementById("current-time");
const durationTimeDisplay = document.getElementById("duration-time");
const progressContainer = document.getElementById("progress-container");
const progressFilled = document.getElementById("progress-filled");
const progressHandle = document.getElementById("progress-handle");
const speedBtn = document.getElementById("speed-btn");
const speedMenu = document.getElementById("speed-menu");
const playerFullscreenBtn = document.getElementById("player-fullscreen");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    loadAllContent();
    updateWatchlistBadge();
    setupEventListeners();
    setupUploadHandlers();
});

// --- Feature Banner (Hero) Setup ---
function initHero() {
    const featured = getCombinedMovies().find(m => m.featured) || getCombinedMovies()[0];
    if (featured) {
        heroTitle.textContent = featured.title;
        heroDesc.textContent = featured.synopsis;
        heroGenreBadge.textContent = featured.genres.join(" & ");
        heroRating.textContent = featured.rating;
        heroYear.textContent = featured.year;
        heroDuration.textContent = featured.duration;
        heroBgImg.style.backgroundImage = `url('${featured.poster}')`;
        
        // Watch Now click
        heroPlayBtn.onclick = () => openMovieModal(featured);
        
        // Watchlist click
        updateHeroWatchlistBtnState(featured.id);
        heroWatchlistBtn.onclick = () => {
            toggleWatchlist(featured.id);
            updateHeroWatchlistBtnState(featured.id);
        };
    }
}

function updateHeroWatchlistBtnState(movieId) {
    const inWatchlist = watchlist.includes(movieId);
    const span = heroWatchlistBtn.querySelector("span");
    const icon = heroWatchlistBtn.querySelector("svg");
    
    if (inWatchlist) {
        heroWatchlistBtn.classList.add("in-watchlist");
        span.textContent = "In Watchlist";
        icon.setAttribute("fill", "currentColor");
    } else {
        heroWatchlistBtn.classList.remove("in-watchlist");
        span.textContent = "Add to Watchlist";
        icon.setAttribute("fill", "none");
    }
}

// --- Render Movie Cards Grid ---
function renderMovies() {
    moviesGrid.innerHTML = "";
    
    // Filter movies
    let filteredMovies = getCombinedMovies();
    
    // View filter
    if (currentView === "watchlist") {
        filteredMovies = getCombinedMovies().filter(m => watchlist.includes(m.id));
    }
    
    // Genre filter
    if (currentFilter !== "all" && currentView !== "watchlist") {
        filteredMovies = filteredMovies.filter(m => m.genres.includes(currentFilter));
    }
    
    // Search filter
    if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        filteredMovies = filteredMovies.filter(m => 
            m.title.toLowerCase().includes(query) || 
            m.synopsis.toLowerCase().includes(query) ||
            m.genres.some(g => g.toLowerCase().includes(query))
        );
    }
    
    // Check for empty state
    if (filteredMovies.length === 0) {
        emptyState.classList.remove("hidden");
        moviesGrid.classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        moviesGrid.classList.remove("hidden");
        
        filteredMovies.forEach(movie => {
            const card = document.createElement("div");
            card.className = "movie-card";
            card.style.animation = "slideUp 0.4s ease forwards";
            
            const isFav = watchlist.includes(movie.id);
            const userBadgeHTML = movie.isUserUpload ? `<div class="card-user-badge">User Upload</div>` : '';
            
            card.innerHTML = `
                <div class="card-poster-wrap">
                    <img class="card-poster" src="${movie.poster}" alt="${movie.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="play-circle">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="8,5 19,12 8,19" />
                            </svg>
                        </div>
                    </div>
                    <div class="card-rating-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
                        </svg>
                        <span>${movie.rating}</span>
                    </div>
                    ${userBadgeHTML}
                    <button class="card-watchlist-trigger ${isFav ? 'in-watchlist' : ''}" data-id="${movie.id}" aria-label="Add to watchlist">
                        <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <div class="card-body">
                    <div class="card-meta">
                        <span class="card-genre">${movie.genres[0]}</span>
                        <span>•</span>
                        <span>${movie.year}</span>
                    </div>
                    <h3 class="card-title">${movie.title}</h3>
                    <p class="card-desc">${movie.synopsis}</p>
                </div>
            `;
            
            // Open modal when card clicked (excluding watchlist badge click)
            card.addEventListener("click", (e) => {
                if (e.target.closest(".card-watchlist-trigger")) {
                    return;
                }
                openMovieModal(movie);
            });
            
            moviesGrid.appendChild(card);
        });
        
        // Add watchlist click events
        document.querySelectorAll(".card-watchlist-trigger").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = btn.getAttribute("data-id");
                toggleWatchlist(id);
                renderMovies(); // Refresh layouts
                updateHeroWatchlistBtnState(id);
            });
        });
    }
}

// --- Watchlist State Management ---
function toggleWatchlist(movieId) {
    const idx = watchlist.indexOf(movieId);
    if (idx === -1) {
        watchlist.push(movieId);
    } else {
        watchlist.splice(idx, 1);
    }
    
    // Save state
    localStorage.setItem("cineflow_watchlist", JSON.stringify(watchlist));
    updateWatchlistBadge();
}

function updateWatchlistBadge() {
    watchlistBadge.textContent = watchlist.length;
    if (watchlist.length > 0) {
        watchlistBadge.classList.remove("hidden");
    } else {
        watchlistBadge.classList.add("hidden");
    }
}

// --- Modal Details & Custom Media Player Opening ---
function openMovieModal(movie) {
    // Populate Modal Content
    modalPoster.src = movie.poster;
    modalPoster.alt = movie.title;
    modalTitle.textContent = movie.title;
    modalGenre.textContent = movie.genres.join(", ");
    modalYear.textContent = movie.year;
    modalDuration.textContent = movie.duration;
    modalRatingVal.textContent = movie.rating;
    modalSynopsis.textContent = movie.synopsis;
    modalCast.textContent = movie.cast;
    
    // Modal Watchlist sync
    updateModalWatchlistBtnState(movie.id);
    modalWatchlistBtn.onclick = () => {
        toggleWatchlist(movie.id);
        updateModalWatchlistBtnState(movie.id);
        renderMovies();
        updateHeroWatchlistBtnState(movie.id);
    };

    // Load Video Player Source
    videoPlayer.src = movie.videoUrl;
    videoPlayer.load();
    
    // Show Modal
    movieModal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent page scrolling
    
    // Custom Player Resets
    resetCustomPlayer();
}

function updateModalWatchlistBtnState(movieId) {
    const inWatchlist = watchlist.includes(movieId);
    const span = modalWatchlistBtn.querySelector("span");
    const icon = modalWatchlistBtn.querySelector("svg");
    
    if (inWatchlist) {
        modalWatchlistBtn.classList.add("in-watchlist");
        span.textContent = "In Watchlist";
        icon.setAttribute("fill", "currentColor");
    } else {
        modalWatchlistBtn.classList.remove("in-watchlist");
        span.textContent = "Add to Watchlist";
        icon.setAttribute("fill", "none");
    }
}

function closeMovieModal() {
    videoPlayer.pause();
    videoPlayer.src = ""; // Flush source
    movieModal.classList.add("hidden");
    document.body.style.overflow = ""; // Re-enable page scrolling
}

// --- Custom Player Controls Implementation ---
function resetCustomPlayer() {
    playerContainer.classList.add("paused");
    playerContainer.classList.remove("playing");
    
    togglePlayPauseIcons(false);
    
    // Volume state syncer
    videoPlayer.volume = volumeSlider.value;
    videoPlayer.muted = false;
    updateVolumeIcon(false);
    
    // Progress track
    progressFilled.style.width = "0%";
    progressHandle.style.left = "0%";
    currentTimeDisplay.textContent = "00:00";
    durationTimeDisplay.textContent = "00:00";
    
    // Speed rate
    videoPlayer.playbackRate = 1.0;
    speedBtn.textContent = "1.0x";
    document.querySelectorAll(".speed-menu div").forEach(d => d.classList.remove("active"));
    document.querySelector(".speed-menu div[data-speed='1']").classList.add("active");
    speedMenu.classList.add("hidden");
}

function togglePlay() {
    if (videoPlayer.paused) {
        videoPlayer.play()
            .then(() => {
                playerContainer.classList.remove("paused");
                playerContainer.classList.add("playing");
                togglePlayPauseIcons(true);
            })
            .catch(err => {
                console.error("Playback failed: ", err);
            });
    } else {
        videoPlayer.pause();
        playerContainer.classList.add("paused");
        playerContainer.classList.remove("playing");
        togglePlayPauseIcons(false);
    }
}

function togglePlayPauseIcons(isPlaying) {
    const playIcons = [
        playerPlayBtn.querySelector(".play-icon"),
        centerPlayTrigger.querySelector(".play-svg")
    ];
    const pauseIcons = [
        playerPlayBtn.querySelector(".pause-icon"),
        centerPlayTrigger.querySelector(".pause-svg")
    ];
    
    if (isPlaying) {
        playIcons.forEach(i => i.classList.add("hidden"));
        pauseIcons.forEach(i => i.classList.remove("hidden"));
    } else {
        playIcons.forEach(i => i.classList.remove("hidden"));
        pauseIcons.forEach(i => i.classList.add("hidden"));
    }
}

function updateVolumeIcon(isMuted) {
    const volHigh = playerMuteBtn.querySelector(".vol-high");
    const volMute = playerMuteBtn.querySelector(".vol-mute");
    
    if (isMuted || videoPlayer.volume === 0) {
        volHigh.classList.add("hidden");
        volMute.classList.remove("hidden");
    } else {
        volHigh.classList.remove("hidden");
        volMute.classList.add("hidden");
    }
}

function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    updateVolumeIcon(videoPlayer.muted);
    if (videoPlayer.muted) {
        volumeSlider.value = 0;
    } else {
        volumeSlider.value = videoPlayer.volume || 0.8;
    }
}

// Time Formatting MM:SS
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Scrubbing Player Time Track
function scrub(e) {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const boundedPos = Math.max(0, Math.min(1, pos));
    
    videoPlayer.currentTime = boundedPos * videoPlayer.duration;
    updateProgressTrack();
}

function updateProgressTrack() {
    if (videoPlayer.duration) {
        const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressFilled.style.width = `${percentage}%`;
        progressHandle.style.left = `${percentage}%`;
    }
    currentTimeDisplay.textContent = formatTime(videoPlayer.currentTime);
}

// Fullscreen API implementation
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen()
            .catch(err => {
                console.error("Error enabling fullscreen: ", err);
            });
    } else {
        document.exitFullscreen();
    }
}

// --- Event Listeners Bindings ---
function setupEventListeners() {
    // Nav Home Click
    const handleHomeView = (e) => {
        if(e) e.preventDefault();
        currentView = "home";
        navHome.classList.add("active");
        navWatchlist.classList.remove("active");
        navAbout.classList.remove("active");
        navUpload.classList.remove("active");
        heroSection.classList.remove("hidden");
        moviesGrid.classList.remove("hidden");
        genreFilters.classList.remove("hidden");
        catalogTitle.classList.remove("hidden");
        aboutSection.classList.add("hidden");
        uploadSection.classList.add("hidden");
        catalogTitle.textContent = "Explore Movies";
        renderMovies();
    };
    
    navHome.addEventListener("click", handleHomeView);
    logoBtn.addEventListener("click", handleHomeView);
    
    // Nav Watchlist Click
    navWatchlist.addEventListener("click", (e) => {
        e.preventDefault();
        currentView = "watchlist";
        navWatchlist.classList.add("active");
        navHome.classList.remove("active");
        navAbout.classList.remove("active");
        navUpload.classList.remove("active");
        heroSection.classList.add("hidden");
        moviesGrid.classList.remove("hidden");
        genreFilters.classList.add("hidden");
        catalogTitle.classList.remove("hidden");
        aboutSection.classList.add("hidden");
        uploadSection.classList.add("hidden");
        catalogTitle.textContent = "My Watchlist";
        renderMovies();
    });

    // Nav About Click
    navAbout.addEventListener("click", (e) => {
        e.preventDefault();
        currentView = "about";
        navAbout.classList.add("active");
        navHome.classList.remove("active");
        navWatchlist.classList.remove("active");
        navUpload.classList.remove("active");
        heroSection.classList.add("hidden");
        moviesGrid.classList.add("hidden");
        genreFilters.classList.add("hidden");
        catalogTitle.classList.add("hidden");
        emptyState.classList.add("hidden");
        aboutSection.classList.remove("hidden");
        uploadSection.classList.add("hidden");
    });

    // Nav Upload Click
    navUpload.addEventListener("click", (e) => {
        e.preventDefault();
        currentView = "upload";
        navUpload.classList.add("active");
        navHome.classList.remove("active");
        navWatchlist.classList.remove("active");
        navAbout.classList.remove("active");
        heroSection.classList.add("hidden");
        moviesGrid.classList.add("hidden");
        genreFilters.classList.add("hidden");
        catalogTitle.classList.add("hidden");
        emptyState.classList.add("hidden");
        aboutSection.classList.add("hidden");
        uploadSection.classList.remove("hidden");
        resetUploadForm();
    });

    // Genre Filters selection
    genreFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;
        
        // Remove active class
        genreFilters.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        currentFilter = btn.getAttribute("data-genre");
        renderMovies();
    });

    // Footer Genre Links
    document.querySelectorAll(".genre-footer-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const genre = link.getAttribute("data-genre");
            
            // Switch tabs
            genreFilters.querySelectorAll(".tab-btn").forEach(b => {
                if (b.getAttribute("data-genre") === genre) {
                    b.click();
                    // Scroll to tab section
                    genreFilters.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    });

    // Realtime Search engine
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (searchQuery.trim() !== "") {
            searchClear.style.display = "flex";
        } else {
            searchClear.style.display = "none";
        }
        renderMovies();
    });

    searchClear.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        searchClear.style.display = "none";
        renderMovies();
        searchInput.focus();
    });

    // Reset Filters from Empty state
    emptyResetBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        searchClear.style.display = "none";
        currentFilter = "all";
        genreFilters.querySelectorAll(".tab-btn").forEach(b => {
            b.classList.remove("active");
            if (b.getAttribute("data-genre") === "all") b.classList.add("active");
        });
        renderMovies();
    });

    // Close Modal Events
    modalClose.addEventListener("click", closeMovieModal);
    movieModal.addEventListener("click", (e) => {
        if (e.target === movieModal) closeMovieModal();
    });
    
    // Keyboard Escape Key to Close
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !movieModal.classList.contains("hidden")) {
            closeMovieModal();
        }
    });

    // --- Custom Media Player Event Bindings ---
    playerPlayBtn.addEventListener("click", togglePlay);
    centerPlayTrigger.addEventListener("click", togglePlay);
    videoPlayer.addEventListener("click", togglePlay);
    
    videoPlayer.addEventListener("timeupdate", updateProgressTrack);
    videoPlayer.addEventListener("loadedmetadata", () => {
        durationTimeDisplay.textContent = formatTime(videoPlayer.duration);
    });

    // Video Player end state
    videoPlayer.addEventListener("ended", () => {
        playerContainer.classList.add("paused");
        playerContainer.classList.remove("playing");
        togglePlayPauseIcons(false);
    });

    // Volume controllers
    playerMuteBtn.addEventListener("click", toggleMute);
    volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        videoPlayer.volume = val;
        videoPlayer.muted = val === 0;
        updateVolumeIcon(videoPlayer.muted);
    });

    // Progress scrubbers
    let isMouseDown = false;
    progressContainer.addEventListener("click", scrub);
    progressContainer.addEventListener("mousemove", (e) => {
        if (isMouseDown) scrub(e);
    });
    progressContainer.addEventListener("mousedown", () => isMouseDown = true);
    window.addEventListener("mouseup", () => isMouseDown = false);

    // Speed playback selectors
    speedBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        speedMenu.classList.toggle("hidden");
    });
    
    document.querySelectorAll(".speed-menu div").forEach(opt => {
        opt.addEventListener("click", (e) => {
            e.stopPropagation();
            const rate = parseFloat(opt.getAttribute("data-speed"));
            videoPlayer.playbackRate = rate;
            speedBtn.textContent = `${rate.toFixed(1)}x`;
            
            // Toggle active menu speeds
            document.querySelectorAll(".speed-menu div").forEach(d => d.classList.remove("active"));
            opt.classList.add("active");
            speedMenu.classList.add("hidden");
        });
    });

    window.addEventListener("click", () => {
        speedMenu.classList.add("hidden");
    });

    // Fullscreen toggler
    playerFullscreenBtn.addEventListener("click", toggleFullscreen);
    
    // Sync fullscreen overlay state triggers
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement === playerContainer) {
            playerContainer.style.aspectRatio = "auto";
        } else {
            playerContainer.style.aspectRatio = "16/9";
        }
    });

    // Keyboard Spacebar to Pause Modal Playback
    window.addEventListener("keydown", (e) => {
        if (e.key === " " && !movieModal.classList.contains("hidden")) {
            // Prevent default page scroll on spacebar
            e.preventDefault();
            togglePlay();
        }
    });
}

// --- Get Combined Movies (Default + User Uploaded) ---
function getCombinedMovies() {
    return [...movies, ...userMoviesList];
}

// --- IndexedDB Database Services ---
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        
        request.onsuccess = (e) => {
            db = e.target.result;
            resolve(db);
        };
        
        request.onerror = (e) => {
            console.error("IndexedDB opening failed: ", e.target.error);
            reject(e.target.error);
        };
    });
}

function getAllUserVideos() {
    return new Promise((resolve) => {
        if (!db) {
            resolve([]);
            return;
        }
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => {
            resolve(request.result || []);
        };
        
        request.onerror = () => {
            resolve([]);
        };
    });
}

function saveUserVideo(videoData) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(videoData);
        
        request.onsuccess = () => {
            resolve();
        };
        
        request.onerror = (e) => {
            reject(e.target.error);
        };
    });
}

// --- Content Loading Service ---
async function loadAllContent() {
    try {
        await initDB();
        const userVideos = await getAllUserVideos();
        
        // Revoke old object URLs first if any exist to prevent leaks
        userMoviesList.forEach(m => {
            if (m.videoUrl && m.videoUrl.startsWith("blob:")) {
                URL.revokeObjectURL(m.videoUrl);
            }
        });
        
        userMoviesList = userVideos.map(v => {
            const blobUrl = URL.createObjectURL(v.videoBlob);
            return {
                id: v.id,
                title: v.title,
                year: v.year,
                genres: [v.genre],
                rating: parseFloat(v.rating),
                duration: v.duration,
                synopsis: v.description,
                cast: v.cast || "Independent Creator",
                poster: v.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
                videoUrl: blobUrl,
                featured: false,
                isUserUpload: true
            };
        });
        
        renderMovies();
        initHero();
    } catch (err) {
        console.error("Error loading database content: ", err);
        renderMovies();
        initHero();
    }
}

// --- Video Upload Handler Bindings ---
function setupUploadHandlers() {
    // Click on dropzone to trigger input
    dropzone.addEventListener("click", () => {
        videoFileInput.click();
    });

    // File Input change event
    videoFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleVideoFile(e.target.files[0]);
        }
    });

    // Drag-and-Drop drag events
    ["dragenter", "dragover"].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove("dragover");
        }, false);
    });

    // Handle dropped file
    dropzone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleVideoFile(files[0]);
        }
    }, false);

    // Remove preview file click
    previewRemove.addEventListener("click", (e) => {
        e.stopPropagation();
        resetUploadForm();
    });

    // Realtime Form inputs validation
    [uploadTitle, uploadGenre, uploadDesc, uploadCast].forEach(input => {
        input.addEventListener("input", checkFormValidity);
    });
    uploadGenre.addEventListener("change", checkFormValidity);

    // Form submit listener
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (selectedVideoFile && uploadForm.checkValidity()) {
            simulateUpload();
        }
    });
}

function handleVideoFile(file) {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm", "video/mov"];
    
    // Simple extension fallback check in case mime-type is blank in Windows local environment
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const isValidExt = [".mp4", ".mov", ".webm"].includes(ext);

    if (validTypes.includes(file.type) || isValidExt) {
        selectedVideoFile = file;
        
        // Setup video preview player stream
        const fileUrl = URL.createObjectURL(file);
        previewVideoPlayer.src = fileUrl;
        previewVideoPlayer.load();

        // Populate filename and size
        previewFileName.textContent = file.name;
        previewFileSize.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        // Suggest a title based on filename
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        uploadTitle.value = nameWithoutExt.replace(/[-_]/g, ' ');

        // Toggle UI panels
        dropzone.classList.add("hidden");
        previewCard.classList.remove("hidden");

        checkFormValidity();
    } else {
        alert("Invalid file format. Please upload a video file in MP4, MOV, or WebM format.");
    }
}

function checkFormValidity() {
    const isValid = selectedVideoFile && 
                    uploadTitle.value.trim() !== "" && 
                    uploadGenre.value !== "" && 
                    uploadDesc.value.trim() !== "";
    publishBtn.disabled = !isValid;
}

function resetUploadForm() {
    // Revoke object URL to free memory
    if (previewVideoPlayer.src && previewVideoPlayer.src.startsWith("blob:")) {
        URL.revokeObjectURL(previewVideoPlayer.src);
    }
    
    // Clear elements
    videoFileInput.value = "";
    previewVideoPlayer.src = "";
    selectedVideoFile = null;
    
    uploadTitle.value = "";
    uploadGenre.value = "";
    uploadDesc.value = "";
    uploadCast.value = "";
    
    publishBtn.disabled = true;
    
    // Toggle UI panels
    dropzone.classList.remove("hidden");
    previewCard.classList.add("hidden");
}

function simulateUpload() {
    uploadProgressOverlay.classList.remove("hidden");
    
    // Capture duration from video element
    const duration = previewVideoPlayer.duration;
    let durationText = "0:15 mins";
    if (duration && !isNaN(duration) && duration !== Infinity) {
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        if (mins > 0) {
            durationText = `${mins} min${mins > 1 ? 's' : ''}`;
        } else {
            durationText = `0:${secs.toString().padStart(2, '0')} mins`;
        }
    }

    let progress = 0;
    progressBarFill.style.width = "0%";
    progressPercent.textContent = "0%";

    const interval = setInterval(async () => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress > 100) progress = 100;
        
        progressBarFill.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;
        
        // Update status messages
        if (progress < 40) {
            progressStatusTitle.textContent = "Uploading video file...";
            progressStatusDesc.textContent = "Copying media stream and loading binaries.";
        } else if (progress < 80) {
            progressStatusTitle.textContent = "Processing and transcoding...";
            progressStatusDesc.textContent = "Optimizing playback bitrates for native web HTML5 players.";
        } else {
            progressStatusTitle.textContent = "Writing to local database...";
            progressStatusDesc.textContent = "Saving video metadata and blob inside browser storage.";
        }

        if (progress === 100) {
            clearInterval(interval);
            
            try {
                // Construct video record
                const videoData = {
                    id: "user-" + Date.now(),
                    title: uploadTitle.value.trim(),
                    genre: uploadGenre.value,
                    description: uploadDesc.value.trim(),
                    cast: uploadCast.value.trim() || "Independent Creator",
                    rating: (6.8 + Math.random() * 2.8).toFixed(1), // Random rating between 6.8 and 9.6
                    year: new Date().getFullYear(),
                    duration: durationText,
                    videoBlob: selectedVideoFile,
                    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"
                };
                
                // Save to IndexedDB and reload UI
                await saveUserVideo(videoData);
                await loadAllContent();
                
                // Reset form fields
                resetUploadForm();
                
                // Hide overlay
                setTimeout(() => {
                    uploadProgressOverlay.classList.add("hidden");
                    // Redirect to home page view
                    navHome.click();
                }, 400);

            } catch (err) {
                console.error("Failed to save video: ", err);
                alert("Upload failed. Error saving to IndexedDB: " + err.message);
                uploadProgressOverlay.classList.add("hidden");
            }
        }
    }, 100);
}
