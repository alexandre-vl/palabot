const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "delitem",
  category: "👑 Market",
  aliases: [],
  cooldown: 5,
  usage: "delitem <numéro>",
  description: "Permet de supprimé des items dans le market inter-serveurs",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: (client, message, prefix) => {
    const db = require("quick.db");

    let args = message.content.substring(prefix.length).split(" ");
    let items = db.get(`bot.items`);
    let newitems = Object.entries(items);
    let lastid = newitems.length;

    if (!args[1])
      return message.channel.send("Veuillez préciser le numéro de l'item");
    if (!isNumeric(args[1]))
      return message.channel.send("Veuillez préciser un numéro valide !");
    if (items[parseInt(args[1]) - 1].authorID !== message.author.id)
      return message.channel.send("Cet item ne vous appartient pas");

    items.splice(args[1] - 1, 1);
    db.set(`bot.items`, items);
    db.subtract(message.author.id + ".itemsbnr", 1);

    message.channel.send("Item supprimé : `" + args[1] + "`");

    function isNumeric(str) {
      if (typeof str != "string") return false; // we only process strings!
      return (
        !isNaN(str) && !isNaN(parseFloat(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      ); // ...and ensure strings of whitespace fail
    }
  },
};
