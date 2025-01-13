async function fetchRecommendations() {
    const response = await fetch('travel_recommendation_api.json');
    const data = await response.json();
    return data;
}


function resetSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('recommendations').innerHTML = '';
}

// Function to get the current time for a specific timezone
function getTimeForTimeZone(timeZone) {
    const options = {
        timeZone: timeZone,
        hour12: true, // 12-hour format
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    const currentTime = new Date().toLocaleTimeString('en-US', options);
    return currentTime;
}

// Function to display recommendations with time
async function executeSearch() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const recommendations = await fetchRecommendations();
    const results = [];

    if (keyword.includes('beach')) {
        results.push(...recommendations.beaches);
    } else if (keyword.includes('temple')) {
        results.push(...recommendations.temples);
    } else {
        recommendations.countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
                results.push(...country.cities);
            }
        });
    }

    displayRecommendationsWithTime(results);
}

// Function to display recommendations along with the time
function displayRecommendationsWithTime(results) {
    const container = document.getElementById('recommendations');
    container.innerHTML = results.map(result => {
        // Set the timezone based on the city's country
        const timeZoneMap = {
            "Sydney, Australia": "Australia/Sydney",
            "Melbourne, Australia": "Australia/Melbourne",
            "Tokyo, Japan": "Asia/Tokyo",
            "Kyoto, Japan": "Asia/Tokyo",
            "Rio de Janeiro, Brazil": "America/Sao_Paulo",
            "São Paulo, Brazil": "America/Sao_Paulo",
        };

        const timeZone = timeZoneMap[result.name] || "UTC"; // Default to UTC if no mapping
        const currentTime = getTimeForTimeZone(timeZone);

        return `
            <div class="card">
                <img src="${result.imageUrl}" alt="${result.name}">
                <h3>${result.name}</h3>
                <p>${result.description}</p>
                <p><strong>Current Time:</strong> ${currentTime}</p>
            </div>
        `;
    }).join('');
}
