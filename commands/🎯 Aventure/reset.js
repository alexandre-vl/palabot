const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const { embedError } = require("../../handlers/functions.js");

module.exports = {
  name: "reset",
  category: "🎯 Aventure",
  aliases: [],
  cooldown: 5,
  usage: "reset",
  description: "Réinitialise l'aventure",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    if (
      db.get("adventure.players") &&
      db.get("adventure.players").find((p) => p.id === message.author.id)
    ) {
      message.channel
        .send({
          embed: {
            description:
              "`⛔` Etes-vous sur de vraiment vouloir recommencer l'aventure de zero ?",
            color: "EC5922",
          },
        })
        .then(async (m) => {
          await m.react("✅");
          await m.react("❌").then((r) => {
            const collector = m.createReactionCollector(
              (reaction, user) =>
                ["✅", "❌"].includes(reaction.emoji.name) &&
                user.id === message.author.id,
              { time: 120000 }
            );

            collector.on("collect", async (reaction) => {
              m.delete();
              switch (reaction.emoji.name) {
                case "✅":
                  let players = db.get("adventure.players");
                  players.splice(
                    players.indexOf(
                      players.find((p) => p.id === message.author.id)
                    ),
                    1
                  );
                  db.set("adventure.players", players);
                  message.channel.send({
                    embed: {
                      author: { name: "🎉 De retour de l'aventure !" },
                      description:
                        "Tu viens de remettre à zero ton aventure, de nouvelles base, une nouvelle aventure s'ouvre à toi",
                      color: "EC5922",
                    },
                  });
                  break;
              }
            });
          });
        });
    } else {
      return embedError(
        "Vous n'êtes pas inscrit dans l'aventure",
        message.channel
      );
    }
  },
};
