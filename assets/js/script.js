
// Starts the program after the button click
function handleSearch() { 

    // THEN get vlue of user's input
    let search = $("#city-name")
    .val()
    .trim();
   
    // Pass the city name into the current weather request
    currentWeatherRequest( search );

}

// Current weather API request from open weather
function currentWeatherRequest( search ) {

    console.log(search);
    // Build the URL for the API request
    const APIKey = "f542952a683b86e49e9c9f66edc3747a";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + 
    search + "&appid=" + APIKey;

    // Make the request to the URL with jQuery ajax
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(res) {
       
        console.log(res);

        // START rendering data to the html
        biuldCurrentWeather(res);
        
        // THEN get the lat and lon out to of the `res` object
        let lat = res.coord.lat;
        let lon = res.coord.lon;

        // Next call `makeOneCallRequest( lat, lon )` and pass in the lat and lon
        oneCallRequest(lat, lon);

    });
}

// One call API request from open weather
function oneCallRequest( lat, lon ) {

    // Build the URL for the API request
    const APIKey = "f542952a683b86e49e9c9f66edc3747a";
    let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + 
    lat + "&lon=" + lon + "&appid=" + APIKey;

    // Make the request to the URL with jQuery ajax
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(res) {
        let uvi = res.current.uvi;
        console.log(res);

        // Render uvi to current body card
        renderUvi(uvi);

        // Render five day forecast
        renderFiveDay(res);
    });

}

// Build current weather card 
function biuldCurrentWeather (res) {

    // Build current weather header
    buildCurrentHeader(res);

    // Build current weather body
    buildCurrentBody(res);    

}

// Build the current weather header
function buildCurrentHeader (res) {

    // Creating header div for the current weather card
    // Adding class
    let currentHeaderDiv = $("<div>");
    currentHeaderDiv.addClass("container-fluid d-inline-flex justify-content-between flex-wrap header-box p-0");
    
    // Creating element for the city name
    // Adding class
    // Appending to the div
    let city = $("<h2>").text(res.name);
    city.addClass("col-6 mt-3 pt-0 pr-0 pb-0 pl-3");
    currentHeaderDiv.append(city); 

    // Convert unix time to date
    // Create an element for the date
    // Appending to the id
    let date = buildDate(res.dt);
    $("#date-display").append(renderDate(date));

    // Render icon 
    // Appending to the div
    let icon = renderIcon(res.weather[0].icon);
    currentHeaderDiv.append(icon);
    
    // Prependng the currentHeaderDiv of current weather elements to id
    $("#current-weather").prepend(currentHeaderDiv);


    // Set city name to local storage

}

// Build the current weather body
function buildCurrentBody(res) {

    // Creating body div for the current weather card
    // Adding class
    let currentBodyDiv = $("<div>");
    currentBodyDiv.addClass("container-fluid body-box");

    // Convert temp
    let temperature = res.main.temp;
    buildTemp(temperature);
    currentBodyDiv.append(temperature);
    
    // Creating element for the humidity
    // Appending to the div
    let humidity = $("<p>").text("Humidity: " + res.main.humidity + "%");
    currentBodyDiv.append(humidity);

    // Creating element for the wind speed
    // Appending to the div
    let wind = $("<p>").text("Wind Sped: " + res.wind.speed + " MPH");
    currentBodyDiv.append(wind);
    
    // Prependng the currentBodyDiv of current weather elements to id
    $("#current-weather").append(currentBodyDiv);

};

// Create UVI element tag
// Add color to the background of the index number
function renderUvi (uvIndex) {
   
    const uviLabel = "UV Index: ";
    
    if( uvIndex >= 0 && uvIndex <= 2 ) {
        $(".body-box").append(
            "<P>" + uviLabel +
            "<span class='col-1 uviLow'>" +
            uvIndex + "</span>" +
            "</P>");

    } else if ( uvIndex >= 3 && uvIndex <= 5 ) {
        $(".body-box").append(
            "<P>" + uviLabel +
            "<span class='col-1 uviModerate'>" +
            uvIndex + "</span>" +
            "</P>");

    } else if ( uvIndex >= 6 && uvIndex <= 7 ) {
        $(".body-box").append(
            "<P>" + uviLabel +
            "<span class='col-1 uviHigh'>" +
            uvIndex + "</span>" +
            "</P>");

    } else 
        $(".body-box").append(
            "<P>" + uviLabel +
            "<span class='col-1 uviVeryHigh'>" +
            uvIndex + "</span>" +
            "</P>");
    
}

// Build the five day forecast cards
// Create a div to hold each new element of the five day card
// Each card has the date, icon, temp, and humidity
function renderFiveDay (res) {

    // Loop for each card
    for( let i = 1; i <= 5; ++i ){
        // Create div to hold elements
        let fiveDayCard = $("<div>");
        fiveDayCard.addClass("five-day d-flex flex-column text-white bg-dark col-11 m-3 pt-3 pb-3");
        
        // Build the date for each day
        let date = buildDate(res.daily[i].dt);
        fiveDayCard.append(renderDate(date));

        // Build the icon for each day
        let icon = renderIcon(res.daily[i].weather[0].icon);
        fiveDayCard.append(icon);

        // Convert temp
        let temperature = res.daily[i].temp.day;
        buildTemp(temperature);
        fiveDayCard.append(temperature);
    
        // Creating element for the humidity
        // Appending to the div
        let humidity = $("<p>").text("Humidity: " + res.daily[i].humidity + "%");
        fiveDayCard.append(humidity);

        // Append the html div with newly created div of elements
        $("#five-day-card").append(fiveDayCard);
    }
}

// Converting unix timestamp of new date to x/xx/xxxx
function buildDate(newDate) {
    let date = new Date(newDate*1000);
    let [month, day, year] = date.toLocaleDateString("en-US").split("/");
    year -= 2000;
    convertDate = month + "/" + day + "/" + year;
    return convertDate;
}

// Create an element for the date
function renderDate(convertDate) {
    let date = $("<h3>").text(convertDate);
    date.addClass("text-white mb-3"); 
    return date;
}

// Create an image element for the icon, build the source url, and set the attribute
function renderIcon(newIcon) {
    let icon = $('<img class="p-0" id="weather-icon" alt="Weather icon" width="150" height="150">');
    let iconUrl = "http://openweathermap.org/img/wn/" + newIcon + "@2x.png";
    icon.attr("src", iconUrl);
    console.log(newIcon);
    return icon;
}

function buildTemp(temp) {
    const tempF = ((temp - 273.15) * 1.80 + 32).toFixed();
    let temperature = $("<p>").text("Temperature: " + tempF + "°F");
    return temperature;
}

// Function to empty out the articles
function clear() {
    $("#city-name").empty();
    $("#current-header").empty();
    $("#date-display").empty();
  }

// .on("click") function associated with the Search Button
$("#search-btn").on("click", function(event) {

    // Prevents the page from reloading on form submit.
    event.preventDefault();
    
    // Empty the search field
    clear();
    
    // Start the application processing
    handleSearch();

});