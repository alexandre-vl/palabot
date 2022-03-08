const { MessageEmbed } = require("discord.js-12");
const Discord = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "vote", 
  category: "👾 Bot", 
  aliases: [], 
  cooldown: 5, 
  usage: "vote",
  description: "Permet de voter pour le bot sur le site top.gg", 
  memberpermissions: [],
  requiredroles: [], 
  alloweduserids: [], 

    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        const add = new Discord.MessageEmbed()
            .setColor('EC5922')
            .setTitle('📨 | Site De Vote')
            .setDescription('> Pour nous aider, vous pouvez voter pour le bot sur le site top.gg en [cliquant ici](https://top.gg/bot/872180184973979739/vote)')
            .setFooter('© PalaBot 2021 • Created By Xvirus9', 'https://cdn.discordapp.com/attachments/657878417324113983/873843137817239563/nT0fW4I-.jpg');
        message.channel.send(add);
    }
}

