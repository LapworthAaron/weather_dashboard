var api_key = 'd8d8a8f555c8a15ae25aa0ba82f82b81';
var dayArray = [];
//object to display the appropriate weather icon
var icons = {'01':'fa fa-solid fa-sun',
    '02':'fa fa-solid fa-cloud-sun',
    '03':'fa fa-solid fa-cloud',
    '04':'fa fa-solid fa-cloud',
    '09':'fa fa-solid fa-cloud-rain',
    '10':'fa fa-solid fa-cloud-showers-heavy',
    '11':'fa fa-solid fa-cloud-bolt',
    '13':'fa fa-solid fa-snowflake',
    '50':'fa fa-solid fa-smog'};

init();

//first load of page
function init() {
    getCityList();
    $('#search-button').on('click',getCity);
}

//remove localStorage city history
function clearHistory() {
    localStorage.removeItem("cityList");
    var cityListDiv = $('#history');
    cityListDiv.empty();
}

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

//city buttons from localstorage call api
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

//call api
function callAjax(city, queryUrl) {
    $.ajax({
        url: queryUrl,
        method: "GET",
        success: function (response) {
            fiveDay(response.city.coord);
            storeCity(city);
          },
        error: function (result, status, err) {
            alert("This place does not exist, please try again.");
          }
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
        weatherHtml(response);
    });
    return
}

//function for updating html for weather
function weatherHtml(weatherObj) {
    dayArrayCreate(weatherObj);
    $('#today').empty();
    $('#forecast').empty();
    //show forecastHeading and today section
    $('#forecastHeading').attr("class", "show");
    $('#today').attr("class", "today show");

    for (var i = 0; i < dayArray.length; i++) {
        var forecastType;
        var section = $('<section>');
        //get weather icon code to translate to font awesome icons
        var iconCode = weatherObj.list[dayArray[i].index].weather[0].icon.substring(0,2);
        //if the object data is for today
        if (i === 0) {
            forecastType = $('#today');
            var div = $('<div>');
            div.attr('class','forecastDiv');
            var h2 = $('<h2>');
            var date = moment(weatherObj.list[dayArray[i].index].dt_txt.substring(0, 10), "YYYY-MM-DD").format('DD/MM/YYYY');
            h2.text(weatherObj.city.name + ' (' + date + ') ');
            h2.attr('id','todayH2');
            h2.append("<span class='" + icons[iconCode] + "'></span>");
            div.append(h2);
            section.append(div);
        } else {
            //if the object data is for the 5 day forecast
            forecastType = $('#forecast');
            var div = $('<div>');
            div.attr('class','forecastDiv');
            var h5 = $('<h5>');
            var date = moment(weatherObj.list[dayArray[i].index].dt_txt.substring(0, 10), "YYYY-MM-DD").format('DD/MM/YYYY');
            h5.text(date);
            var icon = $('<h5>');
            icon.append("<span class='" + icons[iconCode] + "'></span>");
            div.append(h5, icon);
            section.attr('class','forecastBox');
            section.append(div);
        }
        //universal to all forecasting
        var p1 = $('<p>');
        p1.html('<strong>Temp:</strong> ' + weatherObj.list[dayArray[i].index].main.temp + ' ℃');
        var p2 = $('<p>');
        p2.html('<strong>Wind:</strong> ' + Math.floor(weatherObj.list[dayArray[i].index].wind.speed * 3.6 * 100) / 100 + ' KpH');
        var p3 = $('<p>');
        p3.html('<strong>Humidity:</strong> ' + weatherObj.list[dayArray[i].index].main.humidity + '%');
        section.append(p1,p2,p3);
        forecastType.append(section);
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
        cityBtns(cityList);
        return;
    }
    return;
}

//function to create city buttons
function cityBtns(cityList) {
    var cityListDiv = $('#history');
    cityListDiv.empty();
    for (var i = 0; i < cityList.list.length; i++) {
        // if ($('#city_' + i)) {
        //     // $('#city_' + i).remove();
        // }
        var city = $('<button>');
        city.attr({'type':'button',
                    'aria-label':cityList.list[i],
                    'class':'cityBtn',
                    'id':'city_' + i}).html(cityList.list[i]);
        cityListDiv.append(city);
    }
    var remove = $('<button>');
    remove.attr({'type':'button',
                    'aria-label': 'clear history button',
                    'class':'clearBtn',
                    'id':'clearBtn'}).html('Clear History');
    cityListDiv.append(remove);
    $('.cityBtn').on('click',getCityBtn);
    $('#clearBtn').on('click',clearHistory);
    return;
}