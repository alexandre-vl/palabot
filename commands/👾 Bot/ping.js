const { MessageEmbed } = require("discord.js-12");
const Discord = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "ping",
  category: "👾 Bot",
  aliases: [],
  cooldown: 5,
  usage: "ping",
  description: "Permet de tester la rapidité du bot",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    const embed = new Discord.MessageEmbed()
      .setTitle("Pong !")
      .setDescription("🏓 Mon Ping : `" + client.ws.ping + "ms`")
      .setColor("EC5922")
      .setTimestamp()
      .setFooter("© PalaBot 2021 • Created By Xvirus9");
    message.channel.send(embed);
  },
};
