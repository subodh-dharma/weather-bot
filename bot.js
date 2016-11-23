
var Botkit = require('botkit');
var Forecast = require('forecast.io');
var options = {APIKey:'433aa3af7ab580036c433a8c84b9172a'};
var forecast = new Forecast(options);

//var childProcess = require("child_process");

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.ALTCODETOKEN,
}).startRTM()

// give the bot something to listen for.
//controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {
controller.hears('weather',['mention', 'direct_mention'], function(bot,message) {
  bot.reply(message,'The weather is great.');
});
