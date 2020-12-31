// WHEN the user clicks the search button

function handleSearch() { 

    // THEN get vlue of user's input
    let search = $("#city-name")
    .val()
    .trim();

    currentWeatherRequest( search );

}


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
        renderPhaseOne(res);
        
        // THEN get the lat and lon out to of the `res` object
        let lat = res.coord.lat;
        let lon = res.coord.lon;

        // Next call `makeOneCallRequest( lat, lon )` and pass in the lat and lon
        oneCallRequest(lat, lon);

    });
}

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
        console.log(res);
        

        // Finish rendering data to the html
        // renderPhaseTwo(res);
    });

}

function renderPhaseOne (res) {

    // Create the  list group to contain the articles and add the article content for each
    // var $articleList = $("<ul>");
    // $articleList.addClass("list-group");

    // Converting unix timestamp to date x/xx/xxxx
    const unixTime = res.dt;
    let [month, day, year] = new Date().toLocaleDateString("en-US").split("/");
    year -= 2000;
    currentDate = month + "/" + day + "/" + year;

    // Creating and storing a div tag for the header of current weather card
    let currentHeaderDiv = $("<div>");
    currentHeaderDiv.addClass("container-fluid d-inline-flex justify-content-between header-box");
    
    // Creating html and adding a class to current weather header
    let city = $("<h3>").text(res.name);
    city.addClass("mt-3 mr-3 ml-3");

    let date = $("<h4>").text(currentDate);
    date.addClass("pt-1 mt-3 mr-1");

    let icon = $('<img class="pb-4" id="weather-icon" alt="Weather icon" width="100" height="100">');
    let iconUrl = "http://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png";
    icon.attr("src", iconUrl);
    
    console.log(res.weather[0].icon);
    console.log(iconUrl);

    // Body of current weather card
    // $(".humidity").text("Humidity: " + res.main.humidity);
    // $(".wind").text("Wind Speed: " + res.wind.speed);
    // $(".uvi").text("UV Index:" + res.current.uvi);

    // Appending data to current weather card
    currentHeaderDiv.append(city);
    currentHeaderDiv.append(date);
    currentHeaderDiv.append(icon);

    // Prependng the currentHeaderDiv to the HTML page in the "#current-header" div
    $("#current-header").prepend(currentHeaderDiv);

    // Local storage
    

}

function renderPhaseTwo (res) {
    
}

// Function to empty out the articles
function clear() {
    $("#city-name").empty();
    $("#current-header").empty();
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