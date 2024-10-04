let links = document.querySelectorAll("#navbar .nav-link");
let navLinks=document.querySelectorAll("#navbarTogglerDemo02 .nav-link");
let mainNav = document.querySelector("#main-nav");
let mainNavCollapse = document.getElementById("navbarNav");
let innerNavCollapse = document.getElementById("navbarTogglerDemo02");
links.forEach((link) => {
   link.addEventListener('click', () => {
       links.forEach((l) => l.classList.remove("active"));
       link.classList.add("active");
      if (mainNavCollapse.classList.contains('show')) {
            mainNavCollapse.classList.remove('show'); // Hide the navbar
            const togglerButton = document.getElementById('main-toggler');
            togglerButton.setAttribute('aria-expanded', 'false');
            togglerButton.classList.remove('collapsed');
        }

   });
});

let searchInput = document.getElementById("searchInput");
let submitSearch = document.getElementById("submitSearch");
let searchLocation;
let mainContainer = document.getElementById('main-section');

// Default weather on page load
$(document).ready(() => {
    getWeather('cairo');
    searchInput.value = "";
});

// On search button click
submitSearch.addEventListener('click', () => {
    searchLocation = searchInput.value;
    if (searchLocation) {
        getWeather(searchLocation); 
        searchInput.value = "";
    } else {
        alert("Please enter a location");
    }
});

// Fetch weather data
async function getWeather(searchLocation) {
    try {
        let request = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7a4c450b704c416d93a172557242109&q=${searchLocation}&days=3&aqi=no&alerts=no`);
        let response = await request.json();
        displayWeather(response);
        displayWheaterNext(response);
        console.log(response);
    } catch (error) {
        document.getElementById("searchError").classList.remove("d-none");
        document.getElementById("searchError").innerHTML ="Error fetching weather data: Retry enter location."
        console.error(error)
    }
}

// Format day of the week
function formatDateDay(fullDate) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(fullDate);
    let day = weekday[date.getDay()];
    return day; 
}

// Format month and day
function formatDateMonth(fullDate) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(fullDate);
    let monthName = month[date.getMonth()];
    let monthDay = date.getDate();
    return monthDay + " " + monthName;
}
// Function to format time from 24-hour to 12-hour format
function formatTime12Hour(fullDate) {
    const date = new Date(fullDate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; 
    let timeStr = hours + ':' + minutes + ' ' + ampm;
    return timeStr;
}

// Display current weather
function displayWeather(response) {
    let localtime = response.location.localtime;
    let cartoona = ''; 

    cartoona += `
    <div class="col-md-4 card text-white bg-mainColor rounded-0 border-1 border-color mb-3">
        <div class="card-header d-flex justify-content-between">
            <p id="weather-day">${formatDateDay(localtime)}</p>
            <p id="weather-month">${formatDateMonth(localtime)}</p>
        </div>
        <div class="card-body">
             <h4 id="local-time">${formatTime12Hour(localtime)}</h4>
            <h4 class="card-title">${response.location.name}</h4>
            <div class=" d-flex justify-content-between align-item-center">
                <h5>${response.current.condition.text}</h5>
                <img src="https:${response.current.condition.icon}" alt="Weather Icon" />
            </div>
            <p class="card-text">Temperature: ${response.current.temp_c} °C</p>
            <p class="card-text">Humidity: ${response.current.humidity}%</p>
        </div>
    </div>`;

    mainContainer.innerHTML = cartoona; 
}

// Display weather forecast for next days
function displayWheaterNext(response) {
    let weatherNextContainer = ``;
    for (let i = 1; i < response.forecast.forecastday.length; i++) { // start from 1 to skip the current day
        weatherNextContainer += `
        <div class="col-md-4 card text-white bg-mainColor rounded-0 border-1 border-color mb-3">
            <div class="card-header d-flex justify-content-between">
                <p id="weather-day">${formatDateDay(response.forecast.forecastday[i].date)}</p>
                <p id="weather-month">${formatDateMonth(response.forecast.forecastday[i].date)}</p>
            </div>
            <div class="card-body mx-auto text-center">
            <img src="https:${response.forecast.forecastday[i].day.condition.icon}" alt="Weather Icon" />
                <h5>${response.forecast.forecastday[i].day.condition.text}</h5>  
                <p class="card-text">Max Temp: ${response.forecast.forecastday[i].day.maxtemp_c} °C</p>
                <p class="card-text">Min Temp: ${response.forecast.forecastday[i].day.mintemp_c} °C</p>
            </div>
        </div>
        `;
    }

    mainContainer.innerHTML += weatherNextContainer; 
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
///    News
async function getNews() {
    try {
        
        let request = await fetch('https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=99bc0e96ad964deba789f10415646406');
        let response = await request.json();

        if (response.articles && response.articles.length > 0) {
            displayNews(response.articles);
        } else {
            console.error('No articles found:', response.message);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}



function getyear(date){
    const d = new Date(date);
  return  d.getFullYear();   
}
function displayNews(articles) {
    
    let newsContent = ``;
    for (let i = 1; i < articles.length; i++) {
        newsContent += `
        <div class="col-md-3 rounded-0 mb-2 border-1 card bg-mainColor border-color text-white">
           <div class=" position-relative">
            <img 
                style="height:200px;" 
                class="card-img-top w-100" 
                src="${articles[i].urlToImage ? articles[i].urlToImage : '../images/image-not-found.png'}" 
                alt="Card image cap"
                onerror="this.src='../images/image-not-found.png';"
            />

            <p class="text-title card-title"> ${articles[i].source.name?.split(" ").slice(0,2).join(" ")} </p>
           </div>
            <div class="card-body mt-2">
             <p class="d-inline-block ">${formatDateMonth(articles[i].publishedAt.split('T')[0])} <p class="d-inline-block ms-1 "> ${getyear(articles[i].publishedAt.split('T')[0])}</p></p>
             <p class="fs-5 fw-bold">${articles[i].title?.split(" ").slice(0,8).join(" ")}</p>
             <div>
               <p>${articles[i].content?.split(" ").slice(0,15).join(" ")}</p>
               <p>By  ${articles[i].author ? articles[i].author.split(" ").slice(0,3).join(" ") : 'Unknown'} </p>
            </div>
            </div>
            <div class="card-footer">
            <a href="${articles[i].url}" target="_blank" class="text-danger fw-bold">Show More</a>
            </div>
        </div>
        `;
    }
    mainContainer.innerHTML = newsContent;
}

document.getElementById("newsTab").addEventListener("click", () => {
    document.getElementById("searchSection").classList.add("d-none");
    document.getElementById("navbarSection").classList.remove("d-none");
    mainContainer.innerHTML = ""; 
    getNews(); 
});

document.getElementById("weatherTab").addEventListener("click", () => {
    document.getElementById("navbarSection").classList.add("d-none");
    document.getElementById("searchSection").classList.remove("d-none");
    mainContainer.innerHTML = ""; 
    getWeather(searchLocation || 'Cairo'); 
});

function setActiveLink(index) {
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[index].classList.add('active');
}
const innerTogglerButton = document.getElementById('inner-toggler');

navLinks.forEach((link, index) => {
    link.addEventListener('click', async () => {
        setActiveLink(index); 
        await getCategoryDate(index); 
        if (innerNavCollapse.classList.contains('show')) {
            innerNavCollapse.classList.remove('show'); // Hide the navbar
            innerTogglerButton.setAttribute('aria-expanded', 'false');
            innerTogglerButton.classList.remove('collapsed');
        }
    });
});

async function getCategoryDate(index) {
    setActiveLink(index);  
    let category = navLinks[index].getAttribute('data-category');  
    await getNewsCategory(category);  
}


async function getNewsCategory(category) {
    try {
        let request = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=99bc0e96ad964deba789f10415646406`);
        let response = await request.json();

        // Log the entire response for debugging
        console.log('API Response:', response);

        // Check if the articles array exists and has content
        if (response.articles && response.articles.length > 0) {
            displayNews(response.articles);  // Pass articles array to displayNews
            console.log(category)
        } else {
            console.error('No articles found or response malformed:', response);
            console.log(category)
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        console.log(category)
    }
}
