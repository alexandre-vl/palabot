const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "poll",
  category: "π Administration",
  aliases: ["vote"],
  cooldown: 5,
  usage: "poll <vote>",
  description: "Permet de crΓ©er un vote",
  memberpermissions: ["ADMINISTRATOR"],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, plusArgs, cmdUser, text, prefix) => {
    const db = require("quick.db");
    let args = message.content.substring(prefix.length).split(" ");
    let argsall = message.content.split(" ").slice(1).join(" ");
    if (!argsall)
      return message.channel.send("β Usage inconnu : `" + usage + "`");
    let embed = new Discord.MessageEmbed()
      .setAuthor("π | Sondage")
      .setColor("EC5922")
      .setDescription("`" + argsall + "`")
      .setThumbnail(message.guild.iconURL({ size: 256 }))
      .setThumbnail()
      .setFooter("Β© PalaBot 2021 β’ Created By Xvirus9");
    message.delete().then((m) => {
      message.channel.send(embed).then((mess) => {
        mess.react("β");
        mess.react("β");
        mess.react("β");
      });
    });
  },
};
