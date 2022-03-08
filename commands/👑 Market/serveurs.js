const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "serveurs",
  category: "👑 Market",
  aliases: ["srv", "srvs", "serveur"],
  cooldown: 7,
  usage: "serveurs [avis/membres]",
  description:
    "Permet d'afficher le classement des serveurs par avis ou par membres",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: (client, message, prefix) => {
    const db = require("quick.db");
    let args = message.content.substring(prefix.length).split(" ");

    let command = args.shift();

    if (args[0] === "membres") {
      let embed = new Discord.MessageEmbed()
        .setTitle("🏆 | TOP 10")
        .setFooter("© PalaBot 2021 • Created By Xvirus9")
        .setColor("#EC5922");
      let server_list = [];
      var NbrMembers = [];

      client.guilds.cache.forEach((element) => {
        server_list.push({
          name: element.name,
          memberCount: element.memberCount,
          icon: element.iconURL(),
        });
        NbrMembers.push(element.memberCount);
      });

      NbrMembers.sort(function (a, b) {
        return a - b;
      });
      NbrMembers.reverse();

      let ie = 0;
      NbrMembers.forEach((nbr) => {
        ie++;
        if (ie < 11) {
          client.guilds.cache.forEach((srv) => {
            if (srv.memberCount === nbr) {
              embed.addField(
                "N°" +
                  ie +
                  " <:paladium_chestplate:877198847217135666> " +
                  srv.name,
                " `" + srv.memberCount + " membres`",
                false
              );
            }
          });
        }
      });
      message.channel.send(embed);
      return;
    }
    if (args[0] === "avis") {
      let embed = new Discord.MessageEmbed()
        .setTitle("🏆 | TOP 10")
        .setFooter("© PalaBot 2021 • Created By Xvirus9")
        .setColor("#EC5922");
      let server_list = [];
      let NbrAvis = [];

      client.guilds.cache.forEach((element) => {
        server_list.push({
          name: element.name,
          memberCount: element.memberCount,
          icon: element.iconURL(),
        });
        if (!db.get(element.id + ".avis")) return NbrAvis.push(0);
        NbrAvis.push(db.get(element.id + ".avis").length);
      });

      NbrAvis.sort(function (a, b) {
        return a - b;
      });
      NbrAvis.reverse();

      let ie = 0;
      let verif = [];
      NbrAvis.forEach((nbr) => {
        stop = false;
        ie++;
        if (ie < 11) {
          client.guilds.cache.forEach((srv) => {
            if (nbr === 0) return;
            if (!db.get(srv.id + ".avis")) return;

            len = db.get(srv.id + ".avis").length;
            if (len === nbr) {
              if (verif.includes(srv.id)) return;

              let stars = "";
              let avg;
              notes = db.get(srv.id + ".avis");
              if (!notes) notes = [];
              let total = 0;
              for (let i = 0; i < notes.length; i++) {
                total += notes[i];
              }
              if (notes.length == 0) avg = "Aucun avis";
              else avg = total / notes.length;
              if (avg !== "Aucun avis") {
                let nbr = Math.ceil(total / notes.length);

                for (i = 0; i < nbr; i++) {
                  stars = stars + ":star:";
                }
                avg = stars;
              }
              verif.push(srv.id);
              return embed.addField(
                "N°" +
                  ie +
                  " <:paladium_chestplate:877198847217135666> " +
                  srv.name,
                avg + " `(" + notes.length + " avis)`",
                false
              );
            }
          });
        }
      });
      message.channel.send(embed);
      return;
    }

    message.channel.send(
      "Veuillez préciser : `avis` ou `membres` après la commande"
    );
  },
};
