var { MessageEmbed } = require(`discord.js-12`);
var Discord = require(`discord.js-12`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var settings = require(`../../botconfig/settings.json`);
var { delay } = require(`../../handlers/functions`);
const fs = require("fs");
module.exports = {
  name: "reloadbot",
  category: "👾 Bot",
  aliases: ["botreloadbot"],
  cooldown: 5,
  usage: "reloadbot",
  description: "Permet de redémarer complétement le bot.",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: settings.ownerIDS,

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      const index = require("../../index");
      let eventcount = 0;
      await fs.readdirSync("./events/").forEach(async (dir) => {
        const events = fs
          .readdirSync(`./events/${dir}/`)
          .filter((file) => file.endsWith(".js"));
        eventcount += events.length;
      });
      let tempmsg = await message.channel.send(
        new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setAuthor(
            "Reloading ...",
            "https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif",
            "https://discord.gg/FQGXbypRf8"
          )
          .setTitle(
            `> Reloading **\`${client.commands.size} Commands\`**\n\n> Reloading **\`${eventcount} Events\`**\n\n> Reloading **\`${client.handlers.length} Modules/Features\`**`
          )
      );
      await client.commands.clear();
      await fs.readdirSync("./commands/").forEach(async (dir) => {
        const commands = fs
          .readdirSync(`./commands/${dir}/`)
          .filter((file) => file.endsWith(".js"));
        for (let file of commands) {
          try {
            delete require.cache[
              require.resolve(`../../commands/${dir}/${file}.js`)
            ];
            console.log(`SUCCESS :: ../../commands/${dir}/${file}.js`);
          } catch {}
        }
      });
      await delay(1000);
      await client.removeAllListeners();
      await delay(1000);
      await client.handlers.forEach((handler) => {
        try {
          delete require.cache[require.resolve(`../../handlers/${handler}`)];
          console.log(`SUCCESS :: ../../handlers/${handler}`);
        } catch (e) {
          console.log(e);
        }
      });

      await delay(1000);
      index.handlers();
      console.log(client.commands.map((cmd) => cmd.name));
      await tempmsg.edit({
        embed: new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setAuthor(
            "Successfully Reloaded:",
            "https://cdn.discordapp.com/emojis/833101995723194437.gif?v=1",
            "https://discord.gg/FQGXbypRf8"
          )
          .setTitle(
            `> **\`${client.commands.size} Commands\`**\n\n> **\`${eventcount} Events\`**\n\n> **\`${client.handlers.length} Modules/Features\`**`
          ),
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.channel.send(
        new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`:x: Something went Wrong`)
          .setDescription(
            `\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``
          )
      );
    }
  },
};
