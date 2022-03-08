const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require('discord.js-12')
module.exports = { 
  name: "trixium", 
  category: "🧨 Paladium", 
  aliases: [],
  cooldown: 7, 
  usage: "trixium", 
  description: "Permet d'afficher le classement trixium de Paladium", 
  memberpermissions: [], 
  requiredroles: [],
  alloweduserids: [],
    run: async(client, message, prefix) => {
        const request = require('request')
        const db = require('quick.db');
        const args = message.content.substring(prefix.length).split(" ")
        const argsl = message.content.split(" ").slice(1).join(" ");
    
    
        let author_id = message.author.id;
        let items;
    
        let fields = [];
        let el_per_page = 8
    
        let newitemsname=[]
    
    
        await request("https://classement.paladium-pvp.fr/trixium/ranks?amount=50&at=0", { json: true }, async function (error, response, value) {
            items = value.playersRank
            
    
            let page_count = Math.ceil(items.length / el_per_page)
            function createshopembed(page_number) {
    
                fields = [];
    
                let first_element = 0;
                if (page_number > 0) first_element =  el_per_page * page_number
                let last_element = el_per_page * (page_number + 1) - 1
    
                for (let i = last_element; i > first_element-1 ; i=i-1) {
                    let emoji = ""
                    switch(i){
                        case 0:
                            emoji = "<:goldtower:877851595621171250>"
                        break;
                        case 1:
                            emoji = "<:bronzetower:877851596627775518>"
                        break;
                        case 2:
                            emoji = "<:silvertower:877851596267085835>"
                        break;
                    }
                    
                    if(items[i]) {
                        fields.unshift({
                            name: emoji+" N°"+parseInt(i+1)+" | `"+items[i].playerName+"`",
                            value: "Points : "+items[i].points+" <:trixium:877851448124264458>",
                            inline: false,
                        })
                            
                    }
                }
    
    
            }
    
    
            if(page_count > 1){
                let currentIndex = 0
                await createshopembed(currentIndex)
                message.channel.send({
                    embed: {
                        color: 'EC5922',
                        author:{
                            name: "Classement Trixium",
                        },
                        thumbnail:{	
                            url: "https://cdn.discordapp.com/attachments/619408928727367686/877851488028880906/ore.0859cff.png",
                        },
                        image:{
                            url: "https://cdn.discordapp.com/attachments/619408928727367686/877851424720060456/banner.762847e.png",
                        },
                        fields: fields,
                        footer: {
                            text: currentIndex+1+"/"+page_count+" pages • © PalaBot 2021",
                        },
                    }
                }).then(async(message) => {
                    await message.react('⬅️')
                    await message.react('➡️')
                    const collector = message.createReactionCollector(
                    (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author_id,
                    {time: 60000}
                    )
    
                    
                    collector.on('collect', async (reaction) => {
                        reaction.users.remove(author_id);
                        
                        await message.react('⬅️')
                        await message.react('➡️')
                        if(reaction.emoji.name === '⬅️'){
                            currentIndex = currentIndex - 1;
                            if(currentIndex < 0 ) return currentIndex = 0
                        }
                        if(reaction.emoji.name === '➡️'){
                            currentIndex++;
                            if(currentIndex > page_count -1) return currentIndex = currentIndex -1
                        }
                        await createshopembed(currentIndex)
                        message.edit({
                            embed: {
                                color: 'EC5922',
                                author:{
                                    name: "Classement Trixium",
                                },
                                thumbnail:{	
                                    url: "https://cdn.discordapp.com/attachments/619408928727367686/877851488028880906/ore.0859cff.png",
                                },
                                image:{
                                    url: "https://cdn.discordapp.com/attachments/619408928727367686/877851424720060456/banner.762847e.png",
                                },
                                fields: fields,
                                footer: {
                                    text: currentIndex+1+"/"+page_count+" pages • © PalaBot 2021",
                                },
                            }
                        })
                    })
                    
                
                })
            }else {
                await createshopembed(0)
                message.channel.send({
                    embed: {
                        color: 'EC5922',
                        author:{
                            name: "Classement Trixium",
                        },
                        thumbnail:{	
                            url: "https://cdn.discordapp.com/attachments/619408928727367686/877851488028880906/ore.0859cff.png",
                        },
                        image:{
                            url: "https://cdn.discordapp.com/attachments/619408928727367686/877851424720060456/banner.762847e.png",
                        },
                        fields: fields,
                        footer: {
                            text: "1/1 page • © PalaBot 2021",
                        },
                    }
                })
            }
        
        
    
    
        
    
        
    
    
        })
    
      
        
    }
}