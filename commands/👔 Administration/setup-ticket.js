const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "setup-ticket",
  category: "👔 Administration",
  aliases: [],
  cooldown: 7,
  usage: "setup-ticket",
  description: "Permet de setup le système de commandes pour les markets",
  memberpermissions: ["ADMINISTRATOR"],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, plusArgs, cmdUser, text, prefix) => {
    const db = require("quick.db");
    const args = message.content.substring(prefix.length).split(" ");
    const setup = new Discord.MessageEmbed();
    let filter = (m) => m.author.id === message.author.id;
    message.channel
      .send(
        "Veuillez mentionner le salon des commandes. Lors d'un message dans ce dernier, un ticket sera créer pour que le joueur puisse passer sa commande. "
      )
      .then((m) => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"],
          })
          .then((message) => {
            message = message.first();
            channel = message.mentions.channels.first();
            if (channel) {
              m.delete();
              db.set(message.guild.id + ".cmdschannel", channel.id);
              message.channel
                .send(
                  "Salon enregistré ! Maintenant, veuillez préciser le rôle des vendeurs pour leur donner accès aux commandes des joueurs."
                )
                .then((m) => {
                  message.channel
                    .awaitMessages(filter, {
                      max: 1,
                      time: 30000,
                      errors: ["time"],
                    })
                    .then((message) => {
                      message = message.first();
                      role = message.mentions.roles.first();
                      if (role) {
                        m.delete();
                        db.set(message.guild.id + ".staffrole", role.id);
                        message.channel
                          .send(
                            "Role enregistré ! Enfin, veuillez préciser l'ID de la catégorie des tickets."
                          )
                          .then((m) => {
                            message.channel
                              .awaitMessages(filter, {
                                max: 1,
                                time: 30000,
                                errors: ["time"],
                              })
                              .then((message) => {
                                message = message.first();
                                let category =
                                  message.guild.channels.cache.find(
                                    (c) =>
                                      c.name == message.content &&
                                      c.type == "category"
                                  ) ||
                                  message.guild.channels.cache.find(
                                    (c) =>
                                      c.id == message.content &&
                                      c.type == "category"
                                  );
                                if (category) {
                                  m.delete();
                                  db.set(
                                    message.guild.id + ".catID",
                                    category.id
                                  );
                                  db.set(message.guild.id + ".setup", "done");
                                  message.channel.send(
                                    "Le système de commande est maintenant oppérationnel !"
                                  );
                                } else {
                                  message.channel.send(
                                    `Catégorie invalide, merci de refaire la commande.`
                                  );
                                }
                              })
                              .catch((collected) => {
                                message.channel.send(
                                  "Vous avez pris trop de temps !"
                                );
                              });
                          });
                      } else {
                        message.channel.send(
                          `Role invalide, merci de refaire la commande.`
                        );
                      }
                    })
                    .catch((collected) => {
                      message.channel.send("Vous avez pris trop de temps !");
                    });
                });
            } else {
              message.channel.send(
                `Salon invalide, merci de refaire la commande.`
              );
            }
          })

          .catch((collected) => {
            message.channel.send("Vous avez pris trop de temps !");
          });
      });
  },
};
