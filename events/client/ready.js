//here the event starts
const config = require("../../botconfig/config.json");
const { change_status } = require("../../handlers/functions");
module.exports = (client) => {
  console.log("Bot Ready !");
  console.log("-----------------------------------")

  client.user.setActivity(+"42 serveurs | m!help");
};
