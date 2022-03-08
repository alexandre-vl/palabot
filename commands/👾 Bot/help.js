const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "help",
  category: "👾 Bot",
  aliases: ["h", "commandinfo", "cmds", "cmd"],
  cooldown: 3,
  usage: "help [nom-commande]", //the command usage for helpcmd [OPTIONAL]
  description:
    "Permet de voir la liste des commandes disponible et leur utilité",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      if (args[0]) {
        const embed = new MessageEmbed();
        const cmd =
          client.commands.get(args[0].toLowerCase()) ||
          client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if (!cmd) {
          return message.channel.send(
            embed
              .setColor(ee.wrongcolor)
              .setDescription(
                `No Information found for command **${args[0].toLowerCase()}**`
              )
          );
        }
        if (cmd.name) embed.addField("Nom", `\`${cmd.name}\``);
        if (cmd.name) embed.setTitle(`Informations : \`${cmd.name}\``);
        if (cmd.description)
          embed.addField("Description", `\`${cmd.description}\``);
        if (cmd.aliases)
          embed.addField(
            "Alias",
            `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``
          );
        if (cmd.cooldown)
          embed.addField("Cooldown", `\`${cmd.cooldown} Secondes\``);
        else
          embed.addField(
            "Cooldown",
            `\`${settings.default_cooldown_in_sec} Secondes\``
          );
        if (cmd.usage) {
          embed.addField("Utilisation", `\`${prefix}${cmd.usage}\``);
          embed.setFooter("Syntax: <> = obligation, [] = option");
        }
        return message.channel.send({ embed: embed.setColor(ee.color) });
      } else {
        const embed = new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle("Liste des commandes")
          .setFooter(
            `Pour voir les infos d'une commande, tapez: ${prefix}help [commande]`,
            client.user.displayAvatarURL()
          );
        const commands = (category) => {
          return client.commands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``);
        };
        try {
          for (let i = 0; i < client.categories.length; i += 1) {
            const current = client.categories[i];
            const items = commands(current);
            embed.addField(
              `**${current} [${items.length}]**`,
              `${items.join(", ")}`
            );
          }
        } catch (e) {
          console.log(String(e.stack).red);
        }
        message.channel.send({ embed: embed });
      }
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
