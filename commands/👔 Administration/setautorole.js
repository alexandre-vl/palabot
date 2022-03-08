const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "setautorole",
  category: "👔 Administration",
  aliases: [],
  cooldown: 7,
  usage: "setautorole <@role>",
  description:
    "Permet de définir le role qui sera ajouter à chaques nouveaux membres",
  memberpermissions: ["ADMINISTRATOR"],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, plusArgs, cmdUser, text, prefix) => {
    const db = require("quick.db");

    let args = message.content.substring(prefix.length).split(" ");

    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find((c) => c.id == args[1]);
    if (!role)
      return message.channel.send("❌ Veuillez préciser un role valide");
    db.set(message.guild.id + ".autorole", role.id);

    message.channel.send("Autorole défini sur `" + role.name + "`");
  },
};
