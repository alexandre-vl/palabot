const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const { embedError } = require("../../handlers/functions.js");

module.exports = {
  name: "start",
  category: "🎯 Aventure",
  aliases: [],
  cooldown: 5,
  usage: "start",
  description: "Démarre l'aventure",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    if (
      db.get("adventure.players") &&
      db.get("adventure.players").find((p) => p.id === message.author.id)
    ) {
      return embedError(
        "Vous êtes déjà inscrit dans l'aventure",
        message.channel
      );
    }
    message.reply({
      embed: {
        author: { name: "🎉 Bienvenue dans l'aventure !" },
        description:
          "Bien joué, vous venez d'entrer dans l'aventure faites `m!help` pour consulter les commandes disponibles",
        color: "EC5922",
      },
    });

    db.push("adventure.players", {
      id: message.author.id,
      status: "idle",
      inventory: {
        amethyste: 0,
        titane: 0,
        gravel: 0,
        paladium: 0,
        trixium: 0,
        findium: 0,
      },
      hunger: 20,
      life: 20,
      xp: 0,
      level: 0,
      mining: {
        message: null,
        startedDate: null,
        mined_block: 0,
      },
    });
  },
};
