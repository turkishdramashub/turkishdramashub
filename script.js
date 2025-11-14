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
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Show loading states
        showLoadingState(trendingSlider);
        showLoadingState(newReleasesSlider);
        showLoadingState(topRatedSlider);
        
        // Load main data for search functionality
        const mainData = await fetchSheetData(SHEET_CONFIG.main);
        allEpisodes = mainData;
        console.log('Main data loaded:', allEpisodes);
        
        // Load section-specific data
        trendingEpisodes = await fetchSheetData(SHEET_CONFIG.trending);
        newReleases = await fetchSheetData(SHEET_CONFIG.newReleases);
        topRated = await fetchSheetData(SHEET_CONFIG.topRated);
        
        console.log('Trending:', trendingEpisodes);
        console.log('New Releases:', newReleases);
        console.log('Top Rated:', topRated);
        
        // Populate sliders
        populateSlider(trendingSlider, trendingEpisodes);
        populateSlider(newReleasesSlider, newReleases);
        populateSlider(topRatedSlider, topRated);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorState(trendingSlider);
        showErrorState(newReleasesSlider);
        showErrorState(topRatedSlider);
        
        // Load sample data for testing
        loadSampleData();
    }
}

// Load sample data if Google Sheets fails
function loadSampleData() {
    console.log('Loading sample data...');
    
    const sampleData = [
        {
            "Title": "Guller ve Gunahlar",
            "Episode": "1",
            "Description": "A beautiful love story with dramatic twists and turns",
            "Thumbnail": "https://via.placeholder.com/120x68/e50914/ffffff?text=Guller+ve+Gunahlar",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "guller-ve-gunahlar-episode-1"
        },
        {
            "Title": "Ertugrul Ghazi",
            "Episode": "5",
            "Description": "The legendary story of Ertugrul Bey and his tribe",
            "Thumbnail": "https://via.placeholder.com/120x68/0066cc/ffffff?text=Ertugrul+Ghazi",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "ertugrul-ghazi-episode-5"
        },
        {
            "Title": "Dirilis Ertugrul",
            "Episode": "10",
            "Description": "Resurrection of Ertugrul and his journey",
            "Thumbnail": "https://via.placeholder.com/120x68/00aa00/ffffff?text=Dirilis+Ertugrul",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "dirilis-ertugrul-episode-10"
        },
        {
            "Title": "Kurulus Osman",
            "Episode": "3",
            "Description": "The establishment of the Ottoman Empire",
            "Thumbnail": "https://via.placeholder.com/120x68/ff6600/ffffff?text=Kurulus+Osman",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "kurulus-osman-episode-3"
        },
        {
            "Title": "Magnificent Century",
            "Episode": "7",
            "Description": "The glorious era of Sultan Suleiman",
            "Thumbnail": "https://via.placeholder.com/120x68/9900cc/ffffff?text=Magnificent+Century",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "magnificent-century-episode-7"
        }
    ];
    
    allEpisodes = sampleData;
    trendingEpisodes = sampleData.slice(0, 3);
    newReleases = sampleData.slice(1, 4);
    topRated = sampleData.slice(2, 5);
    
    // Populate sliders with sample data
    populateSlider(trendingSlider, trendingEpisodes);
    populateSlider(newReleasesSlider, newReleases);
    populateSlider(topRatedSlider, topRated);
}

// Show loading state
function showLoadingState(slider) {
    slider.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>
    `;
}

// Show error state
function showErrorState(slider) {
    slider.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i> Failed to load content
        </div>
    `;
}

// Populate slider with data - NON-CLICKABLE VERSION
function populateSlider(slider, data) {
    console.log('Populating slider with data:', data);
    slider.innerHTML = '';
    
    if (!data || data.length === 0) {
        slider.innerHTML = `
            <div class="no-content">
                <i class="fas fa-film"></i> No content available
            </div>
        `;
        return;
    }
    
    data.forEach(item => {
        const sliderItem = document.createElement('div');
        sliderItem.className = 'slider-item';
        
        sliderItem.innerHTML = `
            <img src="${item.Thumbnail || 'https://via.placeholder.com/250x140/333333/666666?text=No+Image'}" 
                 alt="${item.Title}" 
                 class="slider-img"
                 onerror="this.src='https://via.placeholder.com/250x140/333333/666666?text=No+Image'">
            <div class="slider-content">
                <h3 class="slider-title">${item.Title}</h3>
                <p class="slider-episode">Episode ${item.Episode}</p>
            </div>
        `;
        
        slider.appendChild(sliderItem);
    });
    
    console.log('Slider populated successfully (Display only)');
}

// Setup event listeners
function setupEventListeners() {
    // Hero button click
    const heroButton = document.querySelector('.hero-button');
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            document.querySelector('.section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Setup slider navigation
function setupSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector('.slider');
        const prevBtn = container.querySelector('.slider-nav.prev');
        const nextBtn = container.querySelector('.slider-nav.next');
        
        if (!slider || !prevBtn || !nextBtn) return;
        
        let scrollAmount = 0;
        const scrollStep = 250;
        
        prevBtn.addEventListener('click', function() {
            scrollAmount = Math.max(scrollAmount - scrollStep, 0);
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', function() {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Hide nav buttons if no scroll needed
        setTimeout(() => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            if (maxScroll <= 0) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        }, 1000);
    });
}

// Search Overlay Functionality
function initializeSearchOverlay() {
    searchOverlay = document.getElementById('searchOverlay');
    searchClose = document.getElementById('searchClose');
    searchTrigger = document.querySelector('.search-trigger');
    searchInputMain = document.getElementById('searchInputMain');
    searchResultsMain = document.getElementById('searchResultsMain');
    searchResultGrid = document.getElementById('searchResultGrid');
    resultCount = document.getElementById('resultCount');
    
    if (!searchOverlay || !searchTrigger) {
        console.error('Search elements not found');
        return;
    }

    // Fix browser autofill issue
    if (searchInputMain) {
        searchInputMain.setAttribute('autocomplete', 'off');
        searchInputMain.setAttribute('name', 'search');
        searchInputMain.setAttribute('id', 'search-main-input');
    }

    // Open search overlay
    searchTrigger.addEventListener('click', function() {
        searchOverlay.classList.add('active');
        if (searchInputMain) {
            searchInputMain.focus();
            searchInputMain.value = ''; // Clear any autofill
        }
        document.body.style.overflow = 'hidden';
    });

    // Close search overlay
    if (searchClose) {
        searchClose.addEventListener('click', closeSearchOverlay);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearchOverlay();
        }
    });

    // Search functionality
    if (searchInputMain) {
        searchInputMain.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 1) {
                if (searchResultsMain) searchResultsMain.classList.remove('active');
                return;
            }
            
            const results = allEpisodes.filter(item => 
                item.Title.toLowerCase().includes(query) || 
                (item.Description && item.Description.toLowerCase().includes(query))
            );
            
            displaySearchResultsMain(results);
        });
    }

    // Popular tags search
    document.querySelectorAll('.popular-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.getAttribute('data-search');
            if (searchInputMain) {
                searchInputMain.value = searchTerm;
                searchInputMain.dispatchEvent(new Event('input'));
            }
        });
    });

    // Focus search input when overlay opens
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay && searchInputMain) {
                searchInputMain.focus();
            }
        });
    }
}

function closeSearchOverlay() {
    if (searchOverlay) searchOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (searchInputMain) searchInputMain.value = '';
    if (searchResultsMain) searchResultsMain.classList.remove('active');
}

// Display search results in overlay WITH SIDE LAYOUT
function displaySearchResultsMain(results) {
    if (!searchResultGrid || !resultCount || !searchResultsMain) return;
    
    searchResultGrid.innerHTML = '';
    
    if (results.length === 0) {
        searchResultGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <div>No dramas found matching your search</div>
                <p style="margin-top: 10px; font-size: 0.9rem; opacity: 0.7;">
                    Try searching for "Ertugrul", "Dirilis", or "Kurulus"
                </p>
            </div>
        `;
    } else {
        resultCount.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;
        
        const resultList = document.createElement('div');
        resultList.className = 'search-result-list';
        
        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item-side';
            
            resultItem.innerHTML = `
                <div class="result-thumbnail-side">
                    <img src="${item.Thumbnail || 'https://via.placeholder.com/120x68/333333/ffffff?text=Thumbnail'}" 
                         alt="${item.Title}"
                         class="result-img-side"
                         onerror="this.src='https://via.placeholder.com/120x68/333333/ffffff?text=Thumbnail'">
                    <div class="episode-badge-side">Ep ${item.Episode}</div>
                </div>
                <div class="result-info-side">
                    <div class="result-title-side">${item.Title}</div>
                    <div class="result-episode-side">Episode ${item.Episode}</div>
                    <div class="result-description-side">${item.Description || 'Turkish drama episode'}</div>
                </div>
            `;
            
            resultItem.addEventListener('click', function() {
                window.location.href = `episode.html?ep=${item.Slug}`;
            });
            
            resultList.appendChild(resultItem);
        });
        
        searchResultGrid.appendChild(resultList);
    }
    
    searchResultsMain.classList.add('active');
}

// Make functions globally available for HTML onclick events
window.retryVideo = function() {
    if (typeof retryVideo === 'function') {
        retryVideo();
    }
};