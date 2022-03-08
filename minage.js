const Discord = require("discord.js");
const db = require("quick.db");
const notifier = require("node-notifier");
const Minesweeper = require("discord.js-minesweeper");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
let prefix = "§";
let adventure = new db.table("adventure");
let playersmining = [];

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RandomMine(chance) {
  let table = [
    { name: "stone", chance: 61 / 100 },
    { name: "améthyste", chance: 13 / 100, size: 6 },
    { name: "titane", chance: 10 / 100, size: 5 },
    { name: "gravel", chance: 8 / 100, size: 8 },
    { name: "paladium", chance: 5 / 100, size: 4 },
    { name: "trixium", chance: 2 / 100, size: 2 },
    { name: "findium", chance: 1 / 100, size: 2 },
  ];
  let rand_purcent = Math.floor(Math.random() * chance + 1) / 100;

  for (let i = 0; i < table.length; i++) {
    if (rand_purcent > table[i].chance) {
      let filon = 1;
      if (table[i].name !== "stone") {
        filon = Math.floor(Math.random() * table[i].size) + 1;
      }
      return {
        num: i,
        name: table[i].name,
        chance: table[i].chance,
        multiplieur: filon,
      };
    }
  }
}

client.on("ready", () => {
  console.log("Hello Shell, logged in as " + client.user.tag + ".");
  adventure.set("bot", { status: "Ready" });
  adventure.set("online", ["Liste des joueurs en ligne."]);
  // Object
  notifier.notify({
    title: client.user.username,
    message: "Hello Shell, logged in as " + client.user.tag + ".",
    icon: client.user.avatarURL(),
  });
});

client.on("message", async (message) => {
  if (!message.guild) return;
  if (message.content.startsWith(prefix + "adventure")) {
    let args = message.content.split(" ");
    let command = args.shift();
    /*\
              =List of commands=
        [~~~~~~~~~~~~~~~~~~~~~~~~~~~]
          +Commandes de déroulement+
        -adventure start
        -    "     restart
        -    "     quit
        -    "     continue
        [~~~~~~~~~~~~~~~~~~~~~~~~~~~]
                -Commandes IG-
        -    "     tab
        -    "     minage
        -    "     arena
        -    "     faction
        -    "     inventory
        -    "     craft
        [~~~~~~~~~~~~~~~~~~~~~~~~~~~]
             -Commandes Minages-
        -minage quit
        -   "   bin
        -   "   level
        -   "   pickaxe
        [~~~~~~~~~~~~~~~~~~~~~~~~~~~]
             -Commandes Arena-
        - arena stats
        - 
                    \*/
    if (args[0] === "start") {
      console.log("START");
      let onlines = adventure.get("online");
      if (onlines.includes(message.author.id))
        return message.reply("Vous êtes déja en ligne.");
      adventure.push("online", message.author.id);
      message.reply("Bienvenue dans l'aventure !");
      adventure.set(message.author.id, { status: "started" });
    }
    if (args[0] === "restart") {
      console.log("RESTART");
      message.channel
        .send("Êtes vous sûr de vouloir recommencer l'aventure ?")
        .then(async (m) => {
          await m.react("✅").then(console.log("CHECK"));
          await m.react("❌").then(console.log("CROIX"));

          const filter = (reaction, user) =>
            ["✅", "❌"].includes(reaction.emoji.name) &&
            user.id === message.author.id;

          const collector = m.createReactionCollector({ filter, time: 15000 });

          collector.on("collect", async (reaction) => {
            if (reaction.user.bot) return;
            console.log(reaction.emoji.name);
            if (reaction.emoji.name === "✅") {
              adventure.delete(message.author.id);
              adventure.set(message.author.id, { status: "restarted" });
              m.delete();
              message.channel.send("Votre avancement a été réinitialisé.");
            }
            if (reaction.emoji.name === "❌") {
              m.delete();
              message.reply("La commande a été annulé.");
            }
            return;
          });
        });
    }
    if (args[0] === "continue") {
      console.log("CONTINUE");
      let onlines = adventure.get("online");
      if (onlines.length > 1) {
        if (onlines.includes(message.author.id))
          return message.reply("Vous êtes déja en ligne.");
      }
      if (onlines.length === 1) {
        if (onlines[0] === message.author.id)
          return message.reply("Vous êtes déja en ligne.");
      }
      adventure.push("online", message.author.id);
      message.channel.send("Bon retour.");
      adventure.set(message.author.id, { status: "continued" });
    }
    if (args[0] === "quit") {
      console.log("QUIT");
      let online_player = adventure.get("online");
      if (!online_player.includes(message.author.id))
        return message.reply("Vous êtes déja parti du jeu.");
      let sub_player_ind = online_player.indexOf(message.author.id);
      let new_online = online_player.splice(sub_player_ind, 1);
      adventure.set("online", online_player);
      adventure.set(message.author.id, { status: "offline" });
    }
    //Commandes IG
    if (args[0] === "tab") {
      console.log("TAB");
      let onlines = adventure.get("online");
      if (!onlines.includes(message.author.id))
        return message.reply("Vous n'êtes pas en jeu.");
      else {
        let embed = new Discord.MessageEmbed().setTitle(onlines.shift());

        onlines.forEach((element) => {
          let userNAME = client.users.cache.find((user) => user.id === element);
          embed.addField(userNAME.username, adventure.get(element + ".status"));
        });
        message.channel.send(embed);
      }
    }
    if (args[0] === "help") {
      let embed = new Discord.MessageEmbed()
        .setTitle("Liste des commandes pour l'Aventure !")
        .setColor("#ff0000")
        .addField("`tab`", "Liste des jouers en-ligne.")
        .addField("`continue`", "Continure l'aventure.")
        .addField("`start`", "Commencer l'aventure")
        .addField("`quit`", "Se déconnecter de l'aventure.")
        .addField("`restart`", "Recommencer l'aventure.");

      message.channel.send(embed);
    }
    if (args[0] === "minage") {
      if (args[1] === "quit") {
        let online_player = adventure.get("online");
        if (!online_player.includes(message.author.id))
          return message.reply("Vous n'êtes pas en ligne.");
        if (!playersmining.includes(message.author.id))
          return message.reply("Vous n'êtes pas en minage...");
        else {
          let playerIndex = playersmining.indexOf(message.author.id);
          console.log(playersmining.splice(playerIndex, 4));
          let index = playersmining.indexOf(message.author.id);
          playersmining.slice(index, index + 3);
          console.log(playersmining);
          return message.channel.send("Vous vous êtes déconnecté du minage.");
        }
      }
      let online_player = adventure.get("online");
      if (!online_player.includes(message.author.id))
        return message.reply("Vous n'êtes pas en ligne.");
      adventure.set(message.author.id + ".status", "mining");
      console.log("MINAGE");
      let mined = 0;

      let today = new Date();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let MinageEmbed = new Discord.MessageEmbed()
        .setAuthor("Séance de minage")
        .setTitle(message.author.username)
        //.setImage("https://cdn.discordapp.com/attachments/693180184366415905/883697609565433866/unknown.png")
        .setColor("#808080")
        .addFields([
          { name: "Vient de miner:", value: "\u200B", inline: true },
          { name: "\u200B", value: "\u200B", inline: true },
          { name: "Heure de départ:", value: time, inline: true },
          { name: "-------------------", value: "\u200B", inline: true },
          { name: "----Inventaire----", value: "\u200B", inline: true },
          { name: "-------------------", value: "\u200B", inline: true },
          { name: "Blocks minés:", value: "0", inline: true },
          { name: "Améthyste minée:", value: "0", inline: true },
          { name: "Titane miné:", value: "0", inline: true },
          { name: "Paladium miné:", value: "0", inline: true },
          { name: "Findium miné:", value: "0", inline: true },
          { name: "Trixium miné:", value: "0", inline: true },
        ])
        .setDescription("=======================================")
        .setFooter(
          message.author.username + " en minage depuis",
          message.author.avatarURL()
        )
        .setTimestamp()
        .setThumbnail(message.author.avatarURL());

      message.channel.send(MinageEmbed).then(async (m) => {
        playersmining.push(message.author.id);
        playersmining.push(m);
        playersmining.push(0);
        playersmining.push(time);
      });
      console.log(playersmining);
    }
    if (args[0] === "arena") {
      let online_player = adventure.get("online");
      if (!online_player.includes(message.author.id))
        return message.reply("Vous n'êtes pas en ligne.");
      let opponent = message.mentions.members.first();
      let user = message.author;
      if (opponent.id === message.author.id)
        return message.channel.send("Vous ne pouvez pas vous mentionnez.");
      if (!opponent)
        return message.channel.send("Veuillez mentionner un utilisateur.");

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

      PVPembed = new Discord.MessageEmbed()
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

      await sleep(2000);

      while (_opponent.life > 0 || _user.life > 0) {
        PVPembed = new Discord.MessageEmbed()
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
            "Combo X" + combo.multi + " de " + combo.name
          );
        }

        await Message.edit(PVPembed);

        let delay = randomRange(1000, 12000);
        await sleep(delay);
        let event = events[Math.floor(Math.random() * events.length)];
        PVPembed = new Discord.MessageEmbed()
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

        PVPembed = new Discord.MessageEmbed()
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
          await sleep(2000);

          if (combo.multi == 0) {
            PVPembed.setDescription(combo.name);
          } else {
            PVPembed.setDescription(
              "Combo X" + combo.multi + " de " + combo.name
            );
          }
        }
        await Message.edit(PVPembed);
        await sleep(2000);

        if (_opponent.life < 1 || _user.life < 1) {
          break;
        }
      }

      let greatWinner = {
        life: Number,
        member: Discord.GuildMember || Discord.User,
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

      PVPembed = new Discord.MessageEmbed()
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
    }
    if (args[0] === "pillage") {
      let minesweeper = new Minesweeper({
        revealFirstCell: true,
        returnType: "matrix",
      });
      let grid = minesweeper.start();

      let gridB = [];

      for (i = 0; i < 9; i++) {
        let row = [];
        for (j = 0; j < 9; j++) {
          row.push(grid[i][j].split(" ").slice(1, -1));
        }
        gridB.push(row);
      }

      let gridC = [];
      for (i = 0; i < 9; i++) {
        let row = [];
        for (j = 0; j < 9; j++) {
          //row.push(grid[i][j].split(' ').slice(1, -1))
          if (grid[i][j].startsWith("||")) {
            row.push(":black_large_square:");
          } else {
            row.push(grid[i][j].split(" ").slice(1, -1));
          }
        }
        gridC.push(row);
      }

      let types = {
        bomb: ":boom:",
        num: [
          ":zero:",
          ":one:",
          ":two:",
          ":three:",
          ":four:",
          ":five:",
          ":six:",
          ":seven:",
          ":eight:",
          ":nine:",
        ],
      };

      // let gridC = [];
      // for(i = 0; i<9;i++){
      //     let row = []
      //     for(j = 0; j <9; j++){
      //         if(grid[i][j] === types.bomb){
      //             row.push("+")
      //         } else {
      //             row.push(types.num.indexOf(grid[i][j]))
      //         }
      //     }
      //     gridC.push(row)
      // }

      let PillageEmbed = new Discord.MessageEmbed()
        .setAuthor("Pillage")
        .setTitle(message.author.username)
        .setDescription(gridC);

      let Message;
      await message.channel.send(PillageEmbed).then((mess) => (Message = mess));

      // console.log("GRID | "+ grid)
      console.log(gridB);
      // console.log("GRIDC | " + gridC)
      //console.log(minesweeper)

      while (gridB !== gridC) {
        console.log("loop".toUpperCase());
        const filter = (res) => message.author.id === res.author.id;

        await message.channel
          .awaitMessages(filter, { max: 1, time: 30000 })
          .then(async (collected) => {
            let _args = collected.first().content.split("");
            console.log(_args);
            let lettres = "ABCDEFGHI";
            if (_args.length !== 2) {
              message.reply(
                "Vous n'avez pas proposé de coordonnées correctes ! 1"
              );
              console.log("TEST1");
            }
            //if(!Number.isNaN(_args[0]) || Number.isNaN(_args[1])){message.reply("Vous n'avez pas proposé de coordonnées correctes ! 2 "); console.log("TEST2")}
            if (_args[1] > 9) {
              message.reply(
                "Vous n'avez pas proposé de coordonnées correctes ! 3"
              );
              console.log("TEST3");
            }
            if (!lettres.split("").includes(_args[0].toUpperCase())) {
              message.channel.send(
                "Vous n'avez pas proposé de coordonnées correctes ! 4"
              );
              console.log("TEST4");
            } else {
              let index = lettres.split("").indexOf(_args[0].toUpperCase());
              console.log(_args[0] + _args[1]);
              let real = parseInt(_args[1]);
              console.log(real);
              console.log(gridB[_args[0]]);
              let cell = gridB[_args[0]][real][0];
              console.log(cell);
              if (cell === ":boom:") {
                return message.reply("Vous avez perdu.");
              }
              console.log(gridB[_args[0]][real][0]);
              gridC[index].splice(_args[1], 1, gridB[index][_args[1]]);
              let PillageEmbed = new Discord.MessageEmbed()
                .setAuthor("Pillage")
                .setTitle(message.author.username)
                .setDescription(gridC);
              await Message.edit(PillageEmbed);
            }
          })
          .catch((err) => {
            console.log(err);
            message.reply("Vous n'avez pas proposé de coordonnées ! 5 " + err);
          });

        // let collector = message.channel.createMessageCollector(filter, { max: 1, time: 30000 })

        // collector.on('collect', async (m) => {
        //     let _args = m.content.split("")
        //     console.log(`Collected ${m.content}`);
        //     if(_args.length !== 2){m.reply("Vous n'avez pas proposé de coordonnées correctes !")}
        //     //if(!Number.isNaN(_args[0]) || Number.isNaN(_args[1])){message.reply("Vous n'avez pas proposé de coordonnées correctes !")}
        //     else{
        //         if(gridB[_args[0]][_args[1]] === ":boom:")return await m.reply("Vous avez perdu.")

        //         gridC[_args[0]].splice(_args[1], 1, gridB[_args[0]][_args[1]])
        //         let PillageEmbed = new Discord.MessageEmbed()
        //         .setAuthor("Pillage")
        //         .setTitle(message.author.username)
        //         .setDescription(gridC)
        //         await Message.edit(PillageEmbed)
        //     }

        // });

        // collector.on('end', async(collected) => {
        //     console.log(`Collected ${collected.size} items`);
        //     if(collected.size < 1){message.reply("Vous n'avez pas proposé de coordonnées !")}
        // });
      }
    }
  }
});

client.on("typingStart", async (channel, user) => {
  if (!playersmining.includes(user.id)) return;
  else {
    let index = playersmining.indexOf(user.id);
    let author = client.users.cache.find(
      (user) => user.id === playersmining[index]
    );
    let message = playersmining[index + 1];
    let mining = playersmining[index + 2];
    let date = playersmining[index + 3];
    if (!channel === message.channel) return;
    while (author.typingIn(message.channel)) {
      let MinageEmbed = new Discord.MessageEmbed()
        .setAuthor("Séance de minage")
        .setTitle(author.username)
        //.setImage("https://cdn.discordapp.com/attachments/693180184366415905/883697609565433866/unknown.png")
        .setColor("#808080")
        .setFooter(author.username + " en minage", author.avatarURL())
        .setTimestamp();

      sleep(1500);

      let ore = RandomMine(500);
      mining += ore.multiplieur;
      adventure.add(author.id + ".minage." + ore.name, ore.multiplieur);
      MinageEmbed.addFields([
        {
          name: "Vient de miner:",
          value: ore.multiplieur + "x" + ore.name,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        { name: "Heure de départ:", value: date, inline: true },
        { name: "-------------------", value: "\u200B", inline: true },
        { name: "----Inventaire----", value: "\u200B", inline: true },
        { name: "-------------------", value: "\u200B", inline: true },
        { name: "Blocks minés:", value: mining, inline: true },
        {
          name: "Améthyste minée:",
          value:
            adventure.get(author.id + ".minage.améthyste") == undefined
              ? "0"
              : adventure.get(author.id + ".minage.améthyste"),
          inline: true,
        },
        {
          name: "Titane miné:",
          value:
            adventure.get(author.id + ".minage.titane") == undefined
              ? "0"
              : adventure.get(author.id + ".minage.titane"),
          inline: true,
        },
        {
          name: "Paladium miné:",
          value:
            adventure.get(author.id + ".minage.paladium") == undefined
              ? "0"
              : adventure.get(author.id + ".minage.paladium"),
          inline: true,
        },
        {
          name: "Findium miné:",
          value:
            adventure.get(author.id + ".minage.findium") == undefined
              ? "0"
              : adventure.get(author.id + ".minage.findium"),
          inline: true,
        },
        {
          name: "Trixium miné:",
          value:
            adventure.get(author.id + ".minage.trixium") == undefined
              ? "0"
              : adventure.get(author.id + ".minage.trixium"),
          inline: true,
        },
      ]).setDescription("=======================================");

      if (ore.name === "stone") {
        MinageEmbed.setThumbnail(
          "https://cdn.discordapp.com/attachments/693180184366415905/884061475600207913/stone.png"
        );
      } else if (ore.name === "gravel") {
        MinageEmbed.setThumbnail(
          "https://cdn.discordapp.com/attachments/693180184366415905/884063239028232222/gravel.png"
        );
      } else if (ore.name === " paladium") {
        MinageEmbed.setThumbnail(
          "https://cdn.discordapp.com/attachments/693180184366415905/884061472525795328/paladium.png"
        );
      } else if (ore.name === "findium") {
        MinageEmbed.setThumbnail(
          "https://cdn.discordapp.com/attachments/693180184366415905/884061479802929192/findium.png"
        );
      } else if (ore.name === "trixium") {
        MinageEmbed.setThumbnail(
          "https://classement.paladium-pvp.fr/_nuxt/img/ore.0859cff.png"
        );
      } else if (ore.name === "améthyste") {
        MinageEmbed.setThumbnail(
          "https://cdn.discordapp.com/attachments/693180184366415905/884063143502966784/amethyste.png"
        );
      } else if (ore.name === "titane") {
        MinageEmbed.setThumbnail(
          "https://cdn.discordapp.com/attachments/693180184366415905/884061476992725022/titane.png"
        );
      }

      console.log(ore.name);

      await message.edit(MinageEmbed);
      playersmining[index + 2] = mining;
    }
  }
  console.log("ONLINE " + adventure.get("online"));
});

client.login("NjkzMTUyNjE5OTkyMTg2OTgw.Xn46rg.g3cy4uAdUDjSLnYmGZBvMwCHdig");
