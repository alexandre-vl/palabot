const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "say",
  category: "👔 Administration",
  aliases: [],
  cooldown: 5,
  usage: "say <texte>",
  description: "Répète le texte",
  memberpermissions: ["ADMINISTRATOR"],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      if (!args[0])
        return message.channel.send({
          embed: new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | You didn't provided a Text`)
            .setDescription(`Usage: \`${prefix}say <Your Text>\``),
        });
      message.channel.send(text.substr(0, 2000));
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.channel.send(
        new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | An error occurred`)
          .setDescription(`\`\`\`${e.stack}\`\`\``)
      );
    }
  },
};
