const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const { embedError } = require("../../handlers/functions.js");

module.exports = {
  name: "profile",
  category: "🎯 Aventure",
  aliases: ["p", "inv", "inventaire", "inventory"],
  cooldown: 5,
  usage: "profile",
  description: "Voir son profile",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    if (
      !db.get("adventure.players") ||
      !db.get("adventure.players").find((p) => p.id === message.author.id)
    ) {
      return embedError(
        "Vous n'êtes pas inscrit dans l'aventure, tapes `m!start` pour commencer l'aventure",
        message.channel
      );
    }

    players = db.get("adventure.players");

    let player = players.find((p) => p.id === message.author.id);

    let minerais = [
      "<:amethyste:939197156059906209> Améthyste: " +
        player.inventory.amethyste,
      "<:titane:939197157922209822> Titane: " + player.inventory.titane,
      "<:paladium:939197157725061260> Paladium: " + player.inventory.paladium,
      "<:findium:939197156273815612> Findium: " + player.inventory.findium,
      "<:trixium:877851448124264458> Trixium: " + player.inventory.trixium,
    ];

    message.reply({
      embed: {
        author: { name: "Voici votre inventaire 🎒" },
        description: minerais.join("\n"),
        color: "EC5922",
      },
    });
  },
};
