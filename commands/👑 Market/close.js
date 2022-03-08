const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "close",
  category: "👑 Market",
  aliases: [],
  cooldown: 7,
  usage: "close",
  description: "Permet de fermer un ticket",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: (client, message, prefix) => {
    const db = require("quick.db");

    if (message.channel.name.startsWith("cmd-")) {
      message.channel.delete();
    } else return console.log("Pas le bon channel");

    let guild = message.guild;
    let name = message.channel.name.replace(/cmd-/g, "");
    let tuser = message.channel.topic;
    let user = message.guild.members.cache.find((u) => u.id === tuser);
    db.set(user.id + ".ticketnbr", false);

    let author_id = message.author.id;
    if (!user) return console.log("Pas d'user");
    if (db.get(message.guild.id + "-" + user.id + "-avis.avisuser") === true)
      return;

    let ReviewEmbed = new Discord.MessageEmbed()
      .setAuthor("<Avis Client>")
      .setDescription(
        "Nous avons besoin de votre avis !\nChoisisez la note du serveur `" +
          guild.name +
          "`."
      )
      .setThumbnail(guild.iconURL());

    user.send(ReviewEmbed).then((m) => {
      m.react("1️⃣");
      m.react("2️⃣");
      m.react("3️⃣");
      m.react("4️⃣");
      m.react("5️⃣");

      const collector = m.createReactionCollector(
        (reaction, user) =>
          ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name) &&
          user.id === author_id,
        { time: 120000 }
      );

      collector.on("collect", async (reaction) => {
        //reaction.users.remove(author_id)
        let avis = 0;
        if (reaction.emoji.name === "1️⃣") {
          db.push(guild.id + ".avis", 1);
          avis = 1;
        }
        if (reaction.emoji.name === "2️⃣") {
          db.push(guild.id + ".avis", 2);
          avis = 2;
        }
        if (reaction.emoji.name === "3️⃣") {
          db.push(guild.id + ".avis", 3);
          avis = 3;
        }
        if (reaction.emoji.name === "4️⃣") {
          db.push(guild.id + ".avis", 4);
          avis = 4;
        }
        if (reaction.emoji.name === "5️⃣") {
          db.push(guild.id + ".avis", 5);
          avis = 5;
        }
        let stars = "Votre notation : ";
        for (i = 0; i < avis; i++) {
          stars = stars + "⭐";
        }
        m.delete().then((e) => {
          user.send("📬 Votre avis a bien été pris en compte.\n" + stars);
          db.set(guild.id + "-" + user.id + "-avis.avisuser", true);
        });
      });
    });
  },
};
