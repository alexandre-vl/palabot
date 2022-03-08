const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "setprefix",
  category: "👔 Administration",
  aliases: [],
  cooldown: 7,
  usage: "setprefix <prefix>",
  description:
    "Permet de définir le nouveau prefix du bot pour le serveur actuel",
  memberpermissions: ["ADMINISTRATOR"],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, plusArgs, cmdUser, text, prefix) => {
    const db = require("quick.db");
    const args = message.content.substring(prefix.length).split(" ");
    if (!args[1])
      return message.channel.send("❌ Veuillez préciser le nouveau préfix !");
    if (args[1].length > 5)
      return message.channel.send(
        "Veuillez préciser un préfix contenant entre 1 et 5 caractères"
      );

    db.set(message.guild.id + ".prefix", args[1]);

    message.channel.send("Le prefix est maintant : `" + args[1] + "`");
  },
};
