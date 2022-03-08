const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require('discord.js-12')
module.exports = { 
  name: "paladium", 
  category: "🧨 Paladium", 
  aliases: ["pala", "liens", "links"],
  cooldown: 5, 
  usage: "paladium", 
  description: "Permet d'afficher les liens utiles pour Paladium", 
  memberpermissions: [], 
  requiredroles: [],
  alloweduserids: [],
    run: (client, message, prefix) => {
        const add = new Discord.MessageEmbed()
            .setColor('EC5922')
            .setTitle('🧨 | Liens Utiles')
            .setDescription('> [YouTube](https://www.youtube.com/channel/UC3uSViy-aWBAk6b36Xjnm0g)\n> [Discord](https://discord.gg/paladium)\n> [Twitter](https://twitter.com/PaladiumPVP)\n> [Instagram](https://www.instagram.com/paladium.pvp/)\n> [Site](https://paladium-pvp.fr)\n> [Boutique](https://store.paladium-pvp.fr)\n> TeamSpeak : ts.paladium-pvp.fr')
            .setFooter('© PalaBot 2021 • Created By Xvirus9', 'https://cdn.discordapp.com/attachments/657878417324113983/873843137817239563/nT0fW4I-.jpg');
        message.channel.send(add);
        
    }
}