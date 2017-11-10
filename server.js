var WWO = require('worldweatheronline-api');
var Twitter = require('twitter');
var db = require('./model/db');


var twitterclient = new Twitter({
  consumer_key: 'asdedvtTcTnyeCFgDXkY3igxCsg96g',
  consumer_secret: 'dedsasNpk3abQIXj1ZySWK3h4NIvl0VGWaZGoaFqvR7JX58lkEm0fa68',
  access_token_key: 'dedeff602985720-eZY35rY69pEReiGhGSYcy5VRIpOwVeJ8Q4HlcBIx',
  access_token_secret: 'aserdJSEPlvPaN1w1A290H6yvPLIDlC86BHUq34K7IUjvDYGnJ'
});

var client = WWO.createClient({
    key:'ffrgsbba6adb1c607479c822164834170711',
    responseType: 'json',
    subscription: 'premium',
    locale: 'EN'
});

client.localWeatherApi({
    q: "Chennai",
    num_of_days: "1"
}, function(err, result) {
    if (!err) {
        console.log(result);
        var climateData = JSON.parse(result);
        var tempData = climateData.data.current_condition[0].temp_C;
        var obsTime = climateData.data.current_condition[0].observation_time;
        console.log(obsTime);
        var obsDate = climateData.data.weather[0].date;
        var mongoTime = obsDate +' '+ obsTime;
        console.log(mongoTime);
        var cloudcover = climateData.data.current_condition[0].cloudcover;
        var datatoSend = {tempData,obsTime,obsDate,cloudcover};
        var data = JSON.stringify(datatoSend);
        console.log("The current temperature is:"+ data);
        twitterclient.post('statuses/update',{status: data},  function(error, tweet, response) {
                 if(error) throw error;
                  //console.log(tweet);  // Tweet body.
                  //console.log(response);  // Raw response object.
                  });
        console.log("posting data to mongodb");
        db.model('weather').create({
                tempData:tempData,
                obsTime:mongoTime,
                obsDate:obsDate,
                cloudcover:cloudcover

        },function(err, weather) {
             if(err) throw err;
             console.log('Posted Data to DB:'+weather);
      });

    } else {
        console.log(err);
    }
});
