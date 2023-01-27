
var api_key = 'd8d8a8f555c8a15ae25aa0ba82f82b81';

$('#search-button').on('click',getCity);

//function for the getting lat and lon for city value and passing into ajax call
function getCity() {
    var city = $('#search-input').val();
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
    var queryUrl = url + city + '&appid=' + api_key;
    console.log(queryUrl);

    $.ajax({
        url: queryUrl,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        console.log(response.city.coord);
        fiveDay(response.city.coord)
        //TODO: function to store city and coords in localStorage
    });
    return;
}

//function for getting city 5 day forecast
function fiveDay(coords) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?lat=';
    var lat = coords.lat;
    var lon = coords.lon;
    var queryUrl = url + lat + '&lon=' + lon + '&appid=' + api_key;
    console.log(queryUrl);

    $.ajax({
        url: queryUrl,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        weatherHtml(response);

    });
    return
}

//function for updating html for weather
function weatherHtml(weatherOnj) {
    
}

//function to store city searched into localStorage

//function to read city from localStorage

//function for loading previously search cities into html buttons