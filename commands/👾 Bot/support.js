const { MessageEmbed } = require("discord.js-12");
const Discord = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "support",
  category: "👾 Bot",
  aliases: [],
  cooldown: 5,
  usage: "support",
  description: "Permet de rejoindre le serveur support du bot",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    const add = new Discord.MessageEmbed()
      .setColor("EC5922")
      .setTitle("👔 | Serveur Support")
      .setDescription(
        "> Rejoint notre serveur Discord pour suivre l'actualité du bot et le découvrir. Tu pourras aussi demander de l'aide sur ce serveur ! [Clique ici](https://discord.gg/UeA6GrtfMK)"
      )
      .setFooter(
        "© PalaBot 2021 • Created By Xvirus9",
        "https://cdn.discordapp.com/attachments/657878417324113983/873843137817239563/nT0fW4I-.jpg"
      );
    message.channel.send(add);
  },
};
