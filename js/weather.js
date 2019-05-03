$(document).ready(function () {
    $("#submitbtn").click(function (){
        var url = "http://api.openweathermap.org/data/2.5/weather?units=metric&APPID=3b6c3c49cf0b024e32e9c72e5bb7ce11&q="+ $("#cityField").val();
        
    $.getJSON(url, function (data){
        console.log("Weather Data" + JSON.stringify(data));
        if(data.cod == 200){
        var weatherData = data;
        console.log(weatherData.name);  
        console.log(weatherData.weather[0].description);
        console.log(weatherData.sys.country);
        console.log(weatherData.main.humidity);
        $("#popupWeatherCountry").html(weatherData.sys.country);
        $("#popupWeatherCity").html(weatherData.name);
        $("#popupWeatherDesc").html(weatherData.weather[0].description);
        $("#popupWeatherHumidity").html(weatherData.main.humidity);
        $("#popupWeatherTemp").html(weatherData.main.temp + "C");
        $("#tblWeather").css("display","block");
        $("#errormsg1").css("display","none");
        }
        
    })
    .fail(function(data) { 
        if(data.responseJSON.cod == "400")
        {
            $("#errormsg1").html("Please enter a city.");
            $("#tblWeather").css("display","none");
            $("#errormsg1").css("display","block");
        }
        else if(data.responseJSON.cod == "404")
        {
            $("#errormsg1").html("Please enter a valid city.");
            $("#tblWeather").css("display","none");
            $("#errormsg1").css("display","block");
        } });
});
});