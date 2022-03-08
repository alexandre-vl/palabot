
const config = require("../../botconfig/config.json"); 
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
module.exports = (client, member) => { 
    const db = require('quick.db');


    let dbjoinchannel = db.get(member.guild.id+".leavechannel")
    let joinchannel = member.guild.channels.cache.find(c => c.id == dbjoinchannel)

    let joinembed = new Discord.MessageEmbed()
        .setColor('EC5922')
        .setAuthor('😪 | Au revoir... ')
        .setDescription('Au revoir <@'+member+'> qui nous quitte... !\nNous sommes désormais `'+member.guild.memberCount+'` membres.')
        .setThumbnail(member.user.avatarURL({size: 256}))
        .setTimestamp()
        .setFooter(member.guild.name)

    try {

        if(db.get(member.guild.id+".leavechannel") === "none" || !joinchannel) return
        joinchannel.send(joinembed)
    }catch(e){
        return
    } 
    
}