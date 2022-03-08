const { MessageEmbed, splitMessage } = require(`discord.js-12`);
var Discord = require(`discord.js-12`);
var config = require(`../../botconfig/config.json`);
var settings = require(`../../botconfig/settings.json`);
var ee = require(`../../botconfig/embed.json`);
const { inspect } = require(`util`);
module.exports = {
  name: `eval`,
  category: `👾 Bot`,
  aliases: [`evaluate`],
  description: `eval Commande`,
  usage: `eval <code>`,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: settings.ownerIDS,
  minargs: 1,
  maxargs: 0,
  minplusargs: 0,
  maxplusargs: 0,
  argsmissing_message: "",
  argstoomany_message: "",
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      let evaled;
      if (args.join(` `).includes(`token`))
        return console.log(`ERROR NO TOKEN GRABBING ;)`.red);
      evaled = await eval(args.join(` `));
      let string = inspect(evaled);
      if (string.includes(client.token))
        return console.log(`ERROR NO TOKEN GRABBING ;)`.red);
      let evalEmbed = new MessageEmbed()
        .setTitle(`${client.user.username} | Eval`)
        .setColor(ee.color);
      const splitDescription = splitMessage(string, {
        maxLength: 2040,
        char: `\n`,
        prepend: ``,
        append: ``,
      });
      evalEmbed.setDescription(`\`\`\`` + splitDescription[0] + `\`\`\``);
      message.channel.send(evalEmbed);
    } catch (e) {
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
