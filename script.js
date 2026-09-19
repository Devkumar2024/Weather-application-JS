const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessConatiner = document.querySelector(
  ".grant-location-container",
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-conatainer");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_key = "ffd19ebe29088155f824f5a98977f50e";
// css ppts of current tab
currentTab.classList.add("current-tab");
getFromSessionStorage();

userTab.addEventListener("click", () => {
  // pass clicked tab as i/p parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // pass clicked tab as i/p parameter
  switchTab(searchTab);
});

function switchTab(clickedTab) {
  if (clickedTab !== currentTab) {
    // tab bg color remove
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    // mai konse tab pe khada huu??
    if (!searchForm.classList.contains("active")) {
      // Switch from User Weather -> Search Weather
      userInfoContainer.classList.remove("active");
      grantAccessConatiner.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // Switch from Search Weather -> User Weather
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");

      // localstorage se weather aayga on which coordinates you are right now on
      getFromSessionStorage();
    }
  }
}

// check if coordinates are already present in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  // if local coordinates nhi mile
  if (!localCoordinates) {
    grantAccessConatiner.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

//// async means in below function there is stuff that will take time to return, till then run rest code in background, whereas in promise 1st data will resolve then, then(response) wala block chalega
async function fetchUserWeatherInfo(coordinates) {
  const { latitude, longitude } = coordinates;
  // make grant container invisible
  grantAccessConatiner.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_key}`,
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");

    // render and putin data on UI
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  /// firstly we have to fetch the element
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  // fetch values from weather info project and put in UI
  // optional chaining (?.) agar json mei ppt exist karti hai to andar chale jao, or else return undefined
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp;
  windSpeed.innerText = weatherInfo?.wind?.speed;
  humidity.innerText = weatherInfo?.main?.humidity;
  cloudiness.innerText = weatherInfo?.clouds?.all;
}

// Browswr geolocation API
function getLocation() {
  // does geoloaction feature is in support ?
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert(`No GeoLocation Support`);
  }
}

function showPosition(position) {
  const userCoordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const serachInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (event) => {
  // prevent default method, built in method
  event.preventDefault();
  let cityName = serachInput.value;
  if (cityName === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessConatiner.classList.remove("active");

  try {
    const response = await fetch(                        
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_key}`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
  }
}
