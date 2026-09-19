const API_key = "ffd19ebe29088155f824f5a98977f50e";

async function fetchWeatherdDtails() {
  let latitude = 15.333;
  let longitude = 74.0833;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_key}`,
    );
    const data = await response.json();

    // console.log("Weather data ::", data);
    // let newPara = document.createElement("p");
    // newPara.textContent = `Temperature: ${data.main.temp} °C`;
    // document.body.appendChild(newPara);

    // show weather deatils on UI after fetching it
    renderWeatherDeatils();


  } catch (error) {
    console.log("Error happened", error);
  }
}
