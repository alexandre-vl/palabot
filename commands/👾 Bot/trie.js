const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const listitems = require("../../botconfig/items.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "trie",
  category: "👑 Market",
  aliases: [],
  cooldown: 0,
  usage: "additem <quantité> <prix> <item>",
  description: "Permet d'ajouter un item au market inter-serveurs",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: async (client, message, prefix) => {
    const db = require("quick.db");

    let args = message.content.substring(prefix.length).split(" ");
    let args1 = message.content.split(" ").slice(3).join(" ");
    let items = db.get(`bot.items`);
    let itemsnbrs = db.get(message.author.id + ".itemsbnr");
    let newitems = Object.entries(items);
    var result = listitems.items;

    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

    let lastid = newitems.length;
    let author_id = message.author.id;
    const add = new Discord.MessageEmbed()
      .setColor("EC5922")
      .setTitle("🔎 | Trieur");
    message.channel.send(add).then(async (m) => {
      await m.react("🎍");
      await m.react("⚔");
      await m.react("🧨");
      await m.react("🏠");
      await m.react("〰");

      for (i = 0; i < result.length; i++) {
        await add.setDescription("Item : `" + result[i] + "`");
        await m.edit(add).then(async (m) => {
          const collector = m.createReactionCollector(
            (reaction, user) => user === user,
            { time: 120000 }
          );

          await collector.on("collect", (reaction) => {
            reaction.users.remove(author_id);
            switch (reaction.emoji.name) {
              case "🎍":
                if (!db.get("catitems.deco")) db.set("catitems.deco", []);
                db.push("catitems.deco", result[i]);
              case "⚔":
                if (!db.get("catitems.pvp")) db.set("catitems.pvp", []);
                db.push("catitems.pvp", result[i]);
              case "🧨":
                if (!db.get("catitems.pillage")) db.set("catitems.pillage", []);
                db.push("catitems.pillage", result[i]);
              case "🏠":
                if (!db.get("catitems.bc")) db.set("catitems.bc", []);
                db.push("catitems.bc", result[i]);
              case "〰":
                if (!db.get("catitems.autres")) db.set("catitems.autres", []);
                db.push("catitems.autres", result[i]);
            }
          });
        });
        await sleep(4000);
      }
    });
  },
};
