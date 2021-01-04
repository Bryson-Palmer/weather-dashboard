// |--------------------------------Display-Last-Searched-City--------------------------------|


init();

function init() {
    
    // Get search from local storage
    savedCityArray = JSON.parse(localStorage.getItem("cityObject")) || [];
    buildDropDown(savedCityArray);
    
    // Get and display last city search
    let city = savedCityArray.pop();

    if ( savedCityArray.pop() == null ) {

        city = "Rio De Janeiro"
    
        console.log("Initial city: " + city);
    
        // buildDropDown(savedCityArray);
        currentWeatherRequest( city );
        return;

    } else 
        console.log("Last city request: " + city.city);
    
        currentWeatherRequest( city.city );
}


// |--------------------------------Handle-Button-Click-And-Storage--------------------------------|


// Starts the program after the button click
function handleSearch(city) { 

    console.log("Current city request: " + city);
    // Pass the city name into the current weather request
    currentWeatherRequest( city );

    // Get array of previously searched cities out from local storage
    savedCityArray = JSON.parse(localStorage.getItem("cityObject")) || [];

    // Loop over array
    // check for dupliates using the city name
    // Splice out duplicate city name
    for( let i = 0; i < savedCityArray.length; ++i ) {
        if( city == savedCityArray[i].city ) {
            
            savedCityArray.splice(i, 1);
            console.log(savedCityArray);
        }
    }
    
    let cityObject = { city: city };
    savedCityArray.push(cityObject);
    
    // Setting search (city name) to local storage
    localStorage.setItem("cityObject", JSON.stringify(savedCityArray));
    
    buildDropDown(savedCityArray);
}


// |--------------------------------Open-Weather-API-Requests--------------------------------|


// Current weather API request from open weather
function currentWeatherRequest( city ) {

    // Build the URL for the API request
    const APIKey = "f542952a683b86e49e9c9f66edc3747a";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + 
    city + "&appid=" + APIKey;

    // Make the request to the URL with jQuery ajax
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(res) {
       
        console.log("This is the Current Weather request:");
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
        console.log("This is the One Call request:");
        console.log(res);

        // Render uvi to current body card
        renderUvi(uvi);

        // Render five day forecast
        renderFiveDay(res);
    });
}


// |--------------------------------Build-And-Render-Current-Weather--------------------------------|


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
    currentHeaderDiv.addClass("container-fluid d-flex flex-wrap justify-content-start header-box ");

    // Creating element for the city name
    // Adding class
    // Appending to the div
    let city = $("<h2>").text(res.name);
    city.addClass("city-name mr-5");
    currentHeaderDiv.append(city); 

    // Convert unix time to date
    // Create an element for the date
    // Appending to the id
    let date = buildDate(res.dt);
    currentHeaderDiv.append(renderDate(date));

    // Render icon 
    // Appending to the div
    let icon = renderIcon(res.weather[0].icon);
    currentHeaderDiv.append(icon);
    
    // Prependng the currentHeaderDiv of current weather elements to id
    $("#current-weather").prepend(currentHeaderDiv);
}

// Build the current weather body
function buildCurrentBody(res) {

    // Creating body div for the current weather card
    // Adding class
    let currentBodyDiv = $("<div>");
    currentBodyDiv.addClass("container-fluid body-box");

    // Convert temp
    let temp = buildTemp(res.main.temp);
    temp.addClass("currentTemp");
    currentBodyDiv.append(temp);
    
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


// |--------------------------------Loop-And-Create-UV-Index--------------------------------|


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


// |--------------------------------Loop-And-Build-Five-Day-Forecast--------------------------------|


// Build the five day forecast cards
// Create a div to hold each new element of the five day card
// Each card has the date, icon, temp, and humidity
function renderFiveDay (res) {

    // Loop for each card
    for( let i = 1; i <= 5; ++i ) {

        // Create div to hold five day header and body elements
        let fiveDayCard = $("<div>");
        fiveDayCard.addClass("five-day text-white bg-dark p-3");
        
        // Build the date for each day
        let date = buildDate(res.daily[i].dt);
        fiveDayCard.append(renderDate(date));

        // Build the icon for each day
        let icon = renderIcon(res.daily[i].weather[0].icon);
        fiveDayCard.append(icon);
        
        // Convert temp
        let temp = buildTemp(res.daily[i].temp.day);
        temp.addClass("fiveDayTemp");
        fiveDayCard.append(temp);
    
        // Build the humidity
        let humidity = $("<p>").text("Humidity: " + res.daily[i].humidity + "%");
        fiveDayCard.append(humidity);
        
        // Append the five day card to html id
        $("#five-day-card").append(fiveDayCard);
    }
}


// |--------------------------------Build-And-Render-Functions--------------------------------|


// Converting unix timestamp of new date to x/xx/xxxx
function buildDate(newDate) {
    const date = new Date(newDate*1000);
    let [month, day, year] = date.toLocaleDateString("en-US").split("/");
    year -= 2000;
    convertDate = month + "/" + day + "/" + year;
    return convertDate;
}

// Create an element for the date
function renderDate(convertDate) {
    const date = $("<h2>").text(convertDate);
    date.addClass("text-white"); 
    return date;
}

// Create an image element for the icon, build the source url, and set the attribute
function renderIcon(newIcon) {
    const icon = $('<img class="" id="weather-icon" alt="Weather icon" width="150" height="150">');
    const iconUrl = "http://openweathermap.org/img/wn/" + newIcon + "@2x.png";
    icon.attr("src", iconUrl);
    return icon;
}

// Create an element for the temp
function buildTemp(temp) {
    const tempF = ((temp - 273.15) * 1.80 + 32).toFixed(1);
    const temperature = $("<p>").text("Temp: " + tempF + " °F");
    return temperature;
}


// |-------------------------------Build-Drop-Down-And-Handle-Click-------------------------------|


// Function to display previous city searches to drop down menu
function buildDropDown(savedCityArray) {

    // Create a div to hold the drop down meun
    // Add a class
    const dropDown = $('<div id="city-button">');
    dropDown.addClass("list-group");

    for(let i = 0; i < savedCityArray.length; ++i) {

        // Create a new button for each city saved in storage
        // Add a class
        // Append it to the drop down div
        let button = $(`<button type="button" data-city="dropDownCity`+[i]+`" id="dropDownedCity`+[i]+`">`).text(savedCityArray[i].city);
        button.addClass("list-group-item list-group-item-action");
        dropDown.append(button);
        
    }
    // Append drop down to html div @ id
    $("#city-list").append(dropDown);

}


// .on("click") function associated with the drop down Button
$("#city-list").on("click", function(event) {

    // Prevents the page from reloading on form submit.
    event.preventDefault();

    // Get vlue of user's click
    let dropDownCity = event.target.closest("[data-city]");
    if(dropDownCity && dropDownCity.getAttribute("data-city") !== "root") {
        
        // Get the text of the event target
        let cityName = event.target.innerText;

        // Check to see if a number was clicked
        if( !isNaN(cityName)) {
            console.log("Invalid input");
            $("#city-name").addClass("border border-danger text-danger").val("Invalid input");
            // location.reload();
            return;
            
        } else if( $("#city-name").val() == "Invalid input" ) {
            $("#city-name").removeClass("border-danger text-danger").val("");
            // location.reload();
            return;
        } else {
            clear();

            // Start the application processing
            handleSearch(cityName);
        }
    }
        console.log("Error getting city from drop down menu.");
});


// |-------------------------------Search-Button-And-Input-Click-And-Clear---------------------------------|


// Function to empty out the articles
function clear() {
    $("#city-name").val("");
    $("#current-weather").empty();
    $("#five-day-card").empty();
    $("#city-list").empty();
  }

// .on("click") function associated with the Search Button
$("#search-btn").on("click", function(event) {

    // Prevents the page from reloading on form submit.
    event.preventDefault();

    // Get vlue of user's input
    let city = $("#city-name")
    .val()
    .trim()
    .toString();

    // Check to see if input is empty or a number
    if( city == "" || !isNaN($("#city-name").val())) {
        console.log("Invalid input");
        $("#city-name").addClass("border border-danger text-danger").val("Invalid input");
        return;
    
    } else if( $("#city-name").val() == "Invalid input" ) {
        $("#city-name").removeClass("border-danger text-danger").val("");
        // location.reload();
        return;
    
    } else {
        clear();

        // Start the application processing
        handleSearch(city);
    }
    
});

// .on("click") function associated with the input field
$("#city-name").on("click", function(event) {
    $("#city-name").removeClass("border-danger text-danger").val("");
});