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

$("#favourite").click(function (e) {
    e.preventDefault();
    $(".recentCities").toggle(200);
});

$(this).resize(function () {
    if ($(this).width() > 1200) {
        $(".recentCities").show();
    }else{
        $(".recentCities").hide();
    }
});

$("#search").click(function (e) {

    e.preventDefault();

    var inputValue = $("input").val().trim();

    if (inputValue != "") {
        search(inputValue).then(result => {
            if (result) {

                $("#error").remove();//remove error message
                $("input").val("");  //clear input area

                //Add to favourites
                var cityName = result.city.name + ", " + result.city.country;
                loadCity(cityName);

                //Add to storage
                cities.push(cityName);
                localStorage.setItem("cities", JSON.stringify(cities));
            }
        }).catch(e => {
            $("form").after("<p id=\"error\">City not found</p>")
        })
    }
});

async function search(value) {
    var result = $.get("https://api.openweathermap.org/data/2.5/forecast?q=" + value + "&appid=166a433c57516f51dfab1f7edaed8413", function (result, status) {
        if (status == "success") {
            //Add display results code here


            console.log(result);





        } else {
            result = false;
        }
    });
    return await result
}

loadStorage();