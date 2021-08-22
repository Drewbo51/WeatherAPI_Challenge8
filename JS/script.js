//var searchHistory;
var storageArray = [];
var userChoice;
var storageCounter = 1;

$("#search-button").on("click", function() {

    $("#today").empty();
    $("#forecast").empty();

    var userChoice = $("#search-value").val();
    storageArray.push(userChoice);
    localStorage.setItem("Search " + storageCounter++, storageArray[0]);
    storageArray = [];

    var APIkey = "fa27b83c7f94f7b657f0e5b700fa09cd";
                    "api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userChoice.toLowerCase() + "&appid=" + APIkey;
  
    var searchHistory = $("<li>").text(userChoice);
    $("#history").prepend(searchHistory);

    
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {

    var newH = $("<h1>").text(response.name + " (" + moment().format("L") + ")");
    $("#today").append(newH);
    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    var tempP = $("<p>").text("Temperature: " + tempF.toFixed(1) + " °F");
    var humidityP = $("<p>").text("Humidity: " + response.main.humidity + "%");
    var windP = $("<p>").text("Wind Speed: " + response.wind.speed.toFixed(1) + " MPH");

    function addCloud() {
        if (response.weather[0].main === "Clouds") {
            var cloud = $("<i>").addClass("fas fa-cloud fa-3x").css({"color": "#787878", "margin-left": "15px"});
            $("#today").append(cloud);
        }
        else {
            var sun = $("<i>").addClass("far fa-sun fa-3x").css({"color": "#f38235", "margin-left": "15px"});
            $("#today").append(sun);
        }
    }
    
    $("#today").append(newH);
    addCloud();
    $("#today").append(tempP, humidityP, windP);

    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&exclude=minutely,hourly,alerts&appid=" + APIkey;

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response) {

        var uviHeader = $("<p>").text("UV Index: ").addClass("uvIndex");
        var uviP = $("<p>").text(response.current.uvi).addClass("uvIndex uvColor");
        $("#today").append(uviHeader, uviP);

        function colorScheme() {
            if (response.current.uvi < 4) {
                $(".uvColor").css({"background-color": "rgba(77, 175, 124, 1)", "padding": "2px 10px"});
            }
            else if (response.current.uvi > 3 || response.current.uvi < 8) {
                $(".uvColor").css({"background-color": "rgba(250, 190, 88, 1)", "padding": "2px 10px"});
            }
            else {
                $(".uvColor").css({"background-color": "rgba(240, 52, 52, 1)", "padding": "2px 10px"});
            }
        }

        colorScheme();

        for (var i = 0; i < Math.min(response.daily.length, 5); i++) {

        var cardDiv = $("<div>").addClass("card");
        var divBody = $("<div>").addClass("card-body");
        var tempF2 = (response.daily[i].temp.day - 273.15) * 1.8 + 32;
        var headTag = $("<h3>");
        var tempP2 = $("<p>");
        var humidityP = $("<p>").text("Humidity: " + response.daily[i].humidity + "%").css("margin-bottom", "auto");
        tempP2.text("Temp: " + tempF2.toFixed(1) + " °F");

            function addCloud() {
            if (response.daily[i].weather[0].main === "Clouds") {
                var cloud = $("<i>").addClass("fas fa-cloud fa-lg").css("color", "#787878");
                divBody.append(cloud);
            }
            else {
                var sun = $("<i>").addClass("far fa-sun fa-lg").css("color", "#f38235");
                divBody.append(sun);
            }
        }

        divBody.append(headTag);
        addCloud();
        divBody.append(tempP2, humidityP);
        cardDiv.append(divBody);
        $("#forecast").append(cardDiv);
        var date = moment().add(i + 1, "d").format("L");
        headTag.text(date);

            }
        });
    });
    
});