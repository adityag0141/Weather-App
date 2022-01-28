const express = require("express");
const app = express();
const aws = require("aws-sdk");
const bodyparser = require("body-parser");
const https = require("https");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
var temp = "";
var des = "";
var icon = "";
var sym = "";
var place = "";

app.get("/", function(req, res){
    res.render("weather", {temperature:temp, description:des, ic:icon, symbol:sym, area:place});
})

app.post("/", function(req, res){
    var place = req.body.place;
    var unit = req.body.unit;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=`+place+`&units=`+unit+`&appid=${process.env.S3_WEATHERKEY}`;
    https.get(url, function(response){
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            if(unit=="metric"){
                 sym = "C";
            }
            else{
                 sym="F";
            }
            temp = weatherData.main.temp;
            des = weatherData.weather[0].description ;
            icon = weatherData.weather[0].icon;
            res.render("weather", {temperature:temp, description:des, ic:icon, symbol:sym, area:place});
    
    
        })
    })
    
})


app.listen(process.env.PORT || 3000, function(req,res){

    console.log("Server is runnning");
})