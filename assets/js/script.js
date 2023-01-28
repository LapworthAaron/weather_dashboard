
var api_key = 'd8d8a8f555c8a15ae25aa0ba82f82b81';
var dayArray = [];

getCityList();
$('#search-button').on('click',getCity);
$('.city-button').on('click',getCityBtn);

//function for the getting lat and lon for city value and passing into ajax call
function getCity() {
    if ($('#search-input').val() !== '') {
        var city = $('#search-input').val();
        var url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
        var queryUrl = url + city + '&appid=' + api_key;
        callAjax(city, queryUrl);
    } else {
        alert("Please enter a place before searching.");
    }
    return;
}

function getCityBtn() {
    var city = $(this).text();
    if (city !== '') {
        var url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
        var queryUrl = url + city + '&appid=' + api_key;
        callAjax(city, queryUrl);
    } else {
        alert("Please enter a place before searching.");
    }
    return;
}

function callAjax(city, queryUrl) {
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response) {
        fiveDay(response.city.coord);
        storeCity(city);
    });
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

    //TODO: work out which svg needs to be display for each day
    //animated icons https://www.amcharts.com/free-animated-svg-weather-icons/
    //svg files in images folder

    dayArrayCreate(weatherObj);
    for (var i = 0; i < dayArray.length; i++) {
        var forecastType;
        if (i === 0) {
            forecastType = $('#today');
            var div = $('<div>');
            var h2 = $('<h2>');
            h2.text(weatherObj.city.name + ' (' + weatherObj.list[dayArray[i].index].dt_txt.substring(0, 10) + ')');
            var icon = $('<img>');
            icon.attr('src', './assets/images/day.svg');
            div.append(h2, icon);
            forecastType.append(div);
        } else {
            forecastType = $('#forecast');
            var div = $('<div>');
            var h3 = $('<h3>');
            h3.text(weatherObj.list[dayArray[i].index].dt_txt.substring(0, 10));
            var icon = $('<img>');
            icon.attr('src', './assets/images/day.svg');
            div.append(h3, icon);
            forecastType.append(div);
        }
        var p1 = $('<p>');
        p1.text('Temp: ' + weatherObj.list[dayArray[i].index].main.temp + ' ℃');
        var p2 = $('<p>');
        p2.text('Wind: ' + Math.floor(weatherObj.list[dayArray[i].index].wind.speed * 3.6 * 100) / 100 + ' KpH');
        var p3 = $('<p>');
        p3.text('Humidity: ' + weatherObj.list[dayArray[i].index].main.humidity + '%');
        forecastType.append(p1,p2,p3);
    }
    
}

//function to create an array of which response indexes are the ones we want to use
//for each day as the response is 3h hourly (not daily)
//taking the 9am weather for the 5 day forecast
function dayArrayCreate(weatherObj) {
    var count = 1;
    dayArray[0] = {'date': weatherObj.list[0].dt_txt.substring(0, 10),
                       'index': 0};
    for (var i = 1; i < weatherObj.list.length; i++) {
        if (weatherObj.list[i].dt_txt.substring(0, 10) !== weatherObj.list[i-1].dt_txt.substring(0, 10)) {
            dayArray[count] = {'date': weatherObj.list[i+2].dt_txt.substring(0, 10), 'index': i};
            count++;
        }
    }
    return;
}

//function to store city searched into localStorage
function storeCity(city) {
    var cityList = {list: []};
    city = city.charAt(0).toUpperCase() + city.slice(1)
    if (localStorage.getItem("cityList") == undefined) {
        cityList.list.push(city);
        $('#search-input').val('');
        localStorage.setItem("cityList", JSON.stringify(cityList));
        getCityList();
        return;
    }
    
    cityList = JSON.parse(localStorage.getItem("cityList"));
    if (!cityList.list.includes(city)) {
        cityList.list.push(city);
        localStorage.setItem("cityList", JSON.stringify(cityList));
        getCityList();
    }
    $('#search-input').val('');
    return;
}

//function to read city from localStorage
function getCityList() {
    var cityList;
    if (localStorage.getItem("cityList") != undefined) {
        cityList =  JSON.parse(localStorage.getItem("cityList"));
        console.log(cityList);
        cityBtns(cityList);
        return;
    }
    return;
}

//function to create city buttons
function cityBtns(cityList) {
    for (var i = 0; i < cityList.list.length; i++) {
        if ($('#city_' + i)) {
            $('#city_' + i).remove();
        }
        var city = $('<button>');
        city.attr({'type':'button',
                    'aria-label':cityList.list[i],
                    'class':'btn city-button',
                    'id':'city_' + i}).html(cityList.list[i]);
        var cityListDiv = $('#history');
        cityListDiv.append(city);
    }
    return;
}