
const config = require("../../botconfig/config.json"); 
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = (client, member) => { 
    const db = require('quick.db');

    let dbautorole = db.get(member.guild.id+".autorole")
    let dbjoinchannel = db.get(member.guild.id+".joinchannel")
    let role = member.guild.roles.cache.find(r => r.id == dbautorole)
    let joinchannel = member.guild.channels.cache.find(c => c.id == dbjoinchannel)

    let joinembed = new Discord.MessageEmbed()
        .setColor('EC5922')
        .setAuthor('🎈 | Nouveau membre !')
        .setDescription('Bienvenue à <@'+member+'> qui rejoint le serveur !\nNous sommes maintenant `'+member.guild.memberCount+'` membres !')
        .setThumbnail(member.user.avatarURL({size: 256}))
        .setTimestamp()
        .setFooter(member.guild.name)


    try{
         if(db.get(member.guild.id+".joinchannel") !== "none" || joinchannel) joinchannel.send(joinembed); else return
        
        if(db.get(member.guild.id+".autorole") !== "none" || role) member.roles.add(role.id); else member.guild.owner.send('❌ Erreur : Veuillez déplacer le role du bot au dessus du role à donner aux nouveaux membres !')
    }catch(e) {
        return
    }
}