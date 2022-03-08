const Discord = require("discord.js-12");
const colors = require("colors");
const fs = require("fs");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Discord.Collection();

client.handlers = ["command", "events"];

function handlers() {
  client.handlers.forEach((handler) => {
    require(`./handlers/${handler}`)(client);
  });
}
handlers();
module.exports.handlers = handlers;

client.login(require("./botconfig/config.json").token);
