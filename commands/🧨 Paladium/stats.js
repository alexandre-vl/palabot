const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require('discord.js-12')
module.exports = { 
  name: "stats", 
  category: "🧨 Paladium", 
  aliases: [],
  cooldown: 7, 
  usage: "stats", 
  description: "Permet d'afficher les statistiques des serveurs de paladium", 
  memberpermissions: [], 
  requiredroles: [],
  alloweduserids: [],
    run: (client, message, prefix) => {
        const request = require('request')
        const db = require('quick.db');
        
        const args = message.content.substring(prefix.length).split(" ");
        const statsglobal = new Discord.MessageEmbed()


        const factions = new Discord.MessageEmbed()
        const minages = new Discord.MessageEmbed()
        const lobby = new Discord.MessageEmbed()

        let fields = [];
        let author_id = message.author.id

        message.channel.send('⏳ Veuillez patienter...').then(async (mess) => {
            let factions_stats = []
            let minages_stats = []
            let lobbys_stats = []
            request("https://factions.status.paladium-pvp.fr/api/getMonitorList/9g3LqSmKM7?page=1&_=1629030712039", { json: true }, async function (error, response, value) {
                try{
                    if(error) return message.channel.send('❌ Une erreur est survenue...')    
                    await value.psp.monitors.forEach(element => {factions_stats.push(element)});
                    request("https://minages.status.paladium-pvp.fr/api/getMonitorList/0LAX5S2WMw?page=1&_=1629030755621", { json: true }, async function (error, response, value) {
                        try{
                            if(error) return message.channel.send('❌ Une erreur est survenue...')    
                            await value.psp.monitors.forEach(element => {minages_stats.push(element)});
                            request("https://lobby.status.paladium-pvp.fr/api/getMonitorList/g27QAClWmy?page=1&_=1629035159918", { json: true }, async function (error, response, value) {
                                try{
                                    if(error) return message.channel.send('❌ Une erreur est survenue...')    
                                    await value.psp.monitors.forEach(element => {lobbys_stats.push(element)});
                                    
                                    let nbr_factions = 0
                                    let online_factions = 0
                                    await factions_stats.forEach(element => {
                                        nbr_factions++
                                        if(element.statusClass === "success") online_factions++
                                    })
                                    let nbr_minages = 0
                                    let online_minages = 0
                                    await minages_stats.forEach(element => {
                                        nbr_minages++
                                        if(element.statusClass === "success") online_minages++
                                    })
                                    let nbr_lobby = 0
                                    let online_lobby = 0
                                    await lobbys_stats.forEach(element => {
                                        nbr_lobby++
                                        if(element.statusClass === "success") online_lobby++
                                    })
                                    
                                    mess.delete()
                                    statsglobal.setColor("EC5922")
                                    statsglobal.setAuthor('📊 Statistiques Paladium 📊')
                                    statsglobal.addField('⚔ Factions', "`"+online_factions+"/"+nbr_factions+"` En Ligne <a:check:878026331286294529>")
                                    statsglobal.addField('⛏ Minages', "`"+online_minages+"/"+nbr_minages+"` En Ligne <a:check:878026331286294529>")
                                    statsglobal.addField('🧨 Lobbys', "`"+online_lobby+"/"+nbr_lobby+"` En Ligne <a:check:878026331286294529>")
                                    statsglobal.setFooter('© PalaBot 2021')
                                    message.channel.send(statsglobal).then(m => {
                                        m.react('🏠')
                                        m.react('⚔')
                                        m.react('⛏')
                                        m.react('🧨')
                                        
                                        const collector = m.createReactionCollector(
                                            (reaction, user) => ['⚔', '⛏', '🧨', '🏠'].includes(reaction.emoji.name) && user.id === author_id,
                                            {time: 120000}
                                        )
                            
                                        collector.on('collect', async (reaction) => {
                                            reaction.users.remove(author_id);

                                            switch(reaction.emoji.name){
                                                case "⚔":
                                                    fields = [];
                                                    await factions_stats.forEach(e=> {
                                                        let stat;
                                                        if(e.statusClass === "success") stat = true; else stat = false 
                                                        fields.push({
                                                            name: "<:paladium_sword:877198847389081610> "+e.name, 
                                                            value: 'Statut : '+(stat ? "<a:check:878026331286294529>" : "<a:no:877972224949256192>"),
                                                            inline: true
                                                        })
                                                    })
                                                    m.edit({
                                                        embed: {
                                                            color: 'EC5922',
                                                            author:{
                                                                name: "📊 Statistiques Paladium 📊",
                                                            },
                                                            fields: fields,
                                                            footer: {
                                                                text: "© PalaBot 2021",
                                                            },
                                                        }
                                                    })
                                                break;
                                                case "⛏":
                                                    fields = [];
                                                    await minages_stats.forEach(e=> {
                                                        let stat;
                                                        let sli = e.name.replace(/-/g, " ").split(' ');
                                                        let finalnbr = parseInt(sli[1])
                                                        if(e.statusClass === "success") stat = true; else stat = false 
                                                        fields.push({
                                                            name: "<:paladium_pickaxe:877198847334563860> "+sli[0]+" "+finalnbr, 
                                                            value: 'Statut : '+(stat ? "<a:check:878026331286294529>" : "<a:no:877972224949256192>"),
                                                            inline: true
                                                        })
                                                    })
                                                    m.edit({
                                                        embed: {
                                                            color: 'EC5922',
                                                            author:{
                                                                name: "📊 Statistiques Paladium 📊",
                                                            },
                                                            fields: fields,
                                                            footer: {
                                                                text: "© PalaBot 2021",
                                                            },
                                                        }
                                                    })
                                                break;
                                                case "🧨":
                                                    fields = [];
                                                    await lobbys_stats.forEach(e=> {
                                                        let stat;
                                                        if(e.statusClass === "success") stat = true; else stat = false 
                                                        fields.push({
                                                            name: "<:paladium_axe:877198847175163945> "+e.name, 
                                                            value: 'Statut : '+(stat ? "<a:check:878026331286294529>" : "<a:no:877972224949256192>"),
                                                            inline: true
                                                        })
                                                    })
                                                    m.edit({
                                                        embed: {
                                                            color: 'EC5922',
                                                            author:{
                                                                name: "📊 Statistiques Paladium 📊",
                                                            },
                                                            fields: fields,
                                                            footer: {
                                                                text: "© PalaBot 2021",
                                                            },
                                                        }
                                                    })
                                                break;
                                                case "🏠":
                                                    m.edit(statsglobal)
                                                break;
                                            }
                                        })
                                    })
                    
                                }catch(err){
                                    mess.edit('❌ Une erreur est survenue...')
                                }
                            });
                        }catch(err){
                            mess.edit('❌ Une erreur est survenue...')
                        }
                    });
                }catch(err){
                    mess.edit('❌ Une erreur est survenue...')
                }
            });




            




        })
        
    }
}