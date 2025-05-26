// API 키 저장
function saveApiKeys() {
    const openaiKey = document.getElementById('openai-api-key').value;
    const youtubeKey = document.getElementById('youtube-api-key').value;
    
    if (openaiKey) {
        localStorage.setItem('openaiApiKey', openaiKey);
    }
    if (youtubeKey) {
        localStorage.setItem('youtubeApiKey', youtubeKey);
    }
    
    showToast('API 키가 저장되었습니다.');
}

// YouTube 검색
async function searchYouTube(query) {
    try {
        const response = await fetch('/api/youtube/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error('YouTube 검색 요청 실패');
        }

        const data = await response.json();
        return data.videos;
    } catch (error) {
        console.error('YouTube 검색 중 오류 발생:', error);
        showToast('YouTube 검색 중 오류가 발생했습니다.', 'error');
        return [];
    }
}

// YouTube 검색 실행
async function executeYouTubeSearch() {
    const searchInput = document.getElementById('youtube-search-input');
    const query = searchInput.value.trim();
    
    if (!query) {
        showToast('검색어를 입력해주세요.', 'error');
        return;
    }

    const resultsContainer = document.getElementById('youtube-results');
    resultsContainer.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

    const videos = await searchYouTube(query);
    
    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p class="text-gray-500 text-center">검색 결과가 없습니다.</p>';
        return;
    }

    resultsContainer.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-channel">${video.channelTitle}</p>
                <p class="video-date">${video.publishedAt}</p>
                <p class="video-description">${video.description}</p>
                <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" class="watch-button">보러가기</a>
            </div>
        </div>
    `).join('');
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // API 키 입력 필드에 저장된 값 불러오기
    const openaiKey = localStorage.getItem('openaiApiKey');
    const youtubeKey = localStorage.getItem('youtubeApiKey');
    if (openaiKey) document.getElementById('openai-api-key').value = openaiKey;
    if (youtubeKey) document.getElementById('youtube-api-key').value = youtubeKey;
    
    // YouTube 검색 버튼 이벤트 리스너
    const searchButton = document.getElementById('youtube-search-button');
    if (searchButton) {
        searchButton.addEventListener('click', executeYouTubeSearch);
    }
    
    // YouTube 검색 입력 필드 엔터 키 이벤트
    const searchInput = document.getElementById('youtube-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeYouTubeSearch();
            }
        });
    }
});
// ... existing code ... 