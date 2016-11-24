var SlackBot = require('slackbots');
var botkit = require("botkit")
var Forecast = require('forecast.io');
var FORECAST_TOKEN = process.env.FORECAST_TOKEN;
var options = {
    APIKey: FORECAST_TOKEN
};
var forecast = new Forecast(options);
var childProcess = require("child_process");
var clearskybot_token = process.env.CLSKY_TOKEN;
// create a bot
var bot = new SlackBot({
    // Add a bot https://my.slack.com/services/new/bot and put the token
    token: clearskybot_token,
    name: 'clearskybot'
});

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':cat:'
    };

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    // define existing username instead of 'user_name'
    bot.postMessageToUser('ssdharma', 'Yello!!', params);
    bot.getChannels().then(function(channels) {
        console.log(JSON.stringify(channels, null, 3))
    });
});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    if (data.type == 'message' && getUser(data.user).name != bot.name) {
        console.log("inside if");
        if (data.text.indexOf("weather") != -1 || data.text.indexOf("Weather") != -1) {
            //reply(data, "The weather is <none>")
            //reply(data, getWeather())
            getWeather(function(w) {
                reply(data, w);
            });
        }
    }
    console.log("debug data" + data)
});

function reply(data, msg) {
    //console.log( "replying to " + data.channel)
    //console.log( data )
    var channel = getChannel(data.channel)
    if (channel) {
        console.log("replying in channel ")
        bot.postMessageToChannel(channel.name, msg, {
            as_user: true
        });
    } else {
        var user = getUser(data.user)
        bot.postMessageToUser(user.name, msg, {
            as_user: true
        });
    }
}

function getChannel(channelId) {
    return bot.channels.filter(function(item) {
        return item.id === channelId;
    })[0];
}

function getUser(userId) {
    return bot.users.filter(function(item) {
        return item.id === userId;
    })[0];
}

function getWeather(callback) {
    var latitude = "48.208579"
    var longitude = "16.374124"
    var w = ""
    forecast.get(latitude, longitude, function(err, res, data) {
        if (err) throw err;
        //console.log('res: ' + JSON.stringify(res));
        //console.log('data: ' + JSON.stringify(data));
        w = data.currently.summary + " and feels like " + data.currently.apparentTemperature;
        var temp = data.currently.apparentTemperature

        if (temp <= 40) {
            w = w + "Get an overcoat!! It might snow!! :)"
        } else if (temp > 40 && temp <= 70) {
            w = w + "It will be pleasant! Grab a coffee if you can!"
        } else if (temp > 70 && temp <= 100) {
            w = w + "It's Hot!! Wear your Glares!! Get a Coke!!!"
        } else {
            w = w + "I won't go outside!! I will melt!!! :("
        }
        callback(w)
    });


}
});


}
