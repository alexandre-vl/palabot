const { MessageEmbed, GuildMember, User } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { delay, embedError } = require("../../handlers/functions.js");
module.exports = {
  name: "arena",
  category: "Adventure",
  aliases: ["pvp", "duel"],
  cooldown: 1,
  usage: "arena @user",
  description: "Challenge a user.",
  run: async (client, message, args, user, text, prefix) => {
    try {
      let opponent = message.mentions.members.first();
      if (!opponent)
        return message.channel.send("Veuillez mentionner un utilisateur.");
      let user = message.author;
      if (opponent.id === message.author.id)
        return message.channel.send("Vous ne pouvez pas vous mentionnez.");

      let current = db.get(`adventure.players`)
      current.find((p) => p.id === message.author.id).last_command_time = new Date();
      current.find((p) => p.id === message.author.id).status = "in combat";
      db.set(`adventure.players`, current)

      let events = [
        "clic",
        "espace",
        "droite",
        "gauche",
        "arrière",
        "avant",
        "potion",
        "pomme",
        "parer",
        "tirer",
      ];

      async function verify(channel, user) {
        const filter = (res) => {
          const value = res.content.toLowerCase();
          return user ? res.author.id === user.id : true;
        };
        const verify = await channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
        });
        if (!verify.size) return 0;
        const choice = verify.first().content.toLowerCase();
        if (choice === "oui") return true;
        if (choice === "non") return false;
        return false;
      }
      function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      await message.channel.send(
        `${opponent}, acceptes-tu le duel (oui|non) ?`
      );
      const verification = await verify(message.channel, opponent);
      if (!verification) {
        return message.reply("Il semble avoir décliné ton offre ...");
      }

      let lives = 20;
      let _opponent = {
        id: opponent.user.id,
        combo: 0,
        life: lives,
        points: 0,
      };
      let _user = {
        id: message.author.id,
        combo: 0,
        life: lives,
        points: 0,
      };

      let combo = {
        name: "Il n'y a pas de combo.",
        id: "",
        multi: 0,
      };

      let PVPembed;

      PVPembed = new MessageEmbed()
        .setImage(
          "https://cdn.tebex.io/store/355206/templates/98424/assets/6c1e2fe9c56883a6cf637b1d1e43b962c042be68.png"
        )
        .setAuthor("PVP Arena")
        .setColor("#808080")
        .setTitle(`${opponent.user.username} VS ${message.author.username}`)
        .setDescription("Un combat intense va avoir lieu.")
        .addField("Statut:", "En préparation...")
        .setTimestamp()
        .setFooter(
          "Partie lancée par " + message.author.username,
          message.author.avatarURL()
        );

      let Message;

      await message.channel.send(PVPembed).then((mess) => (Message = mess));

      await delay(2000);

      while (_opponent.life > 0 || _user.life > 0) {
        PVPembed = new MessageEmbed()
          .setImage(
            "https://cdn.tebex.io/store/355206/templates/98424/assets/6c1e2fe9c56883a6cf637b1d1e43b962c042be68.png"
          )
          .setAuthor("PVP Arena")
          .setColor("#0000ff")
          .setTitle(`${opponent.user.username} VS ${message.author.username}`)
          .addFields([
            {
              name: opponent.user.username,
              value: `${_opponent.life}❤️ \nPoints: ${_opponent.points}`,
              inline: true,
            },
            {
              name: message.author.username,
              value: `${_user.life}❤️ \nPoints: ${_user.points}`,
              inline: true,
            },
          ])
          .addField("Statut:", "Préparez-vous ...")
          .setTimestamp()
          .setFooter(
            "Partie lancée par " + message.author.username,
            message.author.avatarURL()
          );

        if (combo.name === "Il n'y a pas de combo.") {
          PVPembed.setDescription(combo.name);
        } else {
          PVPembed.setDescription(
            "Combo x" + combo.multi + " de " + combo.name
          );
        }

        await Message.edit(PVPembed);

        delay(randomRange(1000, 12000));
        let event = events[Math.floor(Math.random() * events.length)];
        PVPembed = new MessageEmbed()
          .setImage(
            "https://cdn.tebex.io/store/355206/templates/98424/assets/6c1e2fe9c56883a6cf637b1d1e43b962c042be68.png"
          )
          .setAuthor("PVP Arena")
          .setColor("#ff0006")
          .setTitle(`${opponent.user.username} VS ${message.author.username}`)
          .addFields([
            {
              name: opponent.user.username,
              value: `${_opponent.life}❤️ \nPoints: ${_opponent.points}`,
              inline: true,
            },
            {
              name: message.author.username,
              value: `${_user.life}❤️ \nPoints: ${_user.points}`,
              inline: true,
            },
          ])
          .addField("Statut:", `Tapez \`${event.toUpperCase()}\` maintenant !`)
          .setTimestamp()
          .setFooter(
            "Partie lancée par " + message.author.username,
            message.author.avatarURL()
          );

        combo.name === "Il n'y a pas de combo."
          ? PVPembed.setDescription(combo.name)
          : PVPembed.setDescription(
              "Combo X" + combo.multi + " de " + combo.name
            );

        await Message.edit(PVPembed);
        const filter = (res) =>
          [opponent.id, message.author.id].includes(res.author.id) &&
          res.content.toLowerCase() === event;
        const winner = await message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
        });

        PVPembed = new MessageEmbed()
          .setImage(
            "https://cdn.tebex.io/store/355206/templates/98424/assets/6c1e2fe9c56883a6cf637b1d1e43b962c042be68.png"
          )
          .setAuthor("PVP Arena")
          .setColor("#00ff00")
          .setTitle(`${opponent.user.username} VS ${message.author.username}`)
          .setTimestamp()
          .setFooter(
            "Partie lancée par " + message.author.username,
            message.author.avatarURL()
          );

        if (!winner.size) {
          PVPembed.addField(
            "Statut:",
            "Hmmm ... Aucun de vous deux n'a décroché la victoire ..."
          );
          combo.name = "Il n'y a pas de combo.";
          combo.multi = 0;
          PVPembed.addFields([
            {
              name: opponent.user.username,
              value: `${_opponent.life}❤️ \nPoints: ${_opponent.points}`,
              inline: true,
            },
            {
              name: message.author.username,
              value: `${_user.life}❤️ \nPoints: ${_user.points}`,
              inline: true,
            },
          ]);
        } else {
          if (combo.name === "Il n'y a pas de combo.") {
            combo.name = winner.first().author.username;
            combo.id = winner.first().author.id;
            combo.multi += 1;
          } else {
            if (combo.id === winner.first().author.id) {
              combo.multi += 1;
            } else {
              combo.name = winner.first().author.username;
              combo.id = winner.first().author.id;
              combo.multi = 1;
            }
          }

          // TODO: ajouter un event spécial pour "parer": 
          //  si le premier "clic" et le deuxième "pare"  
          //    => avec un petit délai, personne ne perd des points de vie; avec un grand délai, le deuxième perd des points de vie
          //  si le premier "pare" et le deuxième "clic" avec un petit ou grand délai
          //    => personne ne perd des points de vie
          // si le premier "clic" et le deuxième "clic" avec un petit ou grand délai
          //    => le deuxième perd des points de viens
          // si les deux parent
          //    => personne ne perd de points de vie
          if (winner.first().author.id === _opponent.id) {
            if (event === "pomme") {
              _opponent.life += 3;
            }
            if (event === "tirer") {
              _user.life -= 3;
            }
            if (event === "potion") {
              _opponent.life += 2;
            } else {
              _user.life -= 1;
            }
            _opponent.points += event.length * combo.multi;
          } else {
            if (event === "pomme") {
              _user.life += 3;
            }
            if (event === "tirer") {
              _opponent.life -= 3;
            }
            if (event === "potion") {
              _user.life += 2;
            } else {
              _opponent.life -= 1;
            }
            _user.points += event.length * combo.multi;
          }
          PVPembed.addFields([
            {
              name: opponent.user.username,
              value: `${_opponent.life}❤️ \nPoints: ${_opponent.points}`,
              inline: true,
            },
            {
              name: message.author.username,
              value: `${_user.life}❤️ \nPoints: ${_user.points}`,
              inline: true,
            },
          ]);

          PVPembed.addField(
            "Statut:",
            `Le gagnant est ... ${winner.first().author}`
          );

          if (combo.name === "Il n'y a pas de combo.") {
            PVPembed.setDescription(combo.name);
          } else {
            PVPembed.setDescription(
              "Combo X" + combo.multi + " de " + combo.name
            );
          }

          await Message.edit(PVPembed);
          await delay(2000);

          if (combo.multi == 0) {
            PVPembed.setDescription(combo.name);
          } else {
            PVPembed.setDescription(
              "Combo X" + combo.multi + " de " + combo.name
            );
          }
        }
        await Message.edit(PVPembed);
        await delay(2000);

        if (_opponent.life < 1 || _user.life < 1) {
          break;
        }
      }

      let greatWinner = {
        life: Number,
        member: GuildMember || User,
        image: String,
        points: Number,
      };

      if (_user.life == 0) {
        greatWinner.member = opponent.user.username;
        (greatWinner.life = _opponent.life),
          (greatWinner.image = opponent.user.avatarURL());
        greatWinner.points = _opponent.points + _opponent.life * 5;
      } else {
        greatWinner.member = user.username;
        greatWinner.life = _user.life;
        greatWinner.image = user.avatarURL();
        greatWinner.points = _user.points + _user.life * 5;
      }

      PVPembed = new MessageEmbed()
        .setThumbnail(greatWinner.image)
        .setAuthor("PVP Arena")
        .setColor("#ffff00")
        .setDescription(
          `Un combat acharné a eu lieu entre ${opponent.user.username} et ${user.username}. Mais ${greatWinner.member} en sort vainqueur avec ${greatWinner.life}❤️.`
        )
        .setFooter(
          "Partie lancée par " + message.author.username,
          message.author.avatarURL()
        )
        .setTitle(`${greatWinner.member}: ${greatWinner.points}🏆`)
        .setTimestamp();

      await Message.edit(PVPembed);

      let players = db.get("adventure.players")
      players.find((p) => p.id === message.author.id).last_command_time = new Date();
      current.find((p) => p.id === message.author.id).status = "idle";
      db.set("adventure.players", players)
    } catch (e) {
      embedError("```"+e+"```", message.channel)
      return console.log(e);
    }
  },
};
