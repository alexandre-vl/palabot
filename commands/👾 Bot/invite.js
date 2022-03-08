const { MessageEmbed } = require("discord.js-12");
const Discord = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "invite",
  category: "👾 Bot",
  aliases: ["add"],
  cooldown: 7,
  usage: "invite",
  description: "Permet d'inviter le bot sur son serveur",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    const add = new Discord.MessageEmbed()
      .setColor("EC5922")
      .setTitle("🎈 | Inviter le bot")
      .setDescription(
        "> Tu peux m'inviter [ici](https://discord.com/api/oauth2/authorize?client_id=872180184973979739&permissions=261389413489&scope=bot) !"
      )
      .setFooter(
        "© PalaBot 2021 • Created By Xvirus9",
        "https://cdn.discordapp.com/attachments/657878417324113983/873843137817239563/nT0fW4I-.jpg"
      );
    message.channel.send(add);
  },
};
