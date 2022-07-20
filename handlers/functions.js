const { MessageEmbed, Collection, Messagen, User} = require("discord.js-12");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const db = require("quick.db");
const moment = require("moment");
const sleep = require("atomic-sleep");

module.exports.nFormatter = nFormatter;
module.exports.change_status = change_status;
module.exports.shuffle = shuffle;
module.exports.formatDate = formatDate;
module.exports.delay = delay;
module.exports.getRandomInt = getRandomInt;
module.exports.duration = duration;
module.exports.getRandomNum = getRandomNum;
module.exports.createBar = createBar;
module.exports.format = format;
module.exports.swap_pages = swap_pages;
module.exports.escapeRegex = escapeRegex;
module.exports.arrayMove = arrayMove;
module.exports.isValidURL = isValidURL;
module.exports.GetUser = GetUser;
module.exports.GetRole = GetRole;
module.exports.GetGlobalUser = GetGlobalUser;
module.exports.parseMilliseconds = parseMilliseconds;
module.exports.onCoolDown = onCoolDown;

module.exports.replacemsg = replacedefaultmessages;
module.exports.embedError = embedError;
module.exports.RandomMine = RandomMine;
module.exports.sendToUsers = sendToUsers;

function replacedefaultmessages(text, o = {}) {
  if (!text || text == undefined || text == null)
    throw "No Text for the replacedefault message added as First Parameter";
  const options = Object(o);
  if (!options || options == undefined || options == null) return String(text);
  return String(text)
    .replace(
      /%{timeleft}%/gi,
      options && options.timeLeft ? options.timeLeft.toFixed(1) : "%{timeleft}%"
    )
    .replace(
      /%{commandname}%/gi,
      options && options.command && options.command.name
        ? options.command.name
        : "%{commandname}%"
    )
    .replace(
      /%{commandaliases}%/gi,
      options && options.command && options.command.aliases
        ? options.command.aliases.map((v) => `\`${v}\``).join(",")
        : "%{commandaliases}%"
    )
    .replace(
      /%{prefix}%/gi,
      options && options.prefix ? options.prefix : "%{prefix}%"
    )
    .replace(
      /%{commandmemberpermissions}%/gi,
      options && options.command && options.command.memberpermissions
        ? options.command.memberpermissions.map((v) => `\`${v}\``).join(",")
        : "%{commandmemberpermissions}%"
    )
    .replace(
      /%{commandalloweduserids}%/gi,
      options && options.command && options.command.alloweduserids
        ? options.command.alloweduserids.map((v) => `<@${v}>`).join(",")
        : "%{commandalloweduserids}%"
    )
    .replace(
      /%{commandrequiredroles}%/gi,
      options && options.command && options.command.requiredroles
        ? options.command.requiredroles.map((v) => `<@&${v}>`).join(",")
        : "%{commandrequiredroles}%"
    )
    .replace(
      /%{errormessage}%/gi,
      options && options.error && options.error.message
        ? options.error.message
        : options && options.error
        ? options.error
        : "%{errormessage}%"
    )
    .replace(
      /%{errorstack}%/gi,
      options && options.error && options.error.stack
        ? options.error.stack
        : options && options.error && options.error.message
        ? options.error.message
        : options && options.error
        ? options.error
        : "%{errorstack}%"
    )
    .replace(
      /%{error}%/gi,
      options && options.error ? options.error : "%{error}%"
    );
}

function onCoolDown(message, command) {
  if (!message || !message.client)
    throw "No Message with a valid DiscordClient granted as First Parameter";
  if (!command || !command.name)
    throw "No Command with a valid Name granted as Second Parameter";
  const client = message.client;
  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount =
    (command.cooldown || settings.default_cooldown_in_sec) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return timeLeft;
    } else {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return false;
  }
}

function parseMilliseconds(milliseconds) {
  if (typeof milliseconds !== "number") {
    throw new TypeError("Expected a number");
  }

  return {
    days: Math.trunc(milliseconds / 86400000),
    hours: Math.trunc(milliseconds / 3600000) % 24,
    minutes: Math.trunc(milliseconds / 60000) % 60,
    seconds: Math.trunc(milliseconds / 1000) % 60,
    milliseconds: Math.trunc(milliseconds) % 1000,
    microseconds: Math.trunc(milliseconds * 1000) % 1000,
    nanoseconds: Math.trunc(milliseconds * 1e6) % 1000,
  };
}

function isValidURL(string) {
  const args = string.split(" ");
  let url;
  for (const arg of args) {
    try {
      url = new URL(arg);
      url = url.protocol === "http:" || url.protocol === "https:";
      break;
    } catch (_) {
      url = false;
    }
  }
  return url;
}

function GetUser(message, arg) {
  var errormessage = ":x: I failed finding that User...";
  return new Promise(async (resolve, reject) => {
    var args = arg,
      client = message.client;
    if (!client || !message) return reject("CLIENT IS NOT DEFINED");
    if (!args || args == null || args == undefined)
      args = message.content.trim().split(/ +/).slice(1);
    let user = message.mentions.users.first();
    if (!user && args[0] && args[0].length == 18) {
      user = await client.users.fetch(args[0]);
      if (!user) return reject(errormessage);
      return resolve(user);
    } else if (!user && args[0]) {
      let alluser = message.guild.members.cache.map((member) =>
        String(member.user.tag).toLowerCase()
      );
      user = alluser.find((user) =>
        user.startsWith(args.join(" ").toLowerCase())
      );
      user = message.guild.members.cache.find(
        (me) => String(me.user.tag).toLowerCase() == user
      );
      if (!user || user == null || !user.id) {
        alluser = message.guild.members.cache.map((member) =>
          String(
            member.displayName + "#" + member.user.discriminator
          ).toLowerCase()
        );
        user = alluser.find((user) =>
          user.startsWith(args.join(" ").toLowerCase())
        );
        user = message.guild.members.cache.find(
          (me) =>
            String(
              me.displayName + "#" + me.user.discriminator
            ).toLowerCase() == user
        );
        if (!user || user == null || !user.id) return reject(errormessage);
      }
      user = await client.users.fetch(user.user.id);
      if (!user) return reject(errormessage);
      return resolve(user);
    } else {
      user = message.mentions.users.first() || message.author;
      return resolve(user);
    }
  });
}

function GetRole(message, arg) {
  var errormessage = ":x: I failed finding that Role...";
  return new Promise(async (resolve, reject) => {
    var args = arg,
      client = message.client;
    if (!client || !message) return reject("CLIENT IS NOT DEFINED");
    if (!args || args == null || args == undefined)
      args = message.content.trim().split(/ +/).slice(1);
    let user = message.mentions.roles
      .filter((role) => role.guild.id == message.guild.id)
      .first();
    if (!user && args[0] && args[0].length == 18) {
      user = message.guild.roles.cache.get(args[0]);
      if (!user) return reject(errormessage);
      return resolve(user);
    } else if (!user && args[0]) {
      let alluser = message.guild.roles.cache.map((role) =>
        String(role.name).toLowerCase()
      );
      user = alluser.find((r) =>
        r.split(" ").join("").includes(args.join("").toLowerCase())
      );
      user = message.guild.roles.cache.find(
        (role) => String(role.name).toLowerCase() === user
      );
      if (!user) return reject(errormessage);
      return resolve(user);
    } else {
      user = message.mentions.roles
        .filter((role) => role.guild.id == message.guild.id)
        .first();
      if (!user) return reject(errormessage);
      return resolve(user);
    }
  });
}

function GetGlobalUser(message, arg) {
  var errormessage = ":x: I failed finding that User...";
  return new Promise(async (resolve, reject) => {
    var args = arg,
      client = message.client;
    if (!client || !message) return reject("CLIENT IS NOT DEFINED");
    if (!args || args == null || args == undefined)
      args = message.content.trim().split(/ +/).slice(1);
    let user = message.mentions.users.first();
    if (!user && args[0] && args[0].length == 18) {
      user = await client.users.fetch(args[0]);
      if (!user) return reject(errormessage);
      return resolve(user);
    } else if (!user && args[0]) {
      let alluser = [],
        allmembers = [];
      var guilds = client.guilds.cache.array();
      for (const g of guilds) {
        var members = g.members.cache.array();
        for (const m of members) {
          alluser.push(m.user.tag);
          allmembers.push(m);
        }
      }
      user = alluser.find((user) =>
        user.startsWith(args.join(" ").toLowerCase())
      );
      user = allmembers.find((me) => String(me.user.tag).toLowerCase() == user);
      if (!user || user == null || !user.id) {
        user = alluser.find((user) =>
          user.startsWith(args.join(" ").toLowerCase())
        );
        user = allmembers.find(
          (me) =>
            String(
              me.displayName + "#" + me.user.discriminator
            ).toLowerCase() == user
        );
        if (!user || user == null || !user.id) return reject(errormessage);
      }
      user = await client.users.fetch(user.user.id);
      if (!user) return reject(errormessage);
      return resolve(user);
    } else {
      user = message.mentions.users.first() || message.author;
      return resolve(user);
    }
  });
}

function shuffle(array) {
  try {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("en-US").format(date);
  } catch (e) {
    console.log(String(e.stack).bgRed);
    return false;
  }
}

function parseDuration(duration) {
  let remain = duration;
  let days = Math.floor(remain / (1000 * 60 * 60 * 24));
  remain = remain % (1000 * 60 * 60 * 24);

  let hours = Math.floor(remain / (1000 * 60 * 60));
  remain = remain % (1000 * 60 * 60);

  let minutes = Math.floor(remain / (1000 * 60));
  remain = remain % (1000 * 60);

  let seconds = Math.floor(remain / 1000);
  remain = remain % 1000;

  let milliseconds = remain;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

function formatTime(o, useMilli = false) {
  let parts = [];
  if (o.days) {
    let ret = o.days + " Day";
    if (o.days !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.hours) {
    let ret = o.hours + " Hr";
    if (o.hours !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.minutes) {
    let ret = o.minutes + " Min";
    if (o.minutes !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.seconds) {
    let ret = o.seconds + " Sec";
    if (o.seconds !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (useMilli && o.milliseconds) {
    let ret = o.milliseconds + " ms";
    parts.push(ret);
  }
  if (parts.length === 0) {
    return "instantly";
  } else {
    return parts;
  }
}

function duration(duration, useMilli = false) {
  let time = parseDuration(duration);
  return formatTime(time, useMilli);
}

function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function getRandomInt(max) {
  try {
    return Math.floor(Math.random() * Math.floor(max));
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function getRandomNum(min, max) {
  try {
    return Math.floor(Math.random() * Math.floor(max - min + min));
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function createBar(total, current, size = 25, line = "▬", slider = "🔷") {
  try {
    if (!total) throw "MISSING MAX TIME";
    if (!current) return `**[${mover}${line.repeat(size - 1)}]**`;
    let bar =
      current > total
        ? [line.repeat((size / 2) * 2), (current / total) * 100]
        : [
            line
              .repeat(Math.round((size / 2) * (current / total)))
              .replace(/.$/, slider) +
              line.repeat(size - Math.round(size * (current / total)) + 1),
            current / total,
          ];
    if (!String(bar).includes(mover)) {
      return `**[${mover}${line.repeat(size - 1)}]**`;
    } else {
      return `**[${bar[0]}]**`;
    }
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function format(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1)
      return (
        (m < 10 ? "0" : "") +
        m +
        ":" +
        (s < 10 ? "0" : "") +
        s +
        " | " +
        Math.floor(millis / 1000) +
        " Seconds"
      );
    else
      return (
        (h < 10 ? "0" : "") +
        h +
        ":" +
        (m < 10 ? "0" : "") +
        m +
        ":" +
        (s < 10 ? "0" : "") +
        s +
        " | " +
        Math.floor(millis / 1000) +
        " Seconds"
      );
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function nFormatter(num, digits = 2) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

async function swap_pages(
  message,
  desc,
  TITLE,
  reactionemojis = ["⬅️", "⏹", "➡️"],
  sliceamount
) {
  if (!message || !message.client) throw "No message with a valid client added";
  let currentPage = 0;
  let embeds = [];
  if (Array.isArray(desc)) {
    try {
      let arraysliceamount = sliceamount ? sliceamount : 15;
      let k = arraysliceamount;
      for (let i = 0; i < desc.length; i += arraysliceamount) {
        const current = desc.slice(i, k);
        k += arraysliceamount;
        const embed = new MessageEmbed()
          .setDescription(current)
          .setTitle(TITLE)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon);
        embeds.push(embed);
      }
      embeds;
    } catch {}
  } else {
    try {
      let stringsliceamount = sliceamount ? sliceamount : 1000;
      let k = stringsliceamount;
      for (let i = 0; i < desc.length; i += stringsliceamount) {
        const current = desc.slice(i, k);
        k += stringsliceamount;
        const embed = new MessageEmbed()
          .setDescription(current)
          .setTitle(TITLE)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon);
        embeds.push(embed);
      }
      embeds;
    } catch {}
  }
  if (embeds.length === 1)
    return message.channel
      .send(embeds[0])
      .catch((e) => console.log("THIS IS TO PREVENT A CRASH"));
  const queueEmbed = await message.channel
    .send(
      `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      embeds[currentPage]
    )
    .catch((e) => console.log("THIS IS TO PREVENT A CRASH"));
  try {
    for (const emoji of reactionemojis) await queueEmbed.react(emoji);
  } catch {}

  const filter = (reaction, user) =>
    (reactionemojis.includes(reaction.emoji.name) ||
      reactionemojis.includes(reaction.emoji.name)) &&
    message.author.id === user.id;
  const collector = queueEmbed.createReactionCollector(filter, {
    time: 45000,
  });

  collector.on("collect", async (reaction, user) => {
    try {
      if (
        reaction.emoji.name === reactionemojis[2] ||
        reaction.emoji.id === reactionemojis[2]
      ) {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit(
            `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            {
              content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
              embed: embeds[currentPage],
            }
          );
        } else {
          currentPage = 0;
          queueEmbed.edit(
            `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            {
              content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
              embed: embeds[currentPage],
            }
          );
        }
      } else if (
        reaction.emoji.name === reactionemojis[0] ||
        reaction.emoji.id === reactionemojis[0]
      ) {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.edit(
            `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            {
              content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
              embed: embeds[currentPage],
            }
          );
        } else {
          currentPage = embeds.length - 1;
          queueEmbed.edit(
            `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            {
              content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
              embed: embeds[currentPage],
            }
          );
        }
      } else {
        collector.stop();
        reaction.message.reactions.removeAll();
      }
      await reaction.users.remove(message.author.id);
    } catch {}
  });
}

function change_status(client) {
  try {
    client.user.setActivity(
      `${config.prefix}help | ${client.guilds.cache.size} Guilds | ${Math.ceil(
        client.users.cache.size / 1000
      )}k Members`,
      {
        type: "PLAYING",
      }
    );
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function embedError(error, channel) {
  channel.send({
    embed: { description: "`❌` " + error, color: "EC5922" },
  });
}

function RandomMine(chance) {
  let table = [
    { name: "stone", chance: 61 / 100 },
    { name: "amethyste", chance: 13 / 100, size: 6 },
    { name: "titane", chance: 10 / 100, size: 5 },
    { name: "gravel", chance: 8 / 100, size: 8 },
    { name: "paladium", chance: 5 / 100, size: 4 },
    { name: "trixium", chance: 2 / 100, size: 2 },
    { name: "findium", chance: 1 / 100, size: 2 },
  ];
  let rand_purcent = Math.floor(Math.random() * chance + 1) / 100;

  for (let i = 0; i < table.length; i++) {
    if (rand_purcent > table[i].chance) {
      let filon = 1;
      if (table[i].name !== "stone") {
        filon = Math.floor(Math.random() * table[i].size) + 1;
      }
      return {
        num: i,
        name: table[i].name,
        chance: table[i].chance,
        multiplieur: filon,
      };
    }
  }
}

async function sendToUsers(users, message, options){
  try{
    options = options || null
    users.forEach(async(user) => {
      await user.send(message, options ? options:{})
    });
  }catch(error){
    console.error(e)
  }
}