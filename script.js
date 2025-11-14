// ---------------------- FINAL CLEAN WORKING script.js ----------------------

// Global data storage
let allEpisodes = [];
let trendingEpisodes = [];
let newReleases = [];
let topRated = [];

// DOM elements
const trendingSlider = document.getElementById("trending-slider");
const newReleasesSlider = document.getElementById("new-releases-slider");
const topRatedSlider = document.getElementById("top-rated-slider");

// Search Overlay Elements
let searchOverlay, searchClose, searchTrigger, searchInputMain, searchResultsMain, searchResultGrid, resultCount;

// Initialize App
document.addEventListener("DOMContentLoaded", function () {
    console.log("Website loaded...");
    setupEventListeners();   // <-- restored
    setupSliders();
    initializeSearchOverlay();
    loadAllData();
});

// ---------------------- Fetch from YOUR Google Script API ----------------------
async function fetchSheetData(sheetName) {
    try {
        const url = `${API_BASE}?sheet=${encodeURIComponent(sheetName)}`;
        console.log("Fetching:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("API Failed");

        const json = await response.json();

        if (json.data && Array.isArray(json.data)) return json.data;
        if (Array.isArray(json)) return json;

        return [];
    } catch (err) {
        console.error("Fetch error:", err);
        return [];
    }
}

// ---------------------- Load Everything ----------------------
async function loadAllData() {
    try {
        if (trendingSlider) showLoadingState(trendingSlider);
        if (newReleasesSlider) showLoadingState(newReleasesSlider);
        if (topRatedSlider) showLoadingState(topRatedSlider);

        allEpisodes = await fetchSheetData(SHEET_CONFIG.main);
        trendingEpisodes = await fetchSheetData(SHEET_CONFIG.trending);
        newReleases = await fetchSheetData(SHEET_CONFIG.newReleases);
        topRated = await fetchSheetData(SHEET_CONFIG.topRated);

        // Fallbacks
        if (!trendingEpisodes || !trendingEpisodes.length) trendingEpisodes = allEpisodes.slice(0, 10);
        if (!newReleases || !newReleases.length) newReleases = allEpisodes.slice(0, 10);
        if (!topRated || !topRated.length) topRated = allEpisodes.slice(0, 10);

        // Populate sliders (check element exists)
        if (trendingSlider) populateSlider(trendingSlider, trendingEpisodes);
        if (newReleasesSlider) populateSlider(newReleasesSlider, newReleases);
        if (topRatedSlider) populateSlider(topRatedSlider, topRated);

    } catch (error) {
        console.error("Load error:", error);
        if (trendingSlider) showErrorState(trendingSlider);
        if (newReleasesSlider) showErrorState(newReleasesSlider);
        if (topRatedSlider) showErrorState(topRatedSlider);
    }
}

// ---------------------- UI Helpers ----------------------
function showLoadingState(slider) {
    slider.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>`;
}

function showErrorState(slider) {
    slider.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i> Failed to load content
        </div>`;
}

// ---------------------- UPDATED populateSlider() WITH RATING ----------------------
function populateSlider(slider, data) {
    slider.innerHTML = "";

    if (!data || !data.length) {
        slider.innerHTML = `<div class="no-content">
            <i class="fas fa-film"></i> No content available
        </div>`;
        return;
    }

    data.forEach((item) => {
        const thumb = item.Thumbnail && item.Thumbnail.length
            ? item.Thumbnail
            : "https://via.placeholder.com/250x140/333333/666666?text=No+Image";

        // Use rating if provided, else N/A
        const rating = item.Rating ? item.Rating : "N/A";

        const div = document.createElement("div");
        div.className = "slider-item";

        div.innerHTML = `
            <img src="${thumb}" class="slider-img"
                onerror="this.src='https://via.placeholder.com/250x140/333333/666666?text=No+Image'">

            <div class="slider-content">
                <h3 class="slider-title">${item.Title || "Untitled"}</h3>
                <p class="slider-episode">⭐ Rating: ${rating}</p>
            </div>
        `;

        // NOT CLICKABLE — recommended only
        div.style.pointerEvents = "none";

        slider.appendChild(div);
    });
}

// ---------------------- Hero + Header Scroll (restored) ----------------------
function setupEventListeners() {
    const heroButton = document.querySelector(".hero-button");
    if (heroButton) {
        heroButton.addEventListener("click", () =>
            document.querySelector(".section").scrollIntoView({ behavior: "smooth" })
        );
    }

    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 100);
    });
}

// ---------------------- Slider setup (single clean function) ----------------------
function setupSliders() {
    document.querySelectorAll(".slider-container").forEach((container) => {
        const slider = container.querySelector(".slider");
        if (!slider) return;

        // Always show arrows but disable everything (UI only)
        const navButtons = container.querySelectorAll(".slider-nav");
        if (navButtons.length) {
            navButtons.forEach(btn => {
                btn.style.display = "flex";     // ALWAYS visible
                btn.style.pointerEvents = "none"; // COMPLETELY disabled (no click)
                btn.style.opacity = "1";          // fully visible
            });
        }

        // Enable swipe scroll only
        slider.style.overflowX = "auto";
        slider.style.overflowY = "hidden";
        slider.style.scrollBehavior = "smooth";
        slider.style.webkitOverflowScrolling = "touch";
    });
}

// ---------------------- Search Overlay ----------------------
function initializeSearchOverlay() {
    searchOverlay = document.getElementById("searchOverlay");
    searchClose = document.getElementById("searchClose");
    searchTrigger = document.querySelector(".search-trigger");
    searchInputMain = document.getElementById("searchInputMain");
    searchResultsMain = document.getElementById("searchResultsMain");
    searchResultGrid = document.getElementById("searchResultGrid");
    resultCount = document.getElementById("resultCount");

    if (!searchTrigger || !searchInputMain || !searchClose) return;

    searchTrigger.addEventListener("click", () => {
        if (!searchOverlay) return;
        searchOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        searchInputMain.value = "";
        searchInputMain.focus();
    });

    searchClose.addEventListener("click", closeSearch);

    searchInputMain.addEventListener("input", () => {
        const q = searchInputMain.value.toLowerCase().trim();
        if (!q) {
            if (searchResultsMain) searchResultsMain.classList.remove("active");
            return;
        }

        const results = allEpisodes.filter(
            (ep) =>
                (ep.Title && ep.Title.toLowerCase().includes(q)) ||
                (ep.Description && ep.Description.toLowerCase().includes(q))
        );

        displaySearchResults(results);
    });
}

function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

function displaySearchResults(results) {
    if (!searchResultGrid || !searchResultsMain || !resultCount) return;

    searchResultGrid.innerHTML = "";

    if (!results || !results.length) {
        searchResultGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>No dramas found
            </div>`;
        resultCount.textContent = "";
        return;
    }

    resultCount.textContent = `Found ${results.length} results`;

    const list = document.createElement("div");
    list.className = "search-result-list";

    results.forEach((item) => {
        const div = document.createElement("div");
        div.className = "search-result-item-side";

        div.innerHTML = `
            <div class="result-thumbnail-side">
                <img src="${item.Thumbnail || ''}" class="result-img-side" onerror="this.src='https://via.placeholder.com/120x68/333333/666666?text=No+Image'">
                <div class="episode-badge-side">Ep ${item.Episode || '-'}</div>
            </div>
            <div class="result-info-side">
                <div class="result-title-side">${item.Title || 'Untitled'}</div>
                <div class="result-episode-side">Episode ${item.Episode || '-'}</div>
                <div class="result-description-side">${item.Description || ''}</div>
            </div>
        `;

        div.addEventListener("click", () => {
            if (item.Slug) window.location.href = `episode.html?ep=${item.Slug}`;
        });

        list.appendChild(div);
    });

    searchResultGrid.appendChild(list);
    searchResultsMain.classList.add("active");
    }
