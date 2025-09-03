const userTab = document.querySelector ("[data-userWeather]");
const searchTab = document.querySelector ("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector ("[data-searchForm]");
const loadingScreen = document.querySelector (".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let currentTab = userTab ;
// api key 
const API_KEY = "28f470a31433fe2dfbea9bb088ed0f4e";
currentTab.classList.add("current-tab");


// ek kaam pending hai 
function swtichTab (clickedTab){
    // agar usi tab par ho or wahi clicked hua to 
    if (clickedTab !== currentTab){
        // current tab se uska color hata do 
        currentTab.classList.remove ("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add ("current-tab");

    if (!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");

    }
    else {
        // mein pehle search wale tab par tha to mujhe ab your weather par click karo 
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage ();
    }
    }
}

function getfromSessionStorage (){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse (localCoordinates);
        fetchUserWeatherInfo (coordinates)
    }
}


// function to switch the tab
userTab.addEventListener ('click', ()=> {

    swtichTab (userTab)
})

searchTab.addEventListener ('click', ()=> {
    
    swtichTab (searchTab)
})

async function fetchUserWeatherInfo (coordinates){
    const {lat , lon} = coordinates;
    // grant location is invisible 
    grantAccessContainer.classList.remove ("active");
    // make loader visible
    loadingScreen.classList.add("active")

    // api call kar do 
    try {
        const res =  await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
        // convert the data into json file 
        const data = await res.json();
        // loader ko hata do 
        loadingScreen.classList.remove("active");
        // user info dikha do 
        userInfoContainer.classList.add("active");
        // render the informations
       
        renderWeatherInfo (data);

    } catch (error) {
        loadingScreen.classList.remove("active");
       
        // kya karoge hw
    }

}

function renderWeatherInfo (data){
    // firstly find all the element 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector ("[data-countryIcon]");
    const desc = document.querySelector ("[data-weatherDesc]");
    const weatherIcon = document.querySelector ("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temperature]");
    const windSpeed = document.querySelector ("[data-windSpeed]");
    const humidity = document.querySelector ("[data-humidity]");
    const cloudiness = document.querySelector ("[data-cloudiness]");


    // fetch values from data
    cityName.innerText = data?.name ;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${data?.main?.temp} °C` ;
    windSpeed.innerText = `${data?.wind?.speed} m/s` ;
    humidity.innerText = `${data?.main?.humidity} %`;
    cloudiness.innerText = `${data?.clouds?.all} %`;
}

// grant access wala button 
const grantAccessButton = document.querySelector("[data-grantAccess]");

function getlocation (){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition (showPosition);
    }
    else {
        // alert show karo hw 
    }
}

function showPosition (position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo (userCoordinates);

}

grantAccessButton.addEventListener ('click',getlocation);

const searchInput = document.querySelector ("[data-searchInput]");

searchForm.addEventListener ("submit", (e)=> {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === ""){
        return ;
    }
    else {
        fetchSearchWeatherUSerInfo (cityName);
    }
})

async function fetchSearchWeatherUSerInfo(city) {
    loadingScreen.classList.add ("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
         const res =  await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add ("active");
        renderWeatherInfo(data);
    } catch (error) {
        // hw how to handle 
    }
}