const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "setleave",
  category: "👔 Administration",
  aliases: [],
  cooldown: 7,
  usage: "setleave <#salon>",
  description:
    "Permet de définir le salon où s'afficheront les messages de leave",
  memberpermissions: ["ADMINISTRATOR"],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, plusArgs, cmdUser, text, prefix) => {
    const db = require("quick.db");

    let args = message.content.substring(prefix.length).split(" ");
    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.find((c) => c.id == args[1]);
    if (!channel)
      return message.channel.send("❌ Veuillez préciser un channel valide");

    db.set(message.guild.id + ".leavechannel", channel.id);

    message.channel.send(
      "Salon des messages de leave défini sur `" + channel.name + "`"
    );
  },
};
