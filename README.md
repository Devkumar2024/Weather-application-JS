<img width="1246" height="372" alt="image" src="https://github.com/user-attachments/assets/a345737a-1631-4814-8bb5-638db015c070" />
# 🌤️ Weather Application

A simple weather application built with HTML, CSS, and JavaScript using the OpenWeatherMap API.

The application allows users to search for weather information by city or use their current location to view local weather conditions.

## ✨ Features

- 🔍 **Search Weather by City**
  - Search for weather information using any city name.
  - Handles invalid or unavailable city searches.

- 📍 **Current Location Weather**
  - Uses the browser's Geolocation API to get the user's current coordinates.
  - Displays weather information based on the user's location.

- 🌡️ **Current Temperature**
  - Displays the current temperature in Celsius.

- 🌤️ **Weather Condition**
  - Shows the current weather description.
  - Displays a weather icon based on the current condition.

- 💨 **Wind Speed**
  - Displays current wind speed in meters per second.

- 💧 **Humidity**
  - Displays the current humidity percentage.

- ☁️ **Cloudiness**
  - Displays the current cloud coverage percentage.

- 💾 **Session Storage**
  - Saves the user's coordinates in `sessionStorage` so the location can be reused during the session.

- ⏳ **Loading State**
  - Displays a loading screen while weather data is being fetched.

- ❌ **Error Handling**
  - Shows a "City not found" message for invalid city searches.
  - Handles weather API and geolocation errors.

- 📱 **Responsive Design**
  - Basic responsive layout for smaller screens.

- 🌐 **Favicon**
  - Includes a custom weather favicon for the browser tab.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- OpenWeatherMap API
- Browser Geolocation API
- Session Storage

## 📂 Project Structure

```text
Weather-App/
│
├── index.html
├── style.css
├── script.js
│
└── assets/
    ├── search.png
    ├── location.png
    ├── loading.gif
    ├── not-found.png
    ├── wind.png
    ├── humidity.png
    ├── cloud.png
    └── load.ico
