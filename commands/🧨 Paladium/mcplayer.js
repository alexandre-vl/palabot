const { MessageEmbed } = require("discord.js-12");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Discord = require('discord.js-12')
module.exports = { 
  name: "mcplayer", 
  category: "🧨 Paladium", 
  aliases: ["player", "playerinfo"],
  cooldown: 7, 
  usage: "mcplayer <pseudo>", 
  description: "Permet d'afficher des informations sur un joueur Minecraft", 
  memberpermissions: [], 
  requiredroles: [],
  alloweduserids: [],
    run: (client, message, prefix, args) => {
        let mojang = require('mojang-api');
        let https = require('https');


        try {
            if(!args.length) {
                message.reply('précise le nom du joueur ou son uuid');
                return;
            }
            getUuid(args[0], (err, uuid) => {
                if(err) {
                    message.channel.send('Une erreur est survenue. Le joueur n\'existe pas');
                    return;
                }
                mojang.profile(uuid, (err, resp) => {
                    if(err) {
                        message.reply('le joueur n\'existe pas');
                        return;
                    }
                    mojang.nameHistory(uuid, (err, resp1) => {
                        if(err) {
                            message.reply('impossible de trouver ce joueur dans nos données');
                            console.log(err);
                            return;
                        }
                        let nameHistory = [];
                        resp1.forEach(element => {
                            nameHistory.push(element.name);
                        });
                        nameHistory = nameHistory.join(', ');
                        let embedMessage = {
                            color: '#EC5922',
                            title: resp.name,
                            author: {
                                name: 'Minecraft infos',
                                url: 'https://github.com/Jystro/Minecraft-info-bot'
                            },
                            description: "Profile "+resp.name,
                            thumbnail: {
                                url: 'https://crafatar.com/avatars/' + resp.id + '.png?overlay'
                            },
                            fields: [{
                                name: 'Nom',
                                value: resp.name
                            },
                            {
                                name: 'UUID',
                                value: resp.id
                            },
                            {
                                name: 'Skin',
                                value: 'https://crafatar.com/skins/' + resp.id + '.png'
                            }],
                            image: {
                                url: 'https://crafatar.com/renders/body/' + resp.id + '.png?overlay'
                            },
                            timestamp: new Date(),
                            footer: {
                                text: 'Minecraft infos\nLes données se mettent à jour toutes les 20 min'
                            }
                        };
                        let cape = 'https://crafatar.com/capes/' + resp.id + '.png';
                        const req = https.request(cape, res => {
                            if(res.statusCode == 200) {
                                embedMessage.fields.push({ name: 'Cape', value: cape });
                            }
                            embedMessage.fields.push({ name: 'Historique Noms', value: nameHistory });
            
                            message.channel.send({  embed: embedMessage  });
                        });
                        req.on('error', err => {
                            console.log(err);
                            message.reply('impossible de trouver la cape.');
                        })
                        req.end();
                    });
                });
            });
            
            
        }catch(e){
            console.log(e)
            message.channel.send('Une erreur est survenu...')
        }
        

        



        function getUuid(value, cb) {
            let error = false;
            let regex = /^[a-f0-9]{32}$/i 
            if(!value.match(regex)) {
                mojang.nameToUuid(value, (err, resp) => {
                    if(err || !resp.length) {
                        error = true;
                        cb(error, null);
                        return;
                    }
                    cb(error, resp[0].id);
                });
            }
            else { cb(error, value); }
        }
    
        
    }
}