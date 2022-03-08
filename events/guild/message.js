const config = require("../../botconfig/config.json");
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js-12");
const db = require("quick.db");
const {
  escapeRegex,
  onCoolDown,
  replacemsg,
} = require("../../handlers/functions");

module.exports = async (client, message) => {
  try {
    if (!message.guild) return;

    if (message.channel.type !== "dm" && !db.get(message.guild.id)) {
      db.set(message.guild.id, {
        prefix: db.get(message.guild.id + ".prefix")
          ? db.get(message.guild.id + ".prefix")
          : config.prefix,
        joinchannel: "none",
        autorole: "none",
        quete: "none",
        cmdschannel: "none",
        staffrole: "none",
        catID: "none",
        setup: "none",
        avis: [],
      });
    }

    if (!db.get("bot")) {
      db.set("bot", {
        quete: "none",
        items: [],
      });
    }

    if (message.channel.type !== "dm" && !db.get(message.author.id)) {
      db.set(message.author.id, {
        itemsnbr: 0,
        ticketnbr: false,
      });
    }

    if (
      message.channel.type !== "dm" &&
      !db.get(message.guild.id + "-" + message.author.id + "-avis")
    ) {
      db.set(message.guild.id + "-" + message.author.id + "-avis", {
        avisuser: false,
      });
    }

    if (
      message.channel.type !== "dm" &&
      message.channel.id == "874974325952892972"
    ) {
      db.set("bot.quete", message.content);
    }
    if (message.author.bot) return;
    if (
      message.channel.type !== "dm" &&
      message.channel.id === db.get(message.guild.id + ".cmdschannel") &&
      db.get(message.guild.id + ".setup") === "done"
    ) {
      if (db.get(message.author.id + ".ticketnbr") === true)
        return message.channel.send("Vous avez déjà un ticket").then((m) =>
          setTimeout(function () {
            try {
              m.delete();
            } catch (e) {
              console.log(e);
            }
          }, 5000)
        );
      if (message.member.hasPermission("MANAGE_MESSAGES"))
        return message.channel
          .send("Le système de commandes n'affectent pas le staff")
          .then((m) =>
            setTimeout(function () {
              try {
                m.delete();
              } catch (e) {
                console.log(e);
              }
            }, 5000)
          );
      let staff = message.guild.roles.cache.find(
        (r) => r.id == db.get(message.guild.id + ".staffrole")
      );
      let everyone = message.guild.roles.cache.find(
        (r) => r.name == "@everyone"
      );
      let categoryID = db.get(message.guild.id + ".catID");
      try {
        message.delete();
      } catch (e) {
        console.log(e);
      }
      let name = "cmd-" + message.author.username;
      message.guild.channels
        .create(name, {
          type: "text",
        })
        .then((createChan) => {
          createChan.setParent(categoryID).then((settedParent) => {
            const ticket = new Discord.MessageEmbed()
              .setAuthor(
                `Commande de ${message.author.username}`,
                message.author.avatarURL()
              )
              .setDescription(
                `💼 Expliquez votre commande aux vendeurs\n🎀 Merci d'être clair et respecteux\n🔒 Pour fermer le ticket : \`` +
                  db.get(message.guild.id + ".prefix") +
                  `close\`\n\n Commande : \n\`` +
                  message.content +
                  "`"
              )
              .setFooter(
                "© PalaBot 2021 • Created By Xvirus9",
                message.guild.iconURL()
              )
              .setTimestamp();
            createChan.send(`<@&${db.get(message.guild.id + ".staffrole")}>`);
            createChan.send(ticket);
            createChan.setTopic(message.author.id).catch(console.error);
            createChan.overwritePermissions(
              [
                {
                  id: message.author.id,
                  allow: ["VIEW_CHANNEL"],
                },
                {
                  id: everyone.id,
                  deny: ["VIEW_CHANNEL"],
                },
                {
                  id: staff.id,
                  allow: ["VIEW_CHANNEL"],
                },
              ],
              "Needed to change permissions"
            );

            db.set(message.author.id + ".ticketnbr", true);
          });
        });
    }

    if (message.author.bot) return;
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    let prefix = db.get(message.guild.id + ".prefix")
      ? db.get(message.guild.id + ".prefix")
      : config.prefix;
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content
      .slice(matchedPrefix.length)
      .trim()
      .split(/ +/)
      .filter(Boolean);

    if (matchedPrefix.includes(client.user.id) && settings.ping_message)
      return message.channel.send({
        embed: new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(
            "Pour voir toutes les commandes tapez: `" + prefix + "help`"
          ),
      });

    const cmd = args.shift().toLowerCase();

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
      if (onCoolDown(message, command)) {
        return message.channel
          .send({
            embed: new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(
                replacemsg(settings.messages.cooldown, {
                  prefix: prefix,
                  command: command,
                  timeLeft: onCoolDown(message, command),
                })
              ),
          })
          .then((m) =>
            setTimeout(function () {
              try {
                m.delete();
              } catch (e) {
                console.log(e);
              }
            }, 5000)
          );
      }
      try {
        if (settings.delete_commands) {
          try {
            message.delete();
          } catch {}
        }
        if (
          command.memberpermissions &&
          command.memberpermissions.length > 0 &&
          !message.member.hasPermission(command.memberpermissions)
        ) {
          return message.channel
            .send({
              embed: new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(
                  replacemsg(settings.messages.notallowed_to_exec_cmd.title)
                )
                .setDescription(
                  replacemsg(
                    settings.messages.notallowed_to_exec_cmd.description
                      .memberpermissions,
                    {
                      command: command,
                      prefix: prefix,
                    }
                  )
                ),
            })
            .then((msg) =>
              msg
                .delete({
                  timeout:
                    settings.timeout.notallowed_to_exec_cmd.memberpermissions,
                })
                .catch((e) => {})
            );
        }

        if (
          command.requiredroles &&
          command.requiredroles.length > 0 &&
          message.member.roles.cache.size > 0 &&
          !message.member.roles.cache.some((r) =>
            command.requiredroles.includes(r.id)
          )
        ) {
          return message.channel
            .send(
              new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(
                  replacemsg(settings.messages.notallowed_to_exec_cmd.title)
                )
                .setDescription(
                  replacemsg(
                    settings.messages.notallowed_to_exec_cmd.description
                      .requiredroles,
                    {
                      command: command,
                      prefix: prefix,
                    }
                  )
                )
            )
            .then((msg) =>
              msg
                .delete({
                  timeout:
                    settings.timeout.notallowed_to_exec_cmd.requiredroles,
                })
                .catch((e) => {})
            );
        }

        if (
          command.alloweduserids &&
          command.alloweduserids.length > 0 &&
          !command.alloweduserids.includes(message.author.id)
        ) {
          return message.channel
            .send({
              embed: new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(
                  replacemsg(settings.messages.notallowed_to_exec_cmd.title)
                )
                .setDescription(
                  replacemsg(
                    settings.messages.notallowed_to_exec_cmd.description
                      .alloweduserids,
                    {
                      command: command,
                      prefix: prefix,
                    }
                  )
                ),
            })
            .then((msg) =>
              msg
                .delete({
                  timeout:
                    settings.timeout.notallowed_to_exec_cmd.alloweduserids,
                })
                .catch((e) => {})
            );
        }

        if (
          command.minargs &&
          command.minargs > 0 &&
          args.length < command.minargs
        ) {
          return message.channel
            .send({
              embed: new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(":x: Wrong Command Usage!")
                .setDescription(
                  command.argsmissing_message &&
                    command.argsmissing_message.trim().length > 0
                    ? command.argsmissing_message
                    : command.usage
                    ? "Usage: " + command.usage
                    : "Wrong Command Usage"
                ),
            })
            .then((msg) =>
              msg
                .delete({
                  timeout: settings.timeout.minargs,
                })
                .catch((e) => {})
            );
        }

        if (
          command.maxargs &&
          command.maxargs > 0 &&
          args.length > command.maxargs
        ) {
          return message.channel
            .send({
              embed: new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(":x: Wrong Command Usage!")
                .setDescription(
                  command.argstoomany_message &&
                    command.argstoomany_message.trim().length > 0
                    ? command.argstoomany_message
                    : command.usage
                    ? "Usage: " + command.usage
                    : "Wrong Command Usage"
                ),
            })
            .then((msg) =>
              msg
                .delete({
                  timeout: settings.timeout.maxargs,
                })
                .catch((e) => {})
            );
        }

        if (
          command.minplusargs &&
          command.minplusargs > 0 &&
          args.join(" ").split("++").filter(Boolean).length <
            command.minplusargs
        ) {
          return message.channel
            .send({
              embed: new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(":x: Wrong Command Usage!")
                .setDescription(
                  command.argsmissing_message &&
                    command.argsmissing_message.trim().length > 0
                    ? command.argsmissing_message
                    : command.usage
                    ? "Usage: " + command.usage
                    : "Wrong Command Usage"
                ),
            })
            .then((msg) =>
              msg
                .delete({
                  timeout: settings.timeout.minplusargs,
                })
                .catch((e) => {})
            );
        }

        if (
          command.maxplusargs &&
          command.maxplusargs > 0 &&
          args.join(" ").split("++").filter(Boolean).length >
            command.maxplusargs
        ) {
          return message.channel
            .send({
              embed: new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(":x: Wrong Command Usage!")
                .setDescription(
                  command.argstoomany_message &&
                    command.argstoomany_message.trim().length > 0
                    ? command.argsmissing_message
                    : command.usage
                    ? "Usage: " + command.usage
                    : "Wrong Command Usage"
                ),
            })
            .then((msg) =>
              msg
                .delete({
                  timeout: settings.timeout.maxplusargs,
                })
                .catch((e) => {})
            );
        }
        try {
          command.run(
            client,
            message,
            args,
            args.join(" ").split("++").filter(Boolean),
            message.member,
            args.join(" "),
            prefix
          );
        } catch (error) {
          if (settings.somethingwentwrong_cmd) {
            return message.channel
              .send({
                embed: new Discord.MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter(ee.footertext, ee.footericon)
                  .setTitle(
                    replacemsg(settings.messages.somethingwentwrong_cmd.title, {
                      prefix: prefix,
                      command: command,
                    })
                  )
                  .setDescription(
                    replacemsg(
                      settings.messages.somethingwentwrong_cmd.description,
                      {
                        error: error,
                        prefix: prefix,
                        command: command,
                      }
                    )
                  ),
              })
              .then((msg) =>
                msg
                  .delete({
                    timeout: 5000,
                  })
                  .catch((e) => {})
              );
          }
        }
      } catch (error) {
        if (settings.somethingwentwrong_cmd) {
          return message.channel
            .send({
              embed: new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(
                  replacemsg(settings.messages.somethingwentwrong_cmd.title, {
                    prefix: prefix,
                    command: command,
                  })
                )
                .setDescription(
                  replacemsg(
                    settings.messages.somethingwentwrong_cmd.description,
                    {
                      error: error,
                      prefix: prefix,
                      command: command,
                    }
                  )
                ),
            })
            .then((msg) =>
              msg
                .delete({
                  timeout: 5000,
                })
                .catch((e) => {})
            );
        }
      }
    } else
      return message.channel
        .send({
          embed: new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(
              replacemsg(settings.messages.unknown_cmd, {
                prefix: prefix,
              })
            ),
        })
        .then((msg) =>
          msg
            .delete({
              timeout: 5000,
            })
            .catch((e) => {})
        );
  } catch (e) {
    console.log(e);
    return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(replacemsg(settings.error_occur))
        .setDescription(
          replacemsg(settings.error_occur_desc, {
            error: error,
          })
        ),
    });
  }
};
