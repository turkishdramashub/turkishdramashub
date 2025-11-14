// Google Sheets Configuration
const SHEET_CONFIG = {
    main: '1tkakAMHvhs8w1zkXpyI9X7h8dx9UW3vyZb2hNBK-fyc',
    trending: '1up1ajCi9O9dda3-MlDubihGkJhGdQiwib5myWYCYZH0',
    newReleases: '1FkyMtD1AQ2gLvm_4kRpOIwtkCfIVGWIcjNJggcmQaj8',
    topRated: '18RQz0hqcbBHIdSqC2mNl5bplHqzMjE-K1p_nYKrkPjo'
};

// Fetch data from Google Sheets with better error handling
async function fetchSheetData(sheetId) {
    try {
        console.log('Fetching data from sheet:', sheetId);
        const response = await fetch(`https://opensheet.elk.sh/${sheetId}/Sheet1`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        
        // Return sample data for testing
        return getSampleData();
    }
}

// Sample data for testing
function getSampleData() {
    return [
        {
            "Title": "Guller ve Gunahlar",
            "Episode": "1",
            "Description": "A beautiful love story with dramatic twists",
            "Thumbnail": "https://via.placeholder.com/250x140/333333/666666?text=Guller+ve+Gunahlar",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "guller-ve-gunahlar-episode-1"
        },
        {
            "Title": "Ertugrul Ghazi",
            "Episode": "5",
            "Description": "The legendary story of Ertugrul Bey",
            "Thumbnail": "https://via.placeholder.com/250x140/333333/666666?text=Ertugrul+Ghazi",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "ertugrul-ghazi-episode-5"
        },
        {
            "Title": "Dirilis Ertugrul",
            "Episode": "10",
            "Description": "Resurrection of Ertugrul and his tribe",
            "Thumbnail": "https://via.placeholder.com/250x140/333333/666666?text=Dirilis+Ertugrul",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "dirilis-ertugrul-episode-10"
        },
        {
            "Title": "Kurulus Osman",
            "Episode": "3",
            "Description": "The establishment of the Ottoman Empire",
            "Thumbnail": "https://via.placeholder.com/250x140/333333/666666?text=Kurulus+Osman",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "kurulus-osman-episode-3"
        },
        {
            "Title": "Magnificent Century",
            "Episode": "7",
            "Description": "The glorious era of Sultan Suleiman",
            "Thumbnail": "https://via.placeholder.com/250x140/333333/666666?text=Magnificent+Century",
            "StreamLink": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            "DownloadLink": "#",
            "Slug": "magnificent-century-episode-7"
        }
    ];
}