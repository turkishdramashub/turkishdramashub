// ===============================
// GOOGLE SCRIPT API CONFIG
// ===============================
const API_BASE = "https://script.google.com/macros/s/AKfycbybKBa5Xo9p_EKN2FR42CzCWdMR43uwWI0JjP3UepQKdORu0Bxc0MPkLNidToglgQuT/exec";

const SHEET_CONFIG = {
    main: "main",
    trending: "trending",
    newReleases: "newReleases",
    topRated: "topRated"
};

// ===============================
// GLOBAL VARIABLES
// ===============================
let allEpisodes = [];
let trendingEpisodes = [];
let newReleases = [];
let topRated = [];

// ===============================
// DOM ELEMENTS
// ===============================
const trendingSlider = document.getElementById('trending-slider');
const newReleasesSlider = document.getElementById('new-releases-slider');
const topRatedSlider = document.getElementById('top-rated-slider');

// search overlay related elements
let searchOverlay, searchClose, searchTrigger, searchInputMain, searchResultsMain, searchResultGrid, resultCount;

// ===============================
// PAGE INITIALIZATION
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    console.log("INDEX PAGE LOADED");
    loadAllData();
    setupEventListeners();
    setupSliders();
    initializeSearchOverlay();
});

// ===============================
// FETCH DATA FROM GOOGLE SCRIPT API
// ===============================
async function fetchSheetData(sheetName) {
    try {
        const url = `${API_BASE}?sheet=${sheetName}`;
        console.log("Fetching:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("API Request Failed");

        return await response.json();  
    } catch (error) {
        console.error("API ERROR:", error);
        return []; 
    }
}

// ===============================
// LOAD ALL DATA
// ===============================
async function loadAllData() {
    try {
        showLoadingState(trendingSlider);
        showLoadingState(newReleasesSlider);
        showLoadingState(topRatedSlider);

        allEpisodes = await fetchSheetData(SHEET_CONFIG.main);
        trendingEpisodes = await fetchSheetData(SHEET_CONFIG.trending);
        newReleases = await fetchSheetData(SHEET_CONFIG.newReleases);
        topRated = await fetchSheetData(SHEET_CONFIG.topRated);

        populateSlider(trendingSlider, trendingEpisodes);
        populateSlider(newReleasesSlider, newReleases);
        populateSlider(topRatedSlider, topRated);

    } catch (e) {
        console.error("Loading data failed", e);
    }
}

// ===============================
// LOADING / ERROR STATES
// ===============================
function showLoadingState(slider) {
    slider.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>
    `;
}

function showErrorState(slider) {
    slider.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i> Failed to load
        </div>
    `;
}

// ===============================
// POPULATE SLIDERS
// ===============================
function populateSlider(slider, data) {
    slider.innerHTML = "";

    if (!data || data.length === 0) {
        showErrorState(slider);
        return;
    }

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "slider-item";
        div.innerHTML = `
            <img src="${item.Thumbnail}" class="slider-img">
            <div class="slider-content">
                <h3 class="slider-title">${item.Title}</h3>
                <p class="slider-episode">Episode ${item.Episode}</p>
            </div>
        `;
        slider.appendChild(div);
    });
}

// ===============================
// SLIDER BUTTONS
// ===============================
function setupSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector(".slider");
        const prev = container.querySelector(".prev");
        const next = container.querySelector(".next");

        let scrollAmount = 0;
        const step = 250;

        prev.onclick = () => {
            scrollAmount = Math.max(scrollAmount - step, 0);
            slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        };

        next.onclick = () => {
            scrollAmount += step;
            slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        };
    });
}

// ===============================
// SEARCH SYSTEM
// ===============================
function initializeSearchOverlay() {
    searchOverlay = document.getElementById("searchOverlay");
    searchInputMain = document.getElementById("searchInputMain");
    searchResultsMain = document.getElementById("searchResultsMain");
    searchResultGrid = document.getElementById("searchResultGrid");
    searchTrigger = document.querySelector(".search-trigger");
    searchClose = document.getElementById("searchClose");
    resultCount = document.getElementById("resultCount");

    searchTrigger.onclick = () => {
        searchOverlay.classList.add("active");
        searchInputMain.focus();
    };

    searchClose.onclick = () => {
        searchOverlay.classList.remove("active");
        searchInputMain.value = "";
        searchResultsMain.classList.remove("active");
    };

    searchInputMain.oninput = () => {
        let query = searchInputMain.value.toLowerCase().trim();

        if (query.length < 1) {
            searchResultsMain.classList.remove("active");
            return;
        }

        let results = allEpisodes.filter(ep =>
            ep.Title.toLowerCase().includes(query)
        );

        displaySearchResults(results);
    };
}

function displaySearchResults(results) {
    searchResultGrid.innerHTML = "";

    if (results.length === 0) {
        searchResultGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                No dramas found
            </div>
        `;
        searchResultsMain.classList.add("active");
        return;
    }

    resultCount.innerHTML = `Found ${results.length} results`;

    results.forEach(item => {
        let div = document.createElement("div");
        div.className = "search-result-item-side";
        div.innerHTML = `
            <div class="result-thumbnail-side">
                <img src="${item.Thumbnail}">
            </div>
            <div class="result-info-side">
                <div class="result-title-side">${item.Title}</div>
                <div class="result-episode-side">Ep ${item.Episode}</div>
            </div>
        `;
        div.onclick = () => {
            window.location.href = `episode.html?ep=${item.Slug}`;
        };
        searchResultGrid.appendChild(div);
    });

    searchResultsMain.classList.add("active");
    }
