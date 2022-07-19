const config = require("../../botconfig/config.json");
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const { embedError, RandomMine } = require("../../handlers/functions.js");
const moment = require("moment");
const sleep = require("atomic-sleep");

module.exports = async (client, channel, user) => {
  if (
    !db.get("adventure.players") ||
    !db.get("adventure.players").find((p) => p.id === user.id) ||
    !db.get("adventure.players").find((p) => p.id === user.id).status ===
    "mining"
  ) {
    return;
  }

  let author = client.users.cache.get(user.id);
  if (
    db.get("adventure.players").find((p) => p.id === user.id).mining.message ==
    null
  )
    return;
  let message = await channel.messages
    .fetch(
      db.get("adventure.players").find((p) => p.id === user.id).mining.message
        .id
    )
    .catch(() => {
      players = db.get("adventure.players");
      index = players.indexOf(players.find((p) => p.id === user.id));
      players[index].mining = {
        message: null,
        startedDate: null,
        mined_block: 0,
      };
      return db.set("adventure.players", players);
    });
  if (!message) {
    return embedError("Veuillez miner dans le bon channel", channel);
  }
  let mining = db.get("adventure.players").find((p) => p.id === user.id).mining
    .mined_block;

  let date = db.get("adventure.players").find((p) => p.id === user.id).mining
    .startedDate;

  if (!message.channel || channel.id !== message.channel.id) {
    players = db.get("adventure.players");
    index = players.indexOf(players.find((p) => p.id === user.id));
    players[index].mining = {
      message: null,
      startedDate: null,
      mined_block: 0,
    };
    return db.set("adventure.players", players);
  }

  while (author.typingIn(message.channel)) {
    let current = db.get(`adventure.players`)
    current.find((p) => p.id === user.id).last_command_time = new Date();
    db.set(`adventure.players`, current)
    var dura = moment.duration(Date.now() - date);
    let time = `\`${dura.hours()}h, ${dura.minutes()}m et ${dura.seconds()}s\``;
    if (dura.hours() >= 1) {
      message.delete();
      message.edit("⌛ Minage terminé");
      players = db.get("adventure.players");
      index = players.indexOf(players.find((p) => p.id === user.id));
      players[index].status = "idle";
      players[index].mining = {
        message: null,
        startedDate: null,
        mined_block: 0,
      };
      return db.set("adventure.players", players);
    }
    let ore = RandomMine(500);
    mining += ore.multiplieur;

    players = db.get("adventure.players");
    index = players.indexOf(players.find((p) => p.id === user.id));
    if (ore.name !== "stone")
      players[index].inventory[ore.name] += ore.multiplieur;
    db.set("adventure.players", players);

    let player = players.find((p) => p.id === user.id);

    let minerais = [
      "<:amethyste:939197156059906209> Améthyste: " +
      (player.inventory.amethyste == undefined
        ? "0"
        : player.inventory.amethyste),
      "<:titane:939197157922209822> Titane: " +
      (player.inventory.titane == undefined ? "0" : player.inventory.titane),
      "<:paladium:939197157725061260> Paladium: " +
      (player.inventory.paladium == undefined
        ? "0"
        : player.inventory.paladium),
      "<:findium:939197156273815612> Findium: " +
      (player.inventory.findium == undefined
        ? "0"
        : player.inventory.findium),
      "<:trixium:877851448124264458> Trixium: " +
      (player.inventory.trixium == undefined
        ? "0"
        : player.inventory.trixium),
    ];

    let MinageEmbed = {
      author: { name: "🧱 | Séance de minage" },
      color: "#808080",
      footer: {
        text: author.username + " en minage",
        icon_url: author.avatarURL(),
      },
      timestamp: new Date(),
      fields: [
        {
          name: "Vient de miner:",
          value: ore.name + " (`x" + ore.multiplieur + "`)",
          inline: true,
        },
        { name: "Blocks minés:", value: mining, inline: true },
        { name: "Temps écoulé:", value: time, inline: true },
      ],
      description:
        `
      __**Inventaire :**__\n` + minerais.join("\n"),
    };

    if (ore.name === "stone") {
      MinageEmbed.thumbnail = {
        url:
          "https://cdn.discordapp.com/attachments/693180184366415905/884061475600207913/stone.png",
      };
    } else if (ore.name === "gravel") {
      MinageEmbed.thumbnail = {
        url:
          "https://cdn.discordapp.com/attachments/693180184366415905/884063239028232222/gravel.png",
      };
    } else if (ore.name === " paladium") {
      MinageEmbed.thumbnail = {
        url:
          "https://cdn.discordapp.com/attachments/693180184366415905/884061472525795328/paladium.png",
      };
    } else if (ore.name === "findium") {
      MinageEmbed.thumbnail = {
        url:
          "https://cdn.discordapp.com/attachments/693180184366415905/884061479802929192/findium.png",
      };
    } else if (ore.name === "trixium") {
      MinageEmbed.thumbnail = {
        url: "https://classement.paladium-pvp.fr/_nuxt/img/ore.0859cff.png",
      };
    } else if (ore.name === "amethyste") {
      MinageEmbed.thumbnail = {
        url:
          "https://cdn.discordapp.com/attachments/693180184366415905/884063143502966784/amethyste.png",
      };
    } else if (ore.name === "titane") {
      MinageEmbed.thumbnail = {
        url:
          "https://cdn.discordapp.com/attachments/693180184366415905/884061476992725022/titane.png",
      };
    }

    try {
      await message.edit({ embed: MinageEmbed });
    } catch (error) {
      players = db.get("adventure.players");
      index = players.indexOf(players.find((p) => p.id === user.id));
      players[index].mining = {
        message: null,
        startedDate: null,
        mined_block: 0,
      };
      return db.set("adventure.players", players);
    }
    players = db.get("adventure.players");
    index = players.indexOf(players.find((p) => p.id === user.id));
    players[index].mining.mined_block = mining;
    db.set("adventure.players", players);

    sleep(1000);
  }
};
