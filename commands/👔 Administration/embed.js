const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "embed",
  category: "👔 Administration",
  aliases: [],
  cooldown: 2,
  usage: "embed <titre> <description>",
  description: "Permet de créer un embed",
  memberpermissions: ["ADMINISTRATOR"],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, plusArgs, cmdUser, text, prefix) => {
    const db = require("quick.db");
    const args = message.content.split(" ");
    let argsall = message.content.split(" ").slice(2).join(" ");

    if (!args[1])
      return message.channel.send("Veuillez préciser le nom de l'embed");
    if (!argsall)
      return message.channel.send("Veuillez préciser le contenu de l'embed");

    let embed = new Discord.MessageEmbed()
      .setAuthor(args[1])
      .setDescription(argsall)
      .setColor("EC5922")
      .setThumbnail(message.guild.iconURL({ size: 256 }))
      .setFooter(message.guild.name);

    message.delete().then(message.channel.send(embed));
  },
};
