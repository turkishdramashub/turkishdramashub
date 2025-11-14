// ========= GOOGLE SCRIPT API CONFIG =========

// YOUR GOOGLE SCRIPT API BASE URL
const API_BASE = "https://script.google.com/macros/s/AKfycbybKBa5Xo9p_EKN2FR42CzCWdMR43uwWI0JjP3UepQKdORu0Bxc0MPkLNidToglgQuT/exec";

// SHEET NAMES
const SHEET_CONFIG = {
    main: "main",
    trending: "trending",
    newReleases: "newReleases",
    topRated: "topRated"
};

// API FETCH FUNCTION
async function fetchSheetData(sheetName) {
    try {
        const url = `${API_BASE}?sheet=${sheetName}`;
        console.log("Fetching:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log(sheetName, "Loaded:", data);
        return data;
    } catch (error) {
        console.error("API ERROR:", error);
        return [];
    }
}


// =================== YOUR ORIGINAL CODE (FIXED) ===================

// Global data storage
let allEpisodes = [];
let trendingEpisodes = [];
let newReleases = [];
let topRated = [];

// DOM elements
const trendingSlider = document.getElementById('trending-slider');
const newReleasesSlider = document.getElementById('new-releases-slider');
const topRatedSlider = document.getElementById('top-rated-slider');

// Search Overlay Elements
let searchOverlay, searchClose, searchTrigger, searchInputMain, searchResultsMain, searchResultGrid, resultCount;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    console.log('Website loaded successfully');
    loadAllData();
    setupEventListeners();
    setupSliders();
    initializeSearchOverlay();
});

// Load data from Google Sheets
async function loadAllData() {
    try {
        console.log('Loading all data...');

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

    } catch (error) {
        console.error('Error loading data:', error);

        showErrorState(trendingSlider);
        showErrorState(newReleasesSlider);
        showErrorState(topRatedSlider);

        loadSampleData();
    }
}


// Sample data fallback
function loadSampleData() {
    console.log("Loading sample data... (fallback)");

    const sampleData = [
        {
            "Title": "Loading Failed",
            "Episode": "0",
            "Description": "Sample data loaded because Google API failed",
            "Thumbnail": "https://via.placeholder.com/250x140/333333/666666?text=Sample",
            "Slug": "sample"
        }
    ];

    allEpisodes = sampleData;
    trendingEpisodes = sampleData;
    newReleases = sampleData;
    topRated = sampleData;

    populateSlider(trendingSlider, sampleData);
    populateSlider(newReleasesSlider, sampleData);
    populateSlider(topRatedSlider, sampleData);
}


// Loading state
function showLoadingState(slider) {
    slider.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>
    `;
}

// Error state
function showErrorState(slider) {
    slider.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i> Failed to load content
        </div>
    `;
}


// Populate sliders
function populateSlider(slider, data) {
    slider.innerHTML = "";

    if (!data || data.length === 0) {
        slider.innerHTML = `
            <div class="no-content">
                <i class="fas fa-film"></i> No content available
            </div>
        `;
        return;
    }

    data.forEach(item => {
        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");

        sliderItem.innerHTML = `
            <img src="${item.Thumbnail}" 
                 class="slider-img"
                 onerror="this.src='https://via.placeholder.com/250x140/333333/ffffff?text=No+Image'">
            <div class="slider-content">
                <h3 class="slider-title">${item.Title}</h3>
                <p class="slider-episode">Episode ${item.Episode}</p>
            </div>
        `;

        slider.appendChild(sliderItem);
    });
}


// Event Listeners
function setupEventListeners() {
    const heroButton = document.querySelector('.hero-button');

    if (heroButton) {
        heroButton.addEventListener('click', () => {
            document.querySelector('.section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        header.classList.toggle("scrolled", window.scrollY > 100);
    });
}


// Slider Navigation
function setupSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector('.slider');
        const prevBtn = container.querySelector('.slider-nav.prev');
        const nextBtn = container.querySelector('.slider-nav.next');

        if (!slider) return;

        let scrollAmount = 0;

        prevBtn.addEventListener("click", () => {
            scrollAmount -= 250;
            slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
        });

        nextBtn.addEventListener("click", () => {
            scrollAmount += 250;
            slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
        });
    });
}


// Search overlay
function initializeSearchOverlay() {
    searchOverlay = document.getElementById('searchOverlay');
    searchInputMain = document.getElementById('searchInputMain');
    searchResultsMain = document.getElementById('searchResultsMain');
    searchResultGrid = document.getElementById('searchResultGrid');
    resultCount = document.getElementById('resultCount');
    searchTrigger = document.querySelector('.search-trigger');
    searchClose = document.getElementById('searchClose');

    if (!searchOverlay) return;

    searchTrigger.addEventListener("click", () => {
        searchOverlay.classList.add("active");
        searchInputMain.focus();
    });

    searchClose.addEventListener("click", closeSearchOverlay);

    searchInputMain.addEventListener("input", e => {
        const query = e.target.value.toLowerCase().trim();
        const results = allEpisodes.filter(ep =>
            ep.Title.toLowerCase().includes(query)
        );
        displaySearchResultsMain(results);
    });
}

function closeSearchOverlay() {
    searchOverlay.classList.remove("active");
}

function displaySearchResultsMain(results) {
    searchResultGrid.innerHTML = "";

    if (results.length === 0) {
        searchResultGrid.innerHTML = `
            <div class="no-results">
                No matching results
            </div>`;
        return;
    }

    results.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("search-result-item-side");

        div.innerHTML = `
            <img src="${item.Thumbnail}" class="result-img-side">
            <div>
                <h3>${item.Title}</h3>
                <p>Episode ${item.Episode}</p>
            </div>
        `;

        div.addEventListener("click", () => {
            window.location.href = `episode.html?ep=${item.Slug}`;
        });

        searchResultGrid.appendChild(div);
    });
}
