const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const grantAccessContainer = document.querySelector(
  ".grant-location-container",
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const notFoundContainer = document.querySelector(".not-found-container");
const userInfoContainer = document.querySelector(".user-info-container");

const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");

const API_KEY = "ffd19ebe29088155f824f5a98977f50e";

let currentTab = userTab;
currentTab.classList.add("current-tab");

/* ---------- init ---------- */
getFromSessionStorage();

/* ---------- tab events ---------- */
userTab.addEventListener("click", () => switchTab(userTab));
searchTab.addEventListener("click", () => switchTab(searchTab));

function switchTab(clickedTab) {
  if (clickedTab === currentTab) return;

  currentTab.classList.remove("current-tab");
  currentTab = clickedTab;
  currentTab.classList.add("current-tab");

  if (!searchForm.classList.contains("active")) {
    // Your Weather → Search Weather
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFoundContainer.classList.remove("active");
    searchForm.classList.add("active");
  } else {
    // Search Weather → Your Weather
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    notFoundContainer.classList.remove("active");
    getFromSessionStorage();
  }
}

/* ---------- session storage ---------- */
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

/* ---------- fetch: user (coords) ---------- */
async function fetchUserWeatherInfo(coordinates) {
  const { latitude, longitude } = coordinates;

  grantAccessContainer.classList.remove("active");
  notFoundContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    console.error(error);
    loadingScreen.classList.remove("active");
    notFoundContainer.classList.add("active");
  }
}

/* ---------- render ---------- */
function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.innerText = weatherInfo?.name ?? "";
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description ?? "";
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp ?? "--"} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed ?? "--"} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity ?? "--"} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all ?? "--"} %`;
}

/* ---------- geolocation ---------- */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("No Geolocation Support");
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

grantAccessButton.addEventListener("click", getLocation);

/* ---------- search ---------- */
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityName = searchInput.value.trim();

  if (cityName === "") return;

  fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  notFoundContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`,
    );

    // 404 check MUST come before response.json()
    if (response.status === 404) {
      loadingScreen.classList.remove("active");
      notFoundContainer.classList.add("active");
      return;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    console.error(error);
    loadingScreen.classList.remove("active");
    notFoundContainer.classList.add("active");
  }
}
