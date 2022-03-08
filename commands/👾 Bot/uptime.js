const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { duration } = require("../../handlers/functions")
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "uptime", 
    category: "👾 Bot",
    aliases: [],
    cooldown: 5,
    usage: "uptime", 
    description: "Permet de savoir le temps depuis que le bot est en ligne", 
    memberpermissions: [], 
    requiredroles: [],
    alloweduserids: [],
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try{
      message.channel.send({embed: new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`:white_check_mark: **${client.user.username}** est en ligne depuis : \`${duration(client.uptime)}\``)
      });
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}

