const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const { embedError } = require("../../handlers/functions.js");
const path = require('path');
module.exports = {
    name: path.basename(__filename).split(".")[0],
    aliases: ["online", "list"],
    description: "Get the list of online players and their activity.",
    category: "Adventure",
    cooldown: 1,
    usage: "!tab",
    run: async (client, message, args, user, text, prefix) => {
        try {
            let current = db.get(`adventure.players`)
            current.find((p) => p.id === message.author.id).last_command_time = new Date();
            db.set(`adventure.players`, current)

            let players = db.get("adventure.players");
            let onlines = []
            players.forEach(player => {
                if ((new Date().getHours() - new Date(player.last_command_time).getHours()) < 1) {
                    onlines.push(player)
                }
            })

            if (!onlines.find((p) => p.id === message.author.id) || !onlines) return message.reply("vous n'êtes pas en jeu.");
            else {
                let embed = new Discord.MessageEmbed().setTitle(onlines.length + " joueurs en ligne").setColor("#408080")

                onlines.forEach(element => {
                    let pseudo = client.users.cache.find(user => user.id === element.id).username;
                    let adv_status = db.get("adventure.players").find((p) => p.id === element.id).status;
                    let dc_status = client.users.cache.find(user => user.id === element.id).presence.status;
                    let adv_emoji, dc_emoji;
                    switch (adv_status) {
                        case "mining":
                            emoji = "⛏";
                            break
                        case "idle":
                            emoji = "💭";
                            break
                        case "in combat":
                            emoji = "⚔"
                            break
                    }
                    switch (dc_status) {
                        case "online":
                            dc_emoji = "🟢"
                            break
                        case "offline":
                            dc_emoji = "🔘"
                            break
                        case "dnd":
                            dc_emoji = "🔴"
                            break
                        case "idle":
                            dc_emoji = "🟠"
                            break
                    }

                    embed.addField(`${dc_emoji} ${pseudo}`, `${emoji} • ${adv_status}`)
                });
                message.channel.send(embed);
            }
        } catch (e) {
            embedError(
                "```" + e + "```",
                message.channel)
            return console.log(e);
        }
    }
};