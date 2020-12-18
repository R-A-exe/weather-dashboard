var cities = new Array();


function loadStorage() {
    var storage = localStorage.getItem("cities");
    if (storage != null && storage != "") {
        cities = JSON.parse(storage);
        cities.forEach(element => {
            loadCity(element);
        });
    }
}

function loadCity(cityName) {
    var recentCity = $("<div>");
    recentCity.addClass("row recentCityRow")
        .text(cityName)
        .prependTo(".recentCities")
        .click(function () { search($(this).text()) });
}

function loadLast(){
    if(cities.length>0){
        search(cities[cities.length -1]);
    }
}

$("#favourite").click(function (e) {
    e.preventDefault();
    $(".recentCities").toggle(200);
});

$(this).resize(function () {
    if ($(this).width() > 1200) {
        $(".recentCities").show();
    } else {
        $(".recentCities").hide();
    }
});

$("#search").click(function (e) {

    e.preventDefault();

    var inputValue = $("input").val().trim();

    if (inputValue != "") {
        search(inputValue).then(cityName => {
            $("#error").remove();//remove error message
            $("input").val("");  //clear input area

            //Add to favourites
            loadCity(cityName);

            //Add to storage
            cities.push(cityName);
            localStorage.setItem("cities", JSON.stringify(cities));

        }).catch(e => { //if result returns error
            $("form").after("<p id=\"error\">City not found</p>")
        })
    }
});

async function search(value) {
    let result = await $.get("https://api.openweathermap.org/data/2.5/weather?q=" + value + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413");
    //Display results
    var cityName = result.name + ", " + result.sys.country
    $("#cityTitle").text(cityName + " - " + moment.unix(result.dt).format("dddd, MMMM Do YYYY"));
    $("#icon").attr("src","http://openweathermap.org/img/w/" + result.weather[0].icon +".png");
    console.log(result);
    $("#temperature").text("Temparature: " + result.main.temp + " °F");
    $("#humidity").text("Humidity: " + result.main.humidity + "%");
    $("#wind").text("Wind Speed: " + result.wind.speed + " MPH");
    let uv = await $.get("http://api.openweathermap.org/data/2.5/uvi?lat=" + result.coord.lat + "&lon=" + result.coord.lon + "&appid=166a433c57516f51dfab1f7edaed8413");
    var uvBox = $("<p>");
    if(uv.value >= 8){
        uvBox.addClass("red")
    }else if (uv.value >= 6){
        uvBox.addClass("orange")
    }else if (uv.value >= 3){
        uvBox.addClass("yellow")
    }else{
        uvBox.addClass("green")
    }
    uvBox.text(uv.value)
    $("#uv").text("UV Index: ").append(uvBox);

    let forecast = await $.get("https://api.openweathermap.org/data/2.5/forecast/daily?q=" + value + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413");
    $("#forecast").empty();
    for(let i = 1; i < 6; i ++){
        var element = forecast.list[i];
        var box = $("<div>");
        var date = $("<h4>");
        var icon = $("<img>");
        var temp = $("<p>");
        var hum = $("<p>");
        date.text(moment.unix(element.dt).format("YYYY/MM/DD"));
        icon.attr("src", "http://openweathermap.org/img/w/" + element.weather[0].icon +".png");
        temp.text("Temp: " + element.temp.day + " °F");
        hum.text("Humidity: " + element.humidity + "%"); 
        box.addClass("day").append(date, icon, temp, hum).appendTo($("#forecast"));
    };
    return cityName
}

loadStorage();
loadLast();