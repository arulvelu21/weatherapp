'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/weatherdata');

var weatherData = new mongoose.Schema({
    tempdata : Number,
    obsTime : String,
    obsDate: Date,
    cloudcover : Number
});

module.exports=mongoose.model('weather',weatherData);

