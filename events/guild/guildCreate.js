
const config = require("../../botconfig/config.json"); 
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = (client, guild) => { 
    let serveur = 0
    let server_list = []
  
    for (let i = 0; i < client.guilds.cache.size; i++) {
      serveur++
    }
    client.guilds.cache.forEach(element => {
      server_list.push(element.name);
    });
    client.user.setActivity(serveur+" serveurs | m!help");
    
}