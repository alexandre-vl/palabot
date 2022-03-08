const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = {
  name: "market",
  category: "👑 Market",
  aliases: ["hdv", "ah", "shop"],
  cooldown: 7,
  usage: "market [item]",
  description: "Permet d'afficher le market inter-serveurs",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: async (client, message, prefix) => {
    const db = require("quick.db");
    var word_finder = require("close-word");
    const args = message.content.substring(prefix.length).split(" ");
    let author_id = message.author.id;
    let items = db.get(`bot.items`);
    if (items.length < 1)
      return message.channel.send("Le shop ne contient aucun item.");
    let newitems = Object.entries(items);
    let shopicon =
      "https://cdn.discordapp.com/attachments/657878417324113983/873843137817239563/nT0fW4I-.jpg";
    let shopname = "Market Inter-Serveurs";
    let fields = [];
    let el_per_page = 8;
    const argsl = message.content.split(" ").slice(1).join(" ");
    let newitemsname = [];

    if (newitems.length < 1)
      return message.channel.send("Le shop ne contient aucun item.");

    if (argsl) {
      items.forEach((item) => {
        newitemsname.push(item.name);
      });
      var result = word_finder.findClosestOne(argsl, newitemsname);

      let newitems;
      items.forEach((item) => {
        if (item.name === result.word) {
          let authortag = client.users.cache.find(
            (u) => u.id === item.authorID
          );
          if (authortag === undefined) {
            authortag = { tag: "Inconnu" };
          }
          newitems = {
            name: result.word,
            price: item.price,
            author: authortag.tag,
            nbr: item.nbr,
          };
        }
      });

      const add = new Discord.MessageEmbed()
        .setColor("EC5922")
        .setTitle("🔎 | Recherche Market")
        .setDescription("Item trouvé : ")
        .addField(
          "`" + result.word + " (" + newitems.nbr + ")`",
          "Prix : " + newitems.price + "$" + " | `" + newitems.author + "`"
        )
        .setFooter(
          "© PalaBot 2021 • Created By Xvirus9",
          "https://cdn.discordapp.com/attachments/657878417324113983/873843137817239563/nT0fW4I-.jpg"
        );
      message.channel.send(add);
    } else {
      let page_count = Math.ceil(newitems.length / el_per_page);
      function createshopembed(page_number) {
        fields = [];

        let first_element = 0;
        if (page_number > 0) first_element = el_per_page * page_number;
        let last_element = el_per_page * (page_number + 1) - 1;

        for (let i = last_element; i > first_element - 1; i = i - 1) {
          if (items[i]) {
            let authorTAG = client.users.cache.find(
              (u) => u.id === items[i].authorID
            );
            if (authorTAG === undefined) {
              authorTAG = { tag: "Inconnu" };
            }
            items[i].id = i + 1;
            db.set(message.guild.id + ".items", items);
            fields.unshift({
              name:
                "N°" +
                items[i].id +
                " | `" +
                items[i].name +
                " (" +
                items[i].nbr +
                ")`",
              value: "Prix : " + items[i].price + "$ | `" + authorTAG.tag + "`",
              inline: false,
            });
          }
        }
      }

      if (page_count > 1) {
        let currentIndex = 0;
        await createshopembed(currentIndex);
        message.channel
          .send({
            embed: {
              color: "EC5922",
              author: {
                name: "💸 | " + shopname,
              },
              thumbnail: {
                url:
                  "https://cdn.discordapp.com/attachments/619408928727367686/877888231721566208/94609cecad22dc6497b330217ad2b41d17b7c2ff.png",
              },
              fields: fields,
              footer: {
                text:
                  currentIndex +
                  1 +
                  "/" +
                  page_count +
                  " pages • © PalaBot 2021",
              },
            },
          })
          .then(async (message) => {
            await message.react("⬅️");
            await message.react("➡️");
            const collector = message.createReactionCollector(
              (reaction, user) =>
                ["⬅️", "➡️"].includes(reaction.emoji.name) &&
                user.id === author_id,
              { time: 60000 }
            );

            collector.on("collect", async (reaction) => {
              reaction.users.remove(author_id);

              await message.react("⬅️");
              await message.react("➡️");
              if (reaction.emoji.name === "⬅️") {
                currentIndex = currentIndex - 1;
                if (currentIndex < 0) return (currentIndex = 0);
              }
              if (reaction.emoji.name === "➡️") {
                currentIndex++;
                if (currentIndex > page_count - 1)
                  return (currentIndex = currentIndex - 1);
              }
              await createshopembed(currentIndex);
              message.edit({
                embed: {
                  color: "EC5922",
                  author: {
                    name: "💸 | " + shopname,
                  },
                  thumbnail: {
                    url:
                      "https://cdn.discordapp.com/attachments/619408928727367686/877888231721566208/94609cecad22dc6497b330217ad2b41d17b7c2ff.png",
                  },
                  fields: fields,
                  footer: {
                    text:
                      currentIndex +
                      1 +
                      "/" +
                      page_count +
                      " pages • © PalaBot 2021",
                  },
                },
              });
            });
          });
      } else {
        await createshopembed(0);
        message.channel.send({
          embed: {
            color: "EC5922",
            author: {
              name: "💸 | " + shopname,
            },
            thumbnail: {
              url:
                "https://cdn.discordapp.com/attachments/619408928727367686/877888231721566208/94609cecad22dc6497b330217ad2b41d17b7c2ff.png",
            },
            fields: fields,
            footer: {
              text: "1/1 page • © PalaBot 2021",
            },
          },
        });
      }
    }
  },
};
