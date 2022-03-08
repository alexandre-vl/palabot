const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const { embedError } = require("../../handlers/functions.js");
const moment = require("moment");
const { mining } = require("../../handlers/functions.js");

module.exports = {
  name: "minage",
  category: "🎯 Aventure",
  aliases: [],
  cooldown: 5,
  usage: "minage",
  description: "Vas miner !",
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
    if (
      db.get("adventure.players").find((p) => p.id === message.author.id)
        .status === "mining"
    ) {
      return embedError(
        "Vous êtes déjà en train de miner, terminez votre session de minage pour en relancer une nouvelle",
        message.channel
      );
    }

    let mined = 0;
    let today = message.editedTimestamp || message.createdTimestamp;
    var time = moment(today).format("hh:mm:ss");

    let minerais = [
      "<:amethyste:939197156059906209> Améthyste: 0",
      "<:titane:939197157922209822> Titane: 0",
      "<:paladium:939197157725061260> Paladium: 0",
      "<:findium:939197156273815612> Findium: 0",
      "<:trixium:877851448124264458> Trixium: 0",
    ];

    let MinageEmbed = {
      author: { name: "🧱 | Séance de minage" },
      color: "#808080",
      footer: {
        text: message.author.username + " en minage",
        icon_url: message.author.avatarURL(),
      },
      timestamp: new Date(),
      fields: [
        { name: "Blocks minés:", value: 0, inline: true },
        { name: "Heure de départ:", value: 0, inline: true },
      ],
      description:
        `
      __**Inventaire :**__\n` + minerais.join("\n"),
      thumbnail: { url: message.author.avatarURL() },
    };

    message.channel.send({ embed: MinageEmbed }).then((m) => {
      players = db.get("adventure.players");
      index = players.indexOf(players.find((p) => p.id === message.author.id));
      players[index].mining.message = m;
      players[index].mining.startedDate = today;
      console.log(today);
      players[index].status = "mining";
      db.set("adventure.players", players);
      mining(message.channel, message.author);
      m.react("📛").then((r) => {
        const collector = m.createReactionCollector(
          (reaction, user) =>
            ["📛"].includes(reaction.emoji.name) &&
            user.id === players[index].id,
          { time: 60000 * 60 }
        );

        collector.on("collect", async (reaction, user) => {
          reaction.users.remove(user.id);
          if (reaction.emoji.name === "📛") {
            reaction.message.reactions.removeAll();
            players = db.get("adventure.players");
            players[index].status = "idle";
            index = players.indexOf(
              players.find((p) => p.id === message.author.id)
            );
            players[index].mining = {
              message: null,
              startedDate: null,
              mined_block: 0,
            };
            db.set("adventure.players", players);
            m.edit({ content: "⌛ Minage terminé" });
          }
        });

        collector.on("end", async (reaction) => {
          reaction.message.reactions.removeAll();
          players = db.get("adventure.players");
          players[index].status = "idle";
          index = players.indexOf(
            players.find((p) => p.id === message.author.id)
          );
          players[index].mining = {
            message: null,
            startedDate: null,
            mined_block: 0,
          };
          db.set("adventure.players", players);
          return m.edit({ content: "⌛ Minage terminé" });
        });
      });
    });
  },
};
