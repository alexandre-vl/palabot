const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require('discord.js-12')
module.exports = { 
  name: "quete", 
  category: "🧨 Paladium", 
  aliases: [],
  cooldown: 7, 
  usage: "quete", 
  description: "Permet d'afficher la quete journalière", 
  memberpermissions: [], 
  requiredroles: [],
  alloweduserids: [],
    run: (client, message, prefix) => {
        const db = require('quick.db')
        const embed = new Discord.MessageEmbed()
            .setTitle("🧨 | Quête Journalière")
            .setDescription(db.get("bot.quete").replace(/<:PaladiumSword:369234875099643914>|<:PaladiumSword:877681291523424296>/g, "<:paladium_sword:877198847389081610>").replace(/<:Ligne:681532139883331598>/g, ""))
            .setColor('EC5922')
            .setTimestamp()
            .setFooter("© PalaBot 2021 • Created By Xvirus9");
    
        message.channel.send(embed);
        
    }
}