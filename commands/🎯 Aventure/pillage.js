const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const { embedError, sendToUsers } = require("../../handlers/functions.js");
const minesweeper = require('minesweeper');
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
            let opponent = message.mentions.members.first();
            if (!db.get("adventure.players").find((p) => p.id === message.author.id))
                return message.channel.send("Vous n'êtes pas en jeu !");
            if (!opponent || !db.get("adventure.players").find((p) => p.id === message.author.id))
                return message.channel.send("Veuillez mentionner un utilisateur en jeu !");
            let user = message.author;
            if (opponent.id === message.author.id)
                return message.channel.send("Vous ne pouvez pas vous mentionnez !");

            // TODO: je pense que l'on va faire un démineur: l'attaquant jouera, le défenseur pourra poser les mines.
            // Suivant le niveau de la base, la grille sera plus ou moins grande.
            // Le joueur attaquant ne saura pas à l'avance le niveau de la base sauf s'il utilise un ghost block.
            // Je suppos qu'à la fin, si le joueur attaquant réussi le démineur, cela se décidera sur un /pvp

        }catch(e){
            embedError(
                "```" + e + "```",
                message.channel)
            return console.log(e);
        }
    }
}