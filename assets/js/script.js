
var api_key = 'd8d8a8f555c8a15ae25aa0ba82f82b81';
var dayArray = [];

$('#search-button').on('click',getCity);

//function for the getting lat and lon for city value and passing into ajax call
function getCity() {
    var city = $('#search-input').val();
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
    var queryUrl = url + city + '&appid=' + api_key;

    $.ajax({
        url: queryUrl,
        method: "GET"
      }).then(function(response) {
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
    var queryUrl = url + lat + '&lon=' + lon + '&appid=' + api_key + '&units=metric';

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
function weatherHtml(weatherObj) {
    // date
    // response.list[0].dt_txt;
    // response.list[0].dt;
    // weather
    // response.list[0].main.weather[0].main;
    // response.list[0].main.weather[0].description;
    // response.list[0].main.weather[0].icon;

    //animated icons https://www.amcharts.com/free-animated-svg-weather-icons/
    //svg files in images folder

    dayArrayCreate(weatherObj);
    for (var i = 0; i < dayArray.length; i++) {
        var today = $('#today');
        if (i === 0) {
            var h2 = $('<h2>');
            h2.text(weatherObj.city.name + ' (' + weatherObj.list[dayArray[i].index].dt_txt.substring(0, 10) + ')');
            today.append(h2);
        } else {
            var h3 = $('<h3>');
            h3.text(weatherObj.list[dayArray[i].index].dt_txt.substring(0, 10));
            today.append(h3);
        }
        var today = $('#today');
        var p1 = $('<p>');
        p1.text('Temp: ' + weatherObj.list[dayArray[i].index].main.temp + ' ℃');
        var p2 = $('<p>');
        p2.text('Wind: ' + Math.floor(weatherObj.list[dayArray[i].index].wind.speed * 3.6 * 100) / 100 + ' KpH');
        var p3 = $('<p>');
        p3.text('Humidity: ' + weatherObj.list[dayArray[i].index].main.humidity + '%');
        today.append(p1,p2,p3);
    }
    
}

//function to create an array of which response indexes are the ones we want to use
//for each day as the response is 3h hourly (not daily)
//taking the 9am weather for the 5 day forecast
function dayArrayCreate(weatherObj) {
    var count = 1;
    dayArray[0] = {'date': weatherObj.list[0].dt_txt.substring(0, 10),
                       'index': 0};
    console.log(weatherObj.list.length);
    for (var i = 1; i < weatherObj.list.length; i++) {
        if ( weatherObj.list[i].dt_txt.substring(0, 10) !== weatherObj.list[i-1].dt_txt.substring(0, 10)) {
            dayArray[count] = {'date': weatherObj.list[i+2].dt_txt.substring(0, 10), 'index': i};
            count++;
        }
    }
    console.log(dayArray);
}

//function to store city searched into localStorage

//function to read city from localStorage

//function for loading previously search cities into html buttons