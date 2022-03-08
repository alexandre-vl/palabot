var { MessageEmbed } = require(`discord.js-12`);
var Discord = require(`discord.js-12`);
var config = require(`../../botconfig/config.json`);
var settings = require(`../../botconfig/settings.json`);
var ee = require(`../../botconfig/embed.json`);
module.exports = {
  name: `reload`,
  category: `👾 Bot`,
  aliases: [`commandreload`],
  description: `Reloads a command`,
  usage: `reload <CMD>`,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: settings.ownerIDS,
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      let thecmd =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.get(client.aliases.get(args[0].toLowerCase()));
      if (thecmd) {
        try {
          delete require.cache[
            require.resolve(
              `../../commands/${thecmd.category}/${thecmd.name}.js`
            )
          ];
          client.commands.delete(thecmd.name);

          const pull = require(`../../commands/${thecmd.category}/${thecmd.name}.js`);
          client.commands.set(thecmd.name, pull);
          return message.channel.send(
            new MessageEmbed()
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`Reloaded: \`${args[0]}\``)
          );
        } catch (e) {
          return message.channel.send(
            new MessageEmbed()
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`:x: Could not reload: \`${args[0]}\``)
              .setDescription(
                `\`\`\`${
                  e.message
                    ? String(e.message).substr(0, 2000)
                    : e.stack
                    ? String(e.stack).substr(0, 2000)
                    : String(e).substr(0, 2000)
                }\`\`\``
              )
          );
        }
      } else {
        return message.channel.send(
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:x: Could not find: \`${args[0]}\``)
        );
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.channel.send(
        new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`:x: ERROR | An error occurred`)
          .setDescription(`\`\`\`${e.message}\`\`\``)
      );
    }
  },
};
