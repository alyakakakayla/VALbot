//packages
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const db = require('quick.db');
const math = require("mathjs");
const bot = new Discord.Client({disableEveryone: true});
const guildInvites = new Map();
const mockingcase = require('@strdr4605/mockingcase');
const { isInteger, diag, e } = require("mathjs");


//retired maps
/*
bot.snipes = new Map();
bot.afk = new Map();
bot.lfg = new Map();
*/


const Duration = require('humanize-duration');
const dailyCooldown = new Map();
const hourlyCooldown = new Map();
const weeklyCooldown = new Map();
const jailCooldown = new Map();
const typetestCooldown = new Map();


//more retired maps
/*
const lfgCooldown = new Map();
const lfgpingCooldown = new Map();
const spawnCooldown = new Map();
const startLFGPINGcooldown = new Map();
*/


//prefix and token in botconfig
let prefix = botconfig.prefix;


bot.on("ready", async () => {
    console.log("deployed, now listening...");

//or

const channelReady = bot.channels.cache.find(channel => channel.id === "708821607639941280");


channelReady.send("**<@382253023709364224>**");
let readyEmbed = new Discord.MessageEmbed()
   .setTitle("// BOT READY")
   .setColor(`#25A9F3`)
   .setDescription(`deployed, now listening...`)
   .setTimestamp()
   .setThumbnail("https://cdn.freebiesupply.com/logos/thumbs/2x/visual-studio-code-logo.png")
channelReady.send(readyEmbed);


//retired variables for a retired command
/*
    answered = true;
    cAnswer = "";
    userAnswer = "";

*/
 
 
    bot.user.setPresence({
        status: 'online',
        activity: {
            name: 'VALORANT',
            type: 'PLAYING'
        }
    })
});


//start invite tracking
bot.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));

bot.on("ready", () => {
    bot.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    })
});

bot.on("guildMemberAdd", async member => {
    let color = ((1 << 24) * Math.random() | 0).toString(16); //random hex
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);

    try {
    const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);

    const joinembed = new Discord.MessageEmbed()
        .setTitle("// " + member.user.tag.toUpperCase())
        .setDescription(`**invited by:** ${usedInvite.inviter.tag}\n**code:** ${usedInvite.url}\n**times used:** ${usedInvite.uses}`)
        .setThumbnail(`${member.user.displayAvatarURL({dynamic : true})}`)
        .setColor(`#${color}`)
    const loggingChannel = member.guild.channels.cache.find(channel => channel.id === "737318091981324298");
    if(loggingChannel) {
        loggingChannel.send(joinembed).catch(err => console.log(err));
    }} catch (err) {
        console.log(err);
    }
});
//end invite tracking



//start join message
bot.on("guildMemberAdd", async member => {

    const channel = member.guild.channels.cache.find(channel => channel.id === "657679783735328791")
    if(!channel) return;
    const channel2 = member.guild.channels.cache.find(channel => channel.id === "708821607639941280")
    
    let welcomeembed = new Discord.MessageEmbed()
        .setAuthor("// " + member.user.tag.toUpperCase(), member.user.displayAvatarURL())
        .setImage("https://media.discordapp.net/attachments/466328575231000576/1017918881223946381/IMG_1542.png")
        .setColor("#F073DC")
    channel.send(welcomeembed)

    channel.send("<:VVlove:1017920858905378896> **WELCOME** " + `${member}` + "\n<:VVdot:809087399094124624> **SERVER RULES:** <#657680016435314733>\n<:VVdot:809087399094124624> **VALORANT SCRIMS:** <#847148033220935730>\n<:VVdot:809087399094124624> **LOOKING FOR GROUP:** <#816054926673051708>");
});
//end join message



//start verify message
bot.on("guildMemberAdd", async member => {
    const verifyChannel = member.guild.channels.cache.find(channel => channel.id === "1017186970616741898");
    if(!verifyChannel) return;
    verifyChannel.send(`${member}`);
    let welcomeVerify = new Discord.MessageEmbed()
        .setAuthor("// " + member.user.tag.toUpperCase(), member.user.displayAvatarURL())
        .setTitle("**THIS SERVER IS 18+ ONLY**")
        .addField("how to get verified:", "<:VVdot:809087399094124624> send a picture of valid ID, or\n<:VVdot:809087399094124624> wait in voice verify for a mod")
        .addField ("people you can ping to verify you:", "<@382253023709364224> <@271896761176424449> <@442315076792221697> <@277287199085428737> <@214819437478543360> <@288106557789437952>")
        .setFooter("note: if sending ID, you can blur out name, photo, etc.")
        .setColor("#fef08d")
    verifyChannel.send(welcomeVerify);
});
//end verify message


//start leave message
bot.on("guildMemberRemove", member=> {
 
    const channel = member.guild.channels.cache.find(channel => channel.id === "657679783735328791")
    if(!channel) return;
    let departembed = new Discord.MessageEmbed()
        .setAuthor("// " + member.user.tag.toUpperCase(), member.user.displayAvatarURL())
        .setColor("#ECE8DF")
        .setImage("https://media.discordapp.net/attachments/466328575231000576/1017920437868572693/IMG_1545.png");
    channel.send(departembed);
    channel.send("<:VViron:830211752342847548> **" + `${member.user.tag}` + "** was shit anyway lmao")
});
//end leave message


//start confession system
bot.on("message", async message => {
 
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let arrayspot1 = messageArray[1];
    let randomTipChance2 = Math.floor(Math.random() * 7); // 0, 1, 2, 3, 4, 5, 6
    let tipList2 = ["did you know: this bot was coded in 8,381 lines!", "tip: if you're liking this bot, you should give kayla a thanks in the server ;)", "did you know: this bot never lies. ever.", "did you know: the bot is never finished, kayla is constantly adding more features for YOU :)", "tip: have a command suggestion? leave it in the requests channel", "did you know: if you play valorant and main phoenix, kayla might ban you 😃", "tip: having trouble with a coding assignment? ask kayla for help", "did you know: kayla coded this bot in js, but she also knows java, html, and a bit of python", "did you know: the reason why this bot restarts daily is because kayla's too poor to buy a better hosting server 😃", "tip: wish your economy progress on the bot wouldn't reset? donate to kayla so she can upgrade to better hosting servers", "did you know: kayla actually coded a bot before this one! it was pretty bad LOL", "did you know: kayla is always open to constructive criticism! leave an opinion on her bot", "did you know: kayla isn't the only programmer here! asante and stan are skilled coders too :)", "tip: see a problem with the bot? let kayla know!"];
    var selectedTip2 = tipList2[(Math.random() * tipList2.length) | 0];
    let randomTipChance3 = Math.floor(Math.random() * 10); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    let tipList3 = ["did you know: this bot was coded in 8,381 lines!", "tip: if you're liking this bot, you should give kayla a thanks in gen ;)", "did you know: this bot never lies. ever.", "tip: have a command suggestion? leave it in the requests channel", "did you know: these message submissions are entirely anonymous! or are they... 👀"];
    var selectedTip3 = tipList3[(Math.random() * tipList3.length) | 0];

    //start confess command
    if(cmd === `${prefix}confess`) {
     
        if(message.channel.type !== "dm") return message.channel.send("you have to use this in dms dummy");
        if (message.channel.type === "dm") {
        if(message.author.bot) return;
        var confession = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
        let rvalue = Math.floor(Math.random() * 256);
        let gvalue = Math.floor(Math.random() * 256);
        let bvalue = Math.floor(Math.random() * 256); 

        if(confession === `${prefix}confess`) {
         
            let stop2embed = new Discord.MessageEmbed()
                .setTitle("i don't think that's how it works...")
                .setColor("#FF0000")
                .addField("**missing argument**", "try using `*confess <message>`")
            return message.channel.send(stop2embed);
         
        } else if (confession.length >= 300) {
         
            let stop2embed = new Discord.MessageEmbed()
                .setTitle("sorry, your message is too long :(")
                .setColor("#FF0000")
                .addField("**character limit reached**", "your message has to be less than 300 characters for it to send to the confessions channel")
            return message.channel.send(stop2embed);
         
        } else {

            //change to a certain channel id
            const channel = bot.channels.cache.get('709101840494755910');
            const logchannel = bot.channels.cache.get('750189988939038890');


            var color = ((1 << 24) * Math.random() | 0).toString(16); //generates random hex value

            if (randomTipChance3 <= 1) {


                let confembed = new Discord.MessageEmbed()

                .setTitle("// NEW CONFESSION")
                .setColor(`#${color}`)
                .setDescription(confession)
                .setFooter(selectedTip3);
    
                 channel.send(confembed);
            } else {


 let confembed = new Discord.MessageEmbed()

            .setTitle("// NEW CONFESSION")
            .setColor(`#${color}`)
            .setDescription(confession)
            .setFooter("submitted by anonymous");

             channel.send(confembed);

            }

           

             if (randomTipChance2 >= 2) {


let sentembed = new Discord.MessageEmbed()

             .setTitle("**" + message.author.username + "**, your confession was sent!")
             .setColor("#fa1e36")
             .setDescription("find it in VV's <#709101840494755910> :thumbsup:")

             message.channel.send(sentembed);

            } else {
                let sentembed = new Discord.MessageEmbed()

                .setTitle("**" + message.author.username + "**, your confession was sent!")
                .setColor("#fa1e36")
                .setDescription("find it in VV's <#709101840494755910> :thumbsup:")
                .setFooter(selectedTip2)
   
                message.channel.send(sentembed);

                
            }

             

             let logembed = new Discord.MessageEmbed()

             .setTitle("// NEW CONFESSION")
             .setColor(`#${color}`)
             .setDescription("a new confession was just sent to <#709101840494755910>")
             .addField('"' + confession + '"', "sent by " + message.author.tag);


            logchannel.send(logembed);


        }
    }

    }
    


    });









 



//ALL commands
bot.on("message", async message => {
    

    if(message.channel.type === "dm") return;
    if(message.channel.id === "1017186970616741898") return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1); 
    let arrayspot1 = messageArray[1];


    let randomTipChance = Math.floor(Math.random() * 7); // 0, 1, 2, 3, 4, 5, 6
    let tipList = ["did you know: this bot was coded in 8,381 lines!", "tip: if you're liking this bot, you should give kayla a thanks in the server ;)", "did you know: this bot never lies. ever.", "did you know: the bot is never finished, kayla is constantly adding more features for YOU :)", "tip: have a command suggestion? leave it in the requests channel", "did you know: if you play valorant and main phoenix, kayla might ban you 😃", "tip: having trouble with a coding assignment? ask kayla for help", "did you know: kayla coded this bot in js, but she also knows java, html, and a bit of python", "did you know: the reason why this bot restarts daily is because kayla's too poor to buy a better hosting server 😃", "tip: wish your economy progress on the bot wouldn't reset? donate to kayla so she can upgrade to better hosting servers", "did you know: kayla actually coded a bot before this one! it was pretty bad LOL", "did you know: kayla is always open to constructive criticism! leave an opinion on her bot", "did you know: kayla isn't the only programmer here! asante and stan are skilled coders too :)", "tip: see a problem with the bot? let kayla know!"];

    var selectedTip = tipList[(Math.random() * tipList.length) | 0];




    //ex. hello everybody my names kayla
    //cmd = hello
    //args = everybody my names kayla
    //arrayspot1 = everybody

    




    let userColor = message.member.displayHexColor; //"message" is what makes this not work for users other than the author














//role rewards bc i'm not paying for mee6 premium LOL fuck that
if(message.author.id === "159985870458322944") { //if message comes from mee6

   

   
    const messagesplit = message.content.split(" ");
    let member = message.mentions.members.first();

    if (messagesplit[0] === "welcome") {





        if(messagesplit[3] === "1") {

                //all the role stuff goes here
                
                let role1 = message.guild.roles.cache.get("730862694441418765");

                member.roles.add(role1);

                


            

        } else if(messagesplit[3] === "3") {

                //all the role stuff goes here
                
                let role3 = message.guild.roles.cache.get("730862820953948191");

                member.roles.add(role3);


            
        } else if(messagesplit[3] === "5") {

                //all the role stuff goes here
                
                let role5 = message.guild.roles.cache.get("730863923862962299");

                member.roles.add(role5);

            
        } else if(messagesplit[3] === "10") {

                //all the role stuff goes here
                
                let role10 = message.guild.roles.cache.get("730863923988791296");

                member.roles.add(role10);


            
        } else if(messagesplit[3] === "15") {

                //all the role stuff goes here
                let role15 = message.guild.roles.cache.get("730864434158895174");

                member.roles.add(role15);

            
        } else if(messagesplit[3] === "17") {

                //all the role stuff goes here
                
                let role17 = message.guild.roles.cache.get("730864572948545546");

                member.roles.add(role17);
            
        } else if(messagesplit[3] === "20") {

                //all the role stuff goes here
                
                let role20 = message.guild.roles.cache.get("730864859536950440");

                member.roles.add(role20);

            
        } else if(messagesplit[3] === "25") {

                //all the role stuff goes here
                
                let role25 = message.guild.roles.cache.get("730865010414190653");

                member.roles.add(role25);

            
        } else if(messagesplit[3] === "30") {

                //all the role stuff goes here
              
                let role30 = message.guild.roles.cache.get("730865187334258721");

                member.roles.add(role30);

            
        } else if(messagesplit[3] === "35") {

                //all the role stuff goes here
                
                let role35 = message.guild.roles.cache.get("730865381027348522");

                member.roles.add(role35);

            
        } else if(messagesplit[3] === "40") {

                //all the role stuff goes here
           
                let role40 = message.guild.roles.cache.get("730865535176146954");

                member.roles.add(role40);

            
        } else if(messagesplit[3] === "45") {

                //all the role stuff goes here
                let role45 = message.guild.roles.cache.get("730865903918645390");

                member.roles.add(role45);

            
        } else if(messagesplit[3] === "50") {

                //all the role stuff goes here
                let role50 = message.guild.roles.cache.get("730866047233818634");

                member.roles.add(role50);

            
        
        } else if(messagesplit[3] === "60") {

            //all the role stuff goes here
            let role60 = message.guild.roles.cache.get("739136532576862218");

            member.roles.add(role60);

        
    
    } else if(messagesplit[3] === "70") {

        //all the role stuff goes here
        let role70 = message.guild.roles.cache.get("739136763548795021");

        member.roles.add(role70);

    

} else if(messagesplit[3] === "80") {

    //all the role stuff goes here
    let role80 = message.guild.roles.cache.get("739136913151230034");

    member.roles.add(role80);



} else if(messagesplit[3] === "90") {

    //all the role stuff goes here
    let role90 = message.guild.roles.cache.get("739137025008992316");

    member.roles.add(role90);



} else if(messagesplit[3] === "100") {

    //all the role stuff goes here
    let role100 = message.guild.roles.cache.get("739137131460427826");

    member.roles.add(role100);



}
















    }











































}



   









if (message.content.includes('discord.gg/'||'discordapp.com/invite/' || 'discord.com/invite' || '.gg/')) {


    if(message.member.hasPermission("MANAGE_MESSAGES")){

        return;
        
        
    } else {
        
        
        
        
        
        message.delete();
    (message.channel.send('**' + message.author.username + "** no server links idot"))
    .then(message => {
        message.delete({timeout:4000})
    }).catch(console.error);

    }

    }
  







 



//START SERVER COMMANDS

if(!message.member.nickname || message.member.nickname) {

    




/*
 
    
  //AFK SYSTEM
 if (cmd === `${prefix}afk`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;

    if (db.has(message.author.id + '.afk')) {
        message.channel.send(`**${message.author.tag}**, you're already afk you can't do it twice, caught in 4k :camera_with_flash:`).then(message => {
            message.delete({timeout:7000})
        }).catch(console.error);

    } else {

    

    

    let args = message.content.substring(prefix.length).split(" ");
    let reason = `${args.join(" ") ? args.join(" ") : "afk"}`;

    let newReason = reason.substring(4);

    let beforeNick = message.member.nickname;


       
    switch(args[0]) {
        case 'afk':
            if(beforeNick !== null) {
                if(beforeNick.includes(`[AFK]`)){

                        message.channel.send(`**${message.author.tag}**, [AFK] is already in your name, so i went ahead and set your status to afk :thumbsup:`)
                

                } else {
message.member.setNickname(`[AFK] ${message.member.nickname}`).catch((err) => {
                    message.channel.send(`**${message.author.tag}**, i couldn't change your name but i still set your status to afk :thumbsup:`)
                })

                }
                
            } else if (beforeNick === null) {
                if(message.author.username.includes(`[AFK]`)) {
                    message.channel.send(`**${message.author.tag}**, [AFK] is already in your name, so i went ahead and set your status to afk :thumbsup:`)



                } else { 
                    message.member.setNickname(`[AFK] ${message.author.username}`).catch((err) => {
                    message.channel.send(`**${message.author.tag}**, i couldn't change your name but i still set your status to afk :thumbsup:`)

            })
                }
                

            }
            
            db.set(message.author.id + '.afk', 'true');
            db.set(message.author.id + '.message', newReason);
            let afkembed = new Discord.MessageEmbed()
        .setColor(userColor)
        .setDescription(`**${message.author.tag}** is now afk\n\n**reason:** ${newReason}`)
        .setFooter("⚠️ to keep bot storage fresh, afk statuses are removed randomly every 24 hours");
        message.channel.send(afkembed);
        status.set(message.author.id, newReason || `afk`);

        }
    }
    
}







     //THIS IS WHAT SEARCHES FOR THE AFK USER BEING MENTIONED IN ANY MESSAGE
     if (message.author.bot) return;
     message.mentions.users.forEach(user => {
         if(db.has(user.id + '.afk')) {
 
             let mentionembed = new Discord.MessageEmbed()
             .setColor(userColor)
             .setDescription(`**${user.tag}** is afk, leave them alone weirdo :neutral_face:\n\n**reason:** ` + db.get(user.id + '.message'));                
             message.channel.send(mentionembed).then(message => {
                message.delete({timeout:7000})
            }).catch(console.error);
 
             
         }
 
     })






     //THIS IS WHAT REMOVES THE AFK


 if (db.has(message.author.id + '.afk')) {

    let nickpt3 = message.member.nickname.substring(message.member.nickname.indexOf(" ") + 1, message.member.nickname.length);
     let fixedNick = nickpt3.replace('[AFK]', '');

    if(message.member.nickname.includes(`[AFK]`)){
        message.member.setNickname(fixedNick).catch((err) => {
            return;
        })
    }

   
   let returnembed = new Discord.MessageEmbed()
       .setColor(userColor)
       .setDescription(`welcome back **${message.author.tag}**, you're no longer afk <:VV_peepolove:729799462695731201>`);
       message.channel.send(returnembed).then(message => {
           message.delete({timeout:7000})
       }).catch(console.error);



    
       db.delete(message.author.id + '.afk');
       db.delete(message.author.id + '.message');
   
}

*/












/*
   


if (cmd === `${prefix}ranksetup`) {
    
        if(message.member.hasPermission("ADMINISTRATOR")) {
    
    
             message.channel.send("https://cdn.discordapp.com/attachments/723691178977001494/839127730133925938/rank.png");
    
             
             message.channel.send("<:VVunranked:839128198162808862> <:VVdot:809087399094124624> **unranked**\n<:VViron:830211752342847548> <:VVdot:809087399094124624> **iron**\n<:VVbronze:830211792323084328> <:VVdot:809087399094124624> **bronze**\n<:VVsilver:830211820693225492> <:VVdot:809087399094124624> **silver**\n<:VVgold:830211856034955284> <:VVdot:809087399094124624> **gold**\n<:VVplatinum:830211894505766922> <:VVdot:809087399094124624> **platinum**\n<:VVdiamond:830211939199615016> <:VVdot:809087399094124624> **diamond**\n<:VVascendant:992557076213661767> <:VVdot:809087399094124624> **ascendant**\n<:VVimmortal:830211964374351893> <:VVdot:809087399094124624> **immortal**\n<:VVradiant:830212022166618152> <:VVdot:809087399094124624> **radiant**")
                
     
            
        }
     
     
     
    }


if (cmd === `${prefix}rulessetup`) {
    
    if(message.member.hasPermission("ADMINISTRATOR")) {
 
 
 
 
        message.channel.send("https://cdn.discordapp.com/attachments/723691178977001494/839124591414345768/serverrules.png");
        message.channel.send("<:VVdot:809087399094124624> **this server is 18+ only**  //  members younger than 18 will not be granted full access to the server\n\n<:VVdot:809087399094124624> **restrict all nsfw content to <#734526660530929676>**  //  nsfw is prohibited in all other channels, including <#765986060089294899>\n\n<:VVdot:809087399094124624> **keep flood and spam in <#661705313329872946>**  //  otherwise the server will auto mute you and nobody will care lol\n\n<:VVdot:809087399094124624> **mods will moderate as they see fit and their word is final**  //  if you cry we will just ban you\n\n<:VVdot:809087399094124624> **follow all official discord tos (https://discord.com/terms)**  //  any violation of the tos is a bannable offense")
 
       
    }
  
 
}


if (cmd === `${prefix}lfgsetup`) {
    
    if(message.member.hasPermission("ADMINISTRATOR")) {
 
        message.channel.send("https://cdn.discordapp.com/attachments/724028063943229600/855991005102080000/info.png");

         message.channel.send("<:VVdot:809087399094124624> **what is the <#814310050653929473> channel?**  //  the looking for group channel is dedicated to helping players gather and find others to party up with\n\n<:VVdot:809087399094124624> **what is the <@781914063000829963> bot?**  //  the https://valking.gg bot can connect to your valorant profile and show your match history, stats, rank and more right here in the server (start by typing `!v profile` followed by your valorant name and tag)")


         message.channel.send("https://cdn.discordapp.com/attachments/723691178977001494/839127727071952946/lfgrole.png");

         
         message.channel.send("<:VVdot:809087399094124624> **what are lfg roles?**  //  below are pingable roles to help you find friends to party up with (they are removable by taking off your reaction)\n\n<:VVdot:809087399094124624> **if the roles are pingable, why can't i mention them?**  //  for better organization, the lfg roles can only be pinged by using the `*lfgping` command, which won't work at all if you don't have the <@&736376787461734443> role or if you use it outside of <#814310050653929473>\n\n<:VV1:816071548392701972> **lfg  //  unrated**\n<:VV2:816071548401745930> **lfg  //  competitive**\n<:VV3:816071548229517323> **lfg  //  scrims + custom**\n<:VV4:816071548376317982> **lfg  //  other**")
            
         
        
    }
  
 
 
}

if(cmd === `${prefix}infosetup`) {
    if(message.member.hasPermission("ADMINISTRATOR")) {

        message.channel.send("https://cdn.discordapp.com/attachments/724028063943229600/855991613913432074/ac7ad86cf1bf81a9723f90f658bd4805.png");
        message.channel.send("<:VVdot:809087399094124624> **<#847148033220935730>**  //  info on our friendly VALORANT scrims :)\n<:VVdot:809087399094124624> **<#847908733760831528>**  //  VALORANT patch notes, updates, and leaks\n<:VVdot:809087399094124624> **<#814310050653929473>**  //  role ping for teammates here (read <#816054926673051708>)\n\n<:VVdot:809087399094124624> **<#948619169673412610>**  //  our extremely funny yt channel\n<:VVdot:809087399094124624> **<#995378714026188800>**  //  pins that deserve jail time\n<:VVdot:809087399094124624> **<#718606483008258108>**  //  nitro, gift card, and other prize drawings\n<:VVdot:809087399094124624> **<#709101840494755910>**  //  anonymous message submissions\n<:VVdot:809087399094124624> **<#733047370429890570>**  //  expose yourself channel\n<:VVdot:809087399094124624> **<#742343439944908861>**  //  show off game screenshots and recordings\n<:VVdot:809087399094124624> **<#765986060089294899>**  //  promo for artists and creators");

        message.channel.send("https://cdn.discordapp.com/attachments/724028063943229600/855991726086684722/443965ed78a78c4aeaf0bc76ef129c87.png");
        message.channel.send("<:VVdot:809087399094124624> **🔊 ❦﹒ted talks**  //  totally organized and civil debates and discussions\n<:VVdot:809087399094124624> **🔈 ❦﹒gen**  //  main hangout channel\n<:VVdot:809087399094124624> **🔈 ❦﹒duo**  //  private e-sex channel\n<:VVdot:809087399094124624> **🔈 ❦﹒gaming gen**  //  private e-orgy channel\n<:VVdot:809087399094124624> **🔈 ❦﹒mods**  //  channel where we shit talk in secret lmao");

        message.channel.send("https://cdn.discordapp.com/attachments/724028063943229600/855992012771426304/0fe722120e9cd5e65dcb2b5db6f161be.png");
        message.channel.send("<:VVdot:809087399094124624> <:VVchampions:992866466909126746> **<@&717584227323084811>**  //  admin perms\n<:VVdot:809087399094124624> <:VVmasters:992866501168205824> **<@&657681803036983307>**  //  chat mod perms\n<:VVdot:809087399094124624> <:VVchallengers:992867585706164284> **<@&992867519218057276>**  //  vc mod perms\n\n<:VVdot:809087399094124624> **<@&830827670207856662>**  //  the 10 members with the highest MEE6 rank\n<:VVdot:809087399094124624> **<@&721361389871956039>**  //  have access to the mod vc and confession logs\n<:VVdot:809087399094124624> **<@&750192761810190406>**  //  members who boosted in the last 30 days\n<:VVdot:809087399094124624> **<@&707656927328337920>**  //  reserved for close friends of the mods");

}

}






if (cmd === `${prefix}gamerolesetup`) {
    
    if(message.member.hasPermission("ADMINISTRATOR")) {
 
 
 
         message.channel.send("https://cdn.discordapp.com/attachments/749674536575696956/787750175166431262/image0.gif")

        message.channel.send("https://cdn.discordapp.com/attachments/723691178977001494/841298977995227146/gameroles.png");
        message.channel.send("<:VVpepecrydistort:748298293401878619> <:VVdot:809087399094124624> **valorant**\n<:VVsadge:831507292784164874> <:VVdot:809087399094124624> **apex**\n<:VVyikes:786597019606974474> <:VVdot:809087399094124624> **overwatch**\n<:VVstan:733028845753466951> <:VVdot:809087399094124624> **csgo**\n<:VVpepeweird:838796134386368512> <:VVdot:809087399094124624> **minecraft // bedrock**\n<:VVpepehype:733867827756400691> <:VVdot:809087399094124624> **minecraft // java**\n<:VVpeepoL:734459303167262741> <:VVdot:809087399094124624> **league of legends**\n<:VVpepehang:788215918803157042> <:VVdot:809087399094124624> **roblox**\n<:VVfeelsslowman:732308456656338975> <:VVdot:809087399094124624> **among us**")

        
 
       
    }
 
 
 
}


if (cmd === `${prefix}personalsetup`) {
    
    if(message.member.hasPermission("ADMINISTRATOR")) {
 
 
 
//LOCATION
        message.channel.send("https://cdn.discordapp.com/attachments/723691178977001494/841305013498019870/location.png");
        message.channel.send(":red_circle: <:VVdot:809087399094124624> **na // east**\n:blue_circle: <:VVdot:809087399094124624> **na // central**\n:yellow_circle: <:VVdot:809087399094124624> **na // mountain**\n:green_circle: <:VVdot:809087399094124624> **na // west**\n:orange_circle: <:VVdot:809087399094124624> **na // other**\n:red_square: <:VVdot:809087399094124624> **south america**\n:blue_square: <:VVdot:809087399094124624> **europe**\n:yellow_square: <:VVdot:809087399094124624> **africa**\n:green_square: <:VVdot:809087399094124624> **asia**\n:orange_square: <:VVdot:809087399094124624> **australia**")

 //GENDER
 message.channel.send("https://cdn.discordapp.com/attachments/723691178977001494/841304923349450782/gender.png");
 message.channel.send(":mens: <:VVdot:809087399094124624> **male**\n:womens: <:VVdot:809087399094124624> **female**\n:white_large_square: <:VVdot:809087399094124624> **other**")



 //EXTRA
 message.channel.send("https://cdn.discordapp.com/attachments/708821607639941280/1017881267062194326/unknown.png")
 message.channel.send("🈵 <:VVdot:809087399094124624> **nitro ping**\n🈺 <:VVdot:809087399094124624> **events ping**\n🈯 <:VVdot:809087399094124624> **server update ping**\n🈂️ <:VVdot:809087399094124624> **VALORANT news ping**")


    }}

 



if (cmd === `${prefix}agentsetup`) {
    
    if(message.member.hasPermission("ADMINISTRATOR")) {


         message.channel.send("https://media.discordapp.net/attachments/723691178977001494/839127735451648100/agent.png");

         
         message.channel.send("<:VVbrimstone:857067245284229120> <:VVdot:809087399094124624> **brimstone**\n<:VVviper:857067313760829480> <:VVdot:809087399094124624> **viper**\n<:VVomen:857067891651641375> <:VVdot:809087399094124624> **omen**\n<:VVwidejoy:925551980322107452> <:VVdot:809087399094124624> **killjoy**\n<:VVcypher:857067594158178335> <:VVdot:809087399094124624> **cypher**\n<:VVsova:857067710135140382> <:VVdot:809087399094124624> **sova**\n<:VVsage:857068029430726656> <:VVdot:809087399094124624> **sage**\n<:VVphoenix:857067832717344778> <:VVdot:809087399094124624> **phoenix**\n<:VVjett:857067815701970964> <:VVdot:809087399094124624> **jett**\n<:VVreyna:857068002645508153> <:VVdot:809087399094124624> **reyna**\n<:VVraze:857067910127681567> <:VVdot:809087399094124624> **raze**\n<:VVbreach:857067474514870302> <:VVdot:809087399094124624> **breach**\n<:VVskye:857068097580302346> <:VVdot:809087399094124624> **skye**\n<:VVyoru:857067369943531521> <:VVdot:809087399094124624> **yoru**\n<:VVastra:857067420015656980> <:VVdot:809087399094124624> **astra**\n<:VVkayo:857068381290758144> <:VVdot:809087399094124624> **kay/o**\n<:VVchamber:910951475969130516> <:VVdot:809087399094124624> **chamber**\n<:VVneon:931179725777403915> <:VVdot:809087399094124624> **neon**\n<:VVfade:973661290960658493> <:VVdot:809087399094124624> **fade**\n<:VVharbor:1035640817756405790> <:VVdot:809087399094124624> **harbor**");
            
 
        
    }
 
 
 
}


}
*/




    //*help, command list + description (embed)
    if(message.content === `${prefix}help`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        /*var d = new Date,
        dformat = [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');*/


        //initialize embed
        let helpembed = new Discord.MessageEmbed()

        .setDescription("\n\ncurrent prefix: `" + `${prefix}` + "` \n\nfor help with any specific command, use `" + `${prefix}` + "help <command>`")
        .setTitle("// HELP • COMMAND LIST")
        .setThumbnail("https://cdn.discordapp.com/attachments/657679783735328791/751222027423055992/image0.jpg")
        .setColor(userColor)
        .addField("**VALORANT** (1)", "`lfgping`")
        .addField("**FUN** (11)", "`confess`, `fortune`, `approve`, `say`, `mock`, `8ball`, `ship`, `pp`, `rate`, `typetest`, `typetestlb`")
        .addField("**UTILITY** (7)", "`nick`, `avatar`, `botinfo`, `serverinfo`, `calc`, `ping`, `clear`")
        .addField("**EXTRA** (7)", "`choose`, `flip`, `roll`, `f`, `kittyreview`, `bingus`, `custom`")
        .addField("**[ALPHA] ECONOMY** (11)", "`spawn`, `start`, `balance`, `inventory`, `weekly`, `daily`, `hourly`, `shop`, `buy`, `give`, `rob`")
        


        .setFooter("this bot was coded by kayla ;)");

        

        return message.channel.send(helpembed);

    }

    //command-specific *help commands
    /*
   
   if(message.content === `${prefix}help top`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helptopembed = new Discord.MessageEmbed()

    .setDescription("lists users from richest to brokest dirtiest ugliest :heart_eyes:" + "\n`" + `${prefix}top` + "`")
    .setTitle('"top" command')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helptopembed);
} 


if(message.content === `${prefix}help hangman`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helplfgembed = new Discord.MessageEmbed()

    .setDescription("starts a SUPER FUN game of hangman with only VALORANT related words <:VVlipbite:835194764215189545>\n(work in progress)" + "\n`" + `${prefix}lfg` + "`")
    .setTitle('// HANGMAN COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helplfgembed);
}
*/

if(message.content === `${prefix}help fortune`) { // these **have to use message.content** because cmd is defined as messageArray[0]
                                                    // can't use cmd because `${prefix}help fortune` is 2 elements instead of 1
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpfortuneembed = new Discord.MessageEmbed()

    .setDescription("yes i am totally a legitimate fortune teller :sparkles:" + "\n`" + `${prefix}fortune` + "`")
    .setTitle('// FORTUNE COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpfortuneembed);
}

/*
if(message.content === `${prefix}help valquiz`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpvalquizembed = new Discord.MessageEmbed()

    .setDescription("answer trivia questions with your friends about the VALORANT agents (all answers are 100000% true and not biased :smiley::thumbsup:)\nthumbnail art creds: https://www.reddit.com/user/Woorilla/" + "\n`" + `${prefix}valquiz` + "`")
    .setTitle('// VALQUIZ COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpvalquizembed);
}

if(message.content === `${prefix}help agentquiz`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpagentquizembed = new Discord.MessageEmbed()

    .setDescription("wanna know what valorant agent you're similar to? take this totally one million percent accurate quiz!" + "\n`" + `${prefix}agentquiz` + "`")
    .setTitle('// AGENTQUIZ COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpagentquizembed);
}*/
if(message.content === `${prefix}help bingus`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpbingusembed = new Discord.MessageEmbed()

    .setDescription("SENDS A RANDOM BINGUS GIF!!! <:VVbingus:833690189037043742>" + "\n`" + `${prefix}bingus` + "`")
    .setTitle('// BINGUS COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpbingusembed);
}

if(message.content === `${prefix}help kittyreview`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpkittyreviewembed = new Discord.MessageEmbed()

    .setDescription("SENDS A RANDOM KITTY REVIEW!!! :cat:" + "\n`" + `${prefix}kittyreview` + "`")
    .setTitle('// KITTYREVIEW COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpkittyreviewembed);
}
if(message.content === `${prefix}help typetestlb`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helptypetestlbembed = new Discord.MessageEmbed()

    .setDescription("shows a list of the fastest typers in VV (only 70+ WPM)" + "\n`" + `${prefix}typetestlb` + "`")
    .setTitle('// TYPETESTLB COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helptypetestlbembed);
}

if(message.content === `${prefix}help typetest`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helptypetestembed = new Discord.MessageEmbed()

    .setDescription("think you can type fast? i'll give you a random prompt to type out and then we'll see if you're a fast typer or not :smirk:" + "\n`" + `${prefix}typetest` + "`")
    .setTitle('// TYPETEST COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helptypetestembed);
}



if(message.content === `${prefix}help lfgping`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helplfgpingembed = new Discord.MessageEmbed()

    .setDescription("lets you ping one of our four lfg roles for valorant" + "\n`" + `${prefix}lfgping` + "`\n(can't be used without the <@&736376787461734443> role or outside of <#814310050653929473>)")
    .setTitle('// LFGPING COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helplfgpingembed);
}
/*

if(message.content === `${prefix}help lfg`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helplfgembed = new Discord.MessageEmbed()

    .setDescription("puts you on a list of people looking for others to queue valorant with" + "\n`" + `${prefix}lfg` + "`")
    .setTitle('// LFG COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helplfgembed);
}
if(message.content === `${prefix}help lfgremove`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helplfgremoveembed = new Discord.MessageEmbed()

    .setDescription("removes you from the valorant lfg list" + "\n`" + `${prefix}lfgremove` + "`")
    .setTitle('// LFGREMOVE COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helplfgremoveembed);
}
if(message.content === `${prefix}help lfglist`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helplfglistembed = new Discord.MessageEmbed()

    .setDescription("shows an list of people looking for a team on valorant" + "\n`" + `${prefix}lfglist` + "`")
    .setTitle('// LFGLIST COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helplfglistembed);
}
*/

if(message.content === `${prefix}help spawn`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpspawnembed = new Discord.MessageEmbed()

    .setDescription("grants a certain amount of money to the user" + "\n`" + `${prefix}spawn` + "`\n(owners only)")
    .setTitle('// SPAWN COMMAND')

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpspawnembed);
}
if(message.content === `${prefix}help inventory`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpinventoryembed = new Discord.MessageEmbed()

    .setDescription("shows all your precious items" + "\n`" + `${prefix}inventory` + "` or `" + `${prefix}inventory <user>` + "`")
    .setTitle('// INVENTORY COMMAND')
    .addField("aliases", "`" + `${prefix}inv` + "`")

    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpinventoryembed);
}

if(message.content === `${prefix}help buy`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpbuyembed = new Discord.MessageEmbed()

    .setDescription("what you do at the shop...duh" + "\n`" + `${prefix}buy <item number>` + "`")
    .setTitle('// BUY COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpbuyembed);
}

if(message.content === `${prefix}help shop`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpshopembed = new Discord.MessageEmbed()

    .setDescription("shows all purchasable items in the shop <:VVpepehype:733867827756400691>" + "\n`" + `${prefix}shop` + "`")
    .setTitle('// SHOP COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpshopembed);
}

   if(message.content === `${prefix}help balance`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpbalanceembed = new Discord.MessageEmbed()

    .setDescription("allows you to check how much money you have (probably none cuz you're homeless :smiley:)" + "\n`" + `${prefix}balance` + "` or `" + `${prefix}balance <user>` + "`")
    .addField("aliases", "`" + `${prefix}bal` + "`")
    .setTitle('// BALANCE COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpbalanceembed);
}

if(message.content === `${prefix}help weekly`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpweeklyembed = new Discord.MessageEmbed()

    .setDescription("gives you a random amount of coins between 0 and 1500 once a week" + "\n`" + `${prefix}weekly` + "`")
    .setTitle('// WEEKLY COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpweeklyembed);
}

if(message.content === `${prefix}help hourly`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helphourlyembed = new Discord.MessageEmbed()

    .setDescription("gives you a random amount of coins between 0 and 100 once an hour" + "\n`" + `${prefix}hourly` + "`\n(vips only)")
    .setTitle('// HOURLY COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helphourlyembed);
}
if(message.content === `${prefix}help daily`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpdailyembed = new Discord.MessageEmbed()

    .setDescription("gives you a random amount of coins between 0 and 500 once a day" + "\n`" + `${prefix}daily` + "`")
    .setTitle('// DAILY COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpdailyembed);
}
   if(message.content === `${prefix}help start`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpstartembed = new Discord.MessageEmbed()

    .setDescription("creates your economy account <:VVpepehype:733867827756400691> you have to use this before you can use any other economy commands" + "\n`" + `${prefix}start` + "`")
    .setTitle('// START COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpstartembed);
}
   if(message.content === `${prefix}help choose`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpchooseembed = new Discord.MessageEmbed()

    .setDescription("if you're a shitty decision maker i can make decisions for you instead :smiley:" + "\n`" + `${prefix}choose <option 1>, <option 2>, etc.` + "`")
    .setTitle('// CHOOSE COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpchooseembed);
}
/*
   if(message.content === `${prefix}help afk`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpafkembed = new Discord.MessageEmbed()

    .setDescription("for when you go afk...duh" + "\n`" + `${prefix}afk` + "` or `" + `${prefix}afk <reason>` + "`")
    .setTitle('// AFK COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpafkembed);
}*/
if(message.content === `${prefix}help nick`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpnickembed = new Discord.MessageEmbed()

    .setDescription("for some reason people don't know how to change their own nickname :face_with_raised_eyebrow: sooo they can use this instead" + "\n`" + `${prefix}nick <name>` + "`")
    .setTitle('// NICK COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpnickembed);
}

   if(message.content === `${prefix}help calc`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpcalcembed = new Discord.MessageEmbed()

    .setDescription("use this command to get me to do your math homework for you\nsupports numbers, big numbers, complex numbers, fractions, units, strings, arrays, and matrices" + "\n`" + `${prefix}calc <expression>` + "`")
    .setTitle('// CALC COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpcalcembed);
}
if(message.content === `${prefix}help ping`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helppingembed = new Discord.MessageEmbed()

    .setDescription("shows the bot's current ping in the server" + "\n`" + `${prefix}ping` + "`")
    .setTitle('// PING COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helppingembed);
}
/*
if(message.content === `${prefix}help snipe`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let helpsnipeembed = new Discord.MessageEmbed()

    .setDescription("the classic snipe command but made better (can recover images)" + "\n`" + `${prefix}snipe` + "`")
    .setTitle('// SNIPE COMMAND')
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(helpsnipeembed);
}*/
    if(message.content === `${prefix}help approve`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;
        let helpapproveembed = new Discord.MessageEmbed()

        .setDescription("i will judge what you present to me and i'll give it a rating from 1 to 10" + "\n`" + `${prefix}approve <message>` + "`")
        .setTitle('// APPROVE COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpapproveembed);
    }
    if(message.content === `${prefix}help ship`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpshipembed = new Discord.MessageEmbed()

        .setDescription("finds your love compatibility with someone else :smiling_face_with_3_hearts:" + "\n`" + `${prefix}ship <@user>` + "` or `" + `${prefix}ship <message>` + "`") // + "` or `" + `${prefix}ship` + " <@user> <@user>`"
        .setTitle('// SHIP COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpshipembed);
    }
    if(message.content === `${prefix}help pp`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpppembed = new Discord.MessageEmbed()

        .setDescription("gives an accurate peepee description :hotdog:" + "\n`" + `${prefix}pp` + "` or `" + `${prefix}pp <@user>` + "`") // + "` or `" + `${prefix}ship` + " <@user> <@user>`"
        .setTitle('// PP COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpppembed);
    }
    if(message.content === `${prefix}help rate`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helprateembed = new Discord.MessageEmbed()

        .setDescription("gives an accurate rating on your looks" + "\n`" + `${prefix}rate` + "` or `" + `${prefix}rate <@user>` + "`") // + "` or `" + `${prefix}ship` + " <@user> <@user>`"
        .setTitle('// RATE COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helprateembed);
    }
    if(message.content === `${prefix}help clear`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpclearembed = new Discord.MessageEmbed()

        .setDescription("deletes a bunch of messages for you" + "\n`" + `${prefix}clear <number>` + "`\n(mods only)") // + "` or `" + `${prefix}ship` + " <@user> <@user>`"
        .setTitle('// CLEAR COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpclearembed);
    }
    if(message.content === `${prefix}help say`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpsayembed = new Discord.MessageEmbed()

        .setDescription("repeats what you say" + "\n`" + `${prefix}say <message>` + "`")
        .setTitle('// SAY COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpsayembed);
    }
    /*
    if(message.content === `${prefix}helproulette`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helprouletteembed = new Discord.MessageEmbed()

        .setDescription("starts a game of roulette where the loser faces punishment :gun: (still in progress)" + "\n`" + `${prefix}roulette` + "`\n(admins only)")
        .setTitle('"roulette" command')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helprouletteembed);
    }
  */
    if(message.content === `${prefix}help confess`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpconfessembed = new Discord.MessageEmbed()

        .setDescription("sends your message anonymously to <#709101840494755910>" + "\n`" + `${prefix}confess <message>` + "`\n(this command must be used in bot dms)")
        .setTitle('// CONFESS COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpconfessembed);
    }  
    if(message.content === `${prefix}help rob`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helprobembed = new Discord.MessageEmbed()

        .setDescription("for when you're too lazy to make an income yourself :smirk:" + "\n`"+ `${prefix}rob` + " <@user>`\n(without added buffs from the shop it only works 10% of the time)")
        .setTitle('// ROB COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helprobembed);
    }
    if(message.content === `${prefix}help give`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpgiveembed = new Discord.MessageEmbed()

        .setDescription("allows you to give money (not items) to someone else" + "\n`"+ `${prefix}give` + " <@user>`")
        .setTitle('// GIVE COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpgiveembed);
    }
    if(message.content === `${prefix}help avatar`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpavatarembed = new Discord.MessageEmbed()

        .setDescription("displays the avatar of the designated user" + "\n`" + `${prefix}avatar` + "` or `" + `${prefix}avatar` + " <@user>`")
        .addField("aliases", "`" + `${prefix}av` + "`")
        .setTitle('// AVATAR COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpavatarembed);
    }
    if(message.content === `${prefix}help botinfo`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpbotinfoembed = new Discord.MessageEmbed()

        .setDescription("displays info about this bot" + "\n`" + `${prefix}botinfo` + "`")
        .setTitle('// BOTINFO COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpbotinfoembed);
    }
    if(message.content === `${prefix}help serverinfo`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpserverinfoembed = new Discord.MessageEmbed()

        .setDescription("displays info about this server" + "\n`" + `${prefix}serverinfo` + "`")
        .setTitle('// SERVERINFO COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpserverinfoembed);
    }
    /*
    if(message.content === `${prefix}help announce`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpannounceembed = new Discord.MessageEmbed()

        .setDescription("sends your announcement to <#710009723306639421>" + "\n`" + `${prefix}announce <message>` + "`\n (mods only)")
        .setTitle('// ANNOUNCE COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpannounceembed);
    }
    */
    if(message.content === `${prefix}help flip`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpflipembed = new Discord.MessageEmbed()

        .setDescription("flips a coin that lands on either heads or tails" + "\n`" + `${prefix}flip` + "`")
        .setTitle('// FLIP COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpflipembed);
    }
    if(message.content === `${prefix}help roll`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helprollembed = new Discord.MessageEmbed()

        .setDescription("rolls randomly out of a number you choose (if you don't choose, it rolls out of six)" + "\n`" + `${prefix}roll` + "` or `" + `${prefix}roll` + " <number>`")
        .setTitle('// ROLL COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helprollembed);
    }
    if(message.content === `${prefix}help f`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpfembed = new Discord.MessageEmbed()

        .setDescription("use this when someone deserves a pat on the back" + "\n`" + `${prefix}f` + "` or `" + `${prefix}f` + " <messsage>`")
        .setTitle('// F COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpfembed);

    }
    if (message.content === `${prefix}help 8ball`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let help8ballembed = new Discord.MessageEmbed()

        .setDescription("you can finally get the answers to your burning questions :8ball:" + "\n`" + `${prefix}8ball <question>` + "`")
        .setTitle('// 8BALL COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(help8ballembed);
    }

    /*
    if (message.content === `${prefix}help vote`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpvoteembed = new Discord.MessageEmbed()

        .setDescription("starts a vote poll :white_check_mark::negative_squared_cross_mark:" + "\n`" + `${prefix}vote <question>` + "`")
        .setTitle('"vote" command')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpvoteembed);
    }*/
    if(message.content === `${prefix}help custom`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpcustomembed = new Discord.MessageEmbed()

        .setDescription("shows a list of custom commands" + "\n`" + `${prefix}custom` + "`")
        .setTitle('// CUSTOM COMMAND')
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpcustomembed);
    }
    if(message.content === `${prefix}help mock`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let helpmockembed = new Discord.MessageEmbed()

        .setDescription("lEt'S yOu tAlK lIkE tHiS" + "\n`" + `${prefix}mock <message>` + "`")
        .setTitle('// MOCK COMMAND')
        .setThumbnail("https://cdn.discordapp.com/attachments/661705313329872946/751017847936909353/kayla-ran-this-command.gif")
        .setColor('#f7e948')
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(helpmockembed);
    }






//work in progress
/*
    if(cmd === `${prefix}embed`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;



        message.channel.send("**" + message.author.username + "**, you've just started the embed creator!\ntype what you want to go in the `title` of the embed\nif you want the title empty, type `NONE`");
        let title = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if (title != "NONE") {

            message.channel.send("type what you want to go in the `description` of the embed\n(this is **required**)");
            let desc = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

            if(desc) {

                message.channel.send("type what you want to go in the `footer` of the embed\nif you want the footer empty, type `NONE`");
                let footer = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);


                if(footer != "NONE") {



                    let newembed = new Discord.MessageEmbed()
                    .setTitle(title)
                    .setDescription(desc)
                    .setFooter(footer)

                    message.channel.send(newembed);

                } else {
                    let newembed = new Discord.MessageEmbed()
                    .setTitle(title)
                    .setDescription(desc)

                    message.channel.send(newembed);

                }


                
            }


            





        } else {

            message.channel.send("type what you want to go in the `description` of the embed\n(this is **required**)");
            let desc = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

            if(desc) {

                message.channel.send("type what you want to go in the `footer` of the embed\nif you want the footer empty, type `NONE`");
                let footer = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);


                if(footer != "NONE") {



                    let newembed = new Discord.MessageEmbed()
                    .setDescription(desc)
                    .setFooter(footer)

                    message.channel.send(newembed);

                } else {
                    let newembed = new Discord.MessageEmbed()
                    .setDescription(desc)

                    message.channel.send(newembed);

                }


                
            }


        }



















    }




*/

/*

if(cmd === `${prefix}top`) {





    }*/

    if(cmd === `${prefix}rob`) {
        if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    let target = message.mentions.users.first();

    if(!target) return message.channel.send("psst, this command doesn't work without pinging someone dummy");


    let targetBalance = db.get(`user.${target.id}.balance`)

    const cooldown = jailCooldown.get(message.author.id); // 1 hour in jail

    const targetcooldown = jailCooldown.get(target.id);


   




        if (!db.get(`user.${message.author.id}`)) {


            message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")

        } else if (cooldown) {


            const timeremaining = Duration(cooldown - Date.now(), {units : ['m', 's'], round: true})


            message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`")







        } else if (!target) {





        message.channel.send("if you're gonna rob someone you should at least be smart... you have to say who you want to rob (use `" + `${prefix}rob` + " <@user>`)");



        } else {

            if ((!db.get(`user.${target.id}`))) {

                if(target.bot) {
                    message.channel.send("that's a bot lol")
                } else {
                    message.channel.send("that person didn't create an economy account yet :frowning: (they can make one by typing `" + `${prefix}start` + "`)")
    
                }
    
    
     
            } else if (`${target.id}` === `${message.author.id}`) {

                message.channel.send("you can't rob yourself silly goose")
  


            } else {



                let chance = Math.floor(Math.random() * 10) //0, 1, 2, 3, 4, 5, 6, 7, 8, 9

                if (targetBalance == 0 || null) {

                    message.channel.send("how are you gonna steal from someone who's LITERALLY broke LMAO (no offense **" + target.username + "**)")




                } else if (targetBalance <= 50) {

                    message.channel.send("what are you gonna steal from **" + target.username + "**, 2 dollars? find a richer target numb nuts")





                } else {

                    if(db.has(`user.${message.author.id}.inv`, "`gun` :gun:")){
                        

                        if (chance <= 3) {

                            let amountGained = Math.floor(targetBalance/10);

                        db.add(`user.${message.author.id}.balance`, amountGained);
                        db.subtract(`user.${target.id}.balance`, amountGained)

                        message.channel.send(":gun::sunglasses: ez, you just stole `" + amountGained + "` coins from **" + target.username + "**")


                        } else {



                            message.channel.send("HAHA you got busted, have fun going to jail :heart_eyes: (you're unable to use any economy commands for 10 minutes)")
                            jailCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.16666666666);
                setTimeout(() => { jailCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.16666666666);
                        }



                    } else if(db.has(`user.${message.author.id}.inv`, "`knife` :knife:")){
                        
                        if (chance <= 1) {

                            let amountGained = Math.floor(targetBalance/10);

                        db.add(`user.${message.author.id}.balance`, amountGained);
                        db.subtract(`user.${target.id}.balance`, amountGained)

                        message.channel.send("you terrify me :knife::sunglasses: you just stole `" + amountGained + "` coins from **" + target.username + "**")


                        } else {



                            message.channel.send("HAHA you got busted, have fun going to jail :heart_eyes: (you're unable to use any economy commands for 10 minutes)")
                            jailCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.16666666666);
                setTimeout(() => { jailCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.16666666666);
                        }


                    } else {

                    if(chance ==0) {

                        if(targetcooldown) {

                            let amountGained = Math.floor(targetBalance/10);

                        db.add(`user.${message.author.id}.balance`, amountGained);
                        db.subtract(`user.${target.id}.balance`, amountGained)

                        message.channel.send("LOL you just stole from someone in jail for the same crime :sob: you received `" + amountGained + "` coins from **" + target.username + "**")





                        } else {


                             let amountGained = Math.floor(targetBalance/10);

                        db.add(`user.${message.author.id}.balance`, amountGained);
                        db.subtract(`user.${target.id}.balance`, amountGained)

                        message.channel.send(":flushed: woah...that actually worked? you just stole `" + amountGained + "` coins from **" + target.username + "**")
                        }

                       




                    } else {


                        message.channel.send("HAHA you got busted, have fun going to jail :heart_eyes: (you're unable to use any economy commands for 10 minutes)")


                        jailCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.16666666666);
                setTimeout(() => { jailCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.16666666666);
                    }

                }





                }

                




            }




        }
    }




if(cmd === `${prefix}hourly`) {

    if(message.channel.type === "dm") return;
    if(message.author.bot) return;

    if (!db.get(`user.${message.author.id}`)) {

        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")



    } else {


        if (message.member.roles.cache.has('707656927328337920')) {
                const cooldown2 = hourlyCooldown.get(message.author.id);
                const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail

                const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})


                if (jailcooldown) {

                    message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`")




                }
                else if (cooldown2) { //if the user has a cooldown

                    const remaining2 = Duration(cooldown2 - Date.now(), {units : ['m', 's'], round: true})

                


                message.channel.send("**" + message.author.username + "**, you already did that in the past hour haha try again later :sunglasses: (`" + remaining2 + "` left)").catch((err) => message.channel.send("oops, something went wrong... try again later maybe?? idk"))
                
                        } else {
                
                let rand = Math.floor(Math.random() * 101)
                   db.add(`user.${message.author.id}.balance`, rand);
                
                   let newBalance = db.get(`user.${message.author.id}.balance`);
                
                   
                
                   let hourlyembed = new Discord.MessageEmbed()
                
                   .setDescription("**" + message.author.username + "**, you just received `" + rand + "` coins!")
                   .setColor(userColor)
                   .setFooter("your new total: " + newBalance);
                
                   message.channel.send(hourlyembed);
                
                
                

                   hourlyCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 1);
                setTimeout(() => { hourlyCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 1);

                  /* hourlyCooldown.add(`hourly.${message.author.id}`)
                
                   setTimeout(() => {
                    hourlyCooldown.delete(`hourly.${message.author.id}`)
                
                
                
                   }, 3.6e+6)*/
                    }
                
                        






        } else {
            const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail

                const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})


                if (jailcooldown) {

                    message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`")




                } else {

            message.channel.send("**" + message.author.username + "**, boohoo only vips can do that")


                }
        }




    }

}





if(cmd === `${prefix}daily`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail

    const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})


    




    if (!db.get(`user.${message.author.id}`)) {

        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")



    } else {

        const cooldown = dailyCooldown.get(message.author.id);



        
        if (jailcooldown) {

            message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`")

        } else
        if (cooldown) { //if the user has a cooldown

            const remaining = Duration(cooldown - Date.now(), {units : ['h', 'm', 's'], round: true})


message.channel.send("**" + message.author.username + "**, you already did this today nice try :clown: come back tomorrow (`" + remaining + "` left)").catch((err) => message.channel.send("oops, something went wrong... try again later maybe?? idk"))

        } else {

let rand = Math.floor(Math.random() * 501)
   db.add(`user.${message.author.id}.balance`, rand);

   let newBalance = db.get(`user.${message.author.id}.balance`);


   let dailyembed = new Discord.MessageEmbed()

   .setDescription("**" + message.author.username + "**, you just received `" + rand + "` coins!")
   .setColor(userColor)
   .setFooter("your new total: " + newBalance);

   message.channel.send(dailyembed);

   dailyCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 24);
   setTimeout(() => { dailyCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 24);


/*
   dailyCooldown.add(`daily.${message.author.id}`)

   setTimeout(() => {
    dailyCooldown.delete(`daily.${message.author.id}`)
   }, 8.64e+7)*/
    }

        }

         



  







}





if(cmd === `${prefix}weekly`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;



    const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail

    const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})
    
    

    if (!db.get(`user.${message.author.id}`)) {

        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")



    } else {

        const cooldown = weeklyCooldown.get(message.author.id);



        if (jailcooldown) {

            message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`")
        } else
        
        if (cooldown) { //if the user has a cooldown

            const remaining = Duration(cooldown - Date.now(), {units : ['d', 'h', 'm', 's'], round: true})


message.channel.send("**" + message.author.username + "**, yikes it hasn't been a full week yet <:VV_wheeze:784129860762337290> come back in a few days LOL (`" + remaining + "` left)").catch((err) => message.channel.send("oops, something went wrong... try again later maybe?? idk"))

        } else {

let rand = Math.floor(Math.random() * 1501)
   db.add(`user.${message.author.id}.balance`, rand);

   let newBalance = db.get(`user.${message.author.id}.balance`);


   let weeklyembed = new Discord.MessageEmbed()

   .setDescription("**" + message.author.username + "**, you just received `" + rand + "` coins!")
   .setColor(userColor)
   .setFooter("your new total: " + newBalance);

   message.channel.send(weeklyembed);

   weeklyCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 168);
   setTimeout(() => { weeklyCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 168);


/*
   dailyCooldown.add(`daily.${message.author.id}`)

   setTimeout(() => {
    dailyCooldown.delete(`daily.${message.author.id}`)
   }, 8.64e+7)*/
    }

        }

         



  







}

/*

if(cmd === `${prefix}profile`) {       
     if(message.channel.type === "dm") return;
if(message.author.bot) return;

let authorInv = db.get(`user.${message.author.id}.inv`);
let authorBalance = db.get(`user.${message.author.id}.balance`);

let target = message.mentions.users.first();
let targetInv = db.get(`user.${target.id}.inv`);
let targetBalance = db.get(`user.${target.id}.balance`)


if(!target) {

    if (!db.get(`user.${message.author.id}`)) {

    message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")



    } else {

let profileembed = new Discord.MessageEmbed()

.setDescription("**"+ message.author.username + "**'s profile")
.addField("balance:", "`" + authorBalance + "` coins, lol broke ass")
.addField("inventory", `${authorInv}`)
.setColor(userColor)
.setFooter("requested by "+ message.author.tag);

message.channel.send(profileembed);
    }


} else {


    if ((!db.get(`user.${target.id}`))) {

        if(target.bot) {
            message.channel.send("that's a bot lol")
        } else {
                            message.channel.send("that person didn't create an economy account yet :frowning: (they can make one by typing `" + `${prefix}start` + "`)")

        }



    } else {


let profileembed2 = new Discord.MessageEmbed()
.setDescription("**"+ message.author.username + "**'s profile")

.addField("balance:", "`" + `${targetBalance}` + "` coins, lol broke ass")
.addField("inventory", `${targetInv}`)
.setColor(userColor)
.setFooter("requested by " + message.author.tag);

return message.channel.send(profileembed2);
}









}



}

*/









if((cmd === `${prefix}inventory`) || (cmd ===`${prefix}inv`)) {       
    
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;

   
    const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail

    const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})

    if(!message.mentions.users.first()) {

    let authorInv = db.get(`user.${message.author.id}.inv`)


    if ( !db.get(`user.${message.author.id}`)) {

        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")

    } else if (jailcooldown) {
 
   

        message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`") 
        
        
    } else if ((authorInv === null) || (authorInv === 0 ) || (authorInv === "")) {

        message.channel.send("**" + message.author.username + "**, there's nothing in your inventory :scream_cat:")

    } else {

        let sortedAuthorInv = authorInv.sort();

        for(var i=0;i<sortedAuthorInv.length;i++){
            sortedAuthorInv[i]=" "+sortedAuthorInv[i];
        }

 let invembed = new Discord.MessageEmbed()

    .setDescription("**"+ message.author.username + "**'s inventory: " + `${sortedAuthorInv}` + "")
.setColor(userColor)

    message.channel.send(invembed);
        
    }

} else {




    let target = message.mentions.users.first();

    let targetInv = db.get(`user.${target.id}.inv`)

    const targetcooldown = jailCooldown.get(target.id);


        if (jailcooldown) {

            message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`") 

            
            
            
            
            
            
        } else if ((!db.get(`user.${target.id}`))) {

            if(target.bot) {
                message.channel.send("that's a bot lol")
            } else {
                                message.channel.send("that person didn't create an economy account yet :frowning: (they can make one by typing `" + `${prefix}start` + "`)")

            }



        } else if (targetcooldown) {
            

            const targettimeremaining = Duration(targetcooldown - Date.now(), {units : ['m', 's'], round: true})

                message.channel.send("this person is currently being taught a lesson in prison rn :weary: do not disturb pls! (`" + targettimeremaining + "` left)") 
            
            
            
            
            
            
            
            
        } else {

            let sortedTargetInv = targetInv.sort();

            for(var i=0;i<sortedTargetInv.length;i++){
                sortedTargetInv[i]=" "+sortedTargetInv[i];
            }

    let invembed2 = new Discord.MessageEmbed()
    .setDescription("**" + target.username + "**'s inventory: " + `${sortedTargetInv}` + "")
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

    return message.channel.send(invembed2);
        }




















}

}





if(cmd === `${prefix}give`) {  
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    


   
    
    let receiver = message.mentions.users.first();



   

if(!receiver) return message.channel.send("psst, this command doesn't work without pinging someone dummy");

        const receivercooldown = jailCooldown.get(receiver.id);
        const iminjail = jailCooldown.get(message.author.id); // 1 hour in jail
        const timeremaining = Duration(iminjail - Date.now(), {units : ['m', 's'], round: true})
        const receivertimeremaining = Duration(receivercooldown - Date.now(), {units : ['m', 's'], round: true})


        let hasAccount = db.get(`user.${message.author.id}`);
   
    
 



    
    
    if (iminjail){


        message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`");




    } else if (!hasAccount) {
        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)");


    } else if (!receiver) {
        message.channel.send("psst, this command doesn't work without pinging someone dummy (use `" + `${prefix}give` + " <@user>`)");





    

    



 } else if (receiver) {

            if (!db.get(`user.${message.author.id}`)) {

                message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)");

                
                
                
            } else if ((!db.get(`user.${receiver.id}`))) {

                if(receiver.bot) {
                    message.channel.send("that's a bot lol")
                } else {
                    message.channel.send("that person didn't create an economy account yet :frowning: (they can make one by typing `" + `${prefix}start` + "`)")
    
                }
    
    
     
            } else if (`${receiver.id}` === `${message.author.id}`) {

                message.channel.send("you can't give to yourself silly goose")



            } else if(receivercooldown) {



        message.channel.send("**" + message.author.username + "**, sorry to inform you but your friend is in jail rn for being an idiot and they can't accept any gifts :smiley: (`" + receivertimeremaining + "` left)") 



 


            }  else {
                let authorBalance = db.get(`user.${message.author.id}.balance`);



    
                            



                            let filter = n => n.author.id === message.author.id;
                            message.channel.send("how many coins do you want to give to **" + receiver.username + "**?")
                            .then(() => {


                                //filter
                                message.channel.awaitMessages(filter, {
                                    max: 1,
                                    time: 10000,
                                    errors: ['time']
                                })
                                .then(message => {
                                    message = message.first()

                                    let numb = message.content;

                                    //begin checks here
                                    if ((isNaN(numb)) || (!isInteger(numb))){

                                        message.channel.send("a 2nd grader could've answered this question better than you :smiley: whole numbers only")

                                    
                                    
                                    
                                    } else if (numb <= 20) {
                                        if (numb <=0) {
                                            message.channel.send('what are u doing')
                                        } else if (numb > authorBalance) {
                                            message.channel.send("buddy you don't even have that much")
                                        } else { //success block

                                            message.channel.send("wow, you're cheap. i'll take out `" + numb + "` coins from your bal and give them to **" + receiver.username + "**");
                                            db.subtract(`user.${message.author.id}.balance`, numb)
                                            db.add(`user.${receiver.id}.balance`, numb)
                                        }
                                    } else if (numb >= 100) {
                                        if (numb > authorBalance) {
                                            message.channel.send("buddy you don't even have that much")
                                        } else { //success block
                                            message.channel.send("omg you're so generous!!! i'll take out `" + numb + "` coins from your bal and give them to **" + receiver.username + "**");
                                            db.subtract(`user.${message.author.id}.balance`, numb)
                                            db.add(`user.${receiver.id}.balance`, numb)


                                        }
                                    } else {
                                        if (numb > authorBalance) {
                                            message.channel.send("buddy you don't even have that much")
                                        } else { //success block
                                            message.channel.send("coolio :sunglasses: i'll take out `" + numb + "` coins from your bal and give them to **" + receiver.username + "**");
                                            db.subtract(`user.${message.author.id}.balance`, numb)
                                            db.add(`user.${receiver.id}.balance`, numb)

                                        }


                                    }
           
                                    
                                })
                                .catch(collected => {
                                    message.channel.send(`you take forever so i'm just gonna go`)
                                })
                        
                        
                            })


                            
                    
                            


    
                  /*      } else if (message.content==="items") {




                            let filter = n => n.author.id === message.author.id;
                            message.channel.send("what item do you want to give **" + receiver.username + "**?")
                            .then(() => {


                                //filter
                                message.channel.awaitMessages(filter, {
                                    max: 1,
                                    time: 10000,
                                    errors: ['time']
                                })
                                .then(message => {
                                    message = message.first()

                                    let item = "";

                                    if (message.content === "chicken nugget") {
                                        item = "`chicken nugget` <a:VV_chickennugget:758849124433920060>";
                                    } else if (message.content === "printer") {
                                        item = "`printer` :printer:";
                                    } else if (message.content === "dog") {
                                        item = "`dog` :dog:";
                                    } else if (message.content === "burger") {
                                        item = "`burger` :hamburger:";
                                    } else if (message.content === "paper") {
                                        item = "`paper` <:VV_item_paper:813833655406297178>";
                                    } else if (message.content === "pencil") {
                                        item = "`pencil` :pencil2:";
                                    } else if (message.content === "$5 valorant gift card") {
                                        item = "`$5 valorant giftcard` :credit_card:";
                                    } else if (message.content === "flower") {
                                        item = "`flower` :rose";
                                    } else if (message.content === "cat") {
                                        item = "`cat` :cat:";
                                    } 


                                    //begin checks here
                                    if(isInteger(item)) {

                                        message.channel.send("give me the name of the item next time dingus")

                                    
                                    } else if (!authorInv.includes(item)) {

                                        message.channel.send("you don't even have that lmao")
                                        
                                        
                                        
                                        
                                        
                                    } else { //success block
                                        
                                        

                                            message.channel.send("great, i just took one `" + item + "` from your inventory and gave it to **" + receiver.username + "**");

                                            const index = authorInv.indexOf(item)
                                            if(index> -1) {
                                                authorInv.splice(index, 1)
                                            }
    
                                            db.set(`user.${message.author.id}.inv`, authorInv)
                                            db.push(`user.${receiver.id}.inv`, item)
                                        


                                        

                                        

                                    }



           
        
                                })
                                .catch(collected => {
                                    message.channel.send(`you take forever so i'm just gonna dip`)
                                })
                
                


                            })
                    
                        
                        
                        */
                    
                    
                
            }
             

                


        }
    

}





if((cmd === `${prefix}balance`) || (cmd ===`${prefix}bal`)) {       
    
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;

    const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail


    const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})



    if(!message.mentions.users.first()) {


        let authorBalance = db.get(`user.${message.author.id}.balance`);


        if ( !db.get(`user.${message.author.id}`)) {

                message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)");


            } else if (jailcooldown) {


                
                
                
                        message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`") 

                
                
            } else {

            let balanceembed = new Discord.MessageEmbed()
    .setDescription("**" + message.author.username + "**'s balance: `" + `${authorBalance}` + "` coins, lol broke ass")
    .setColor(userColor)
    .setFooter("requested by " + message.author.tag);

        return message.channel.send(balanceembed);

         }

        

        

    } else {

        let target = message.mentions.users.first();


        let targetBalance = db.get(`user.${target.id}.balance`)

        const targetcooldown = jailCooldown.get(target.id);


            if (jailcooldown) {


                
                
                                        message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`") 

                
                
                
            } else if ((!db.get(`user.${target.id}`))) {

                if(target.bot) {
                    message.channel.send("that's a bot lol")
                } else {
                                    message.channel.send("that person didn't create an economy account yet :frowning: (they can make one by typing `" + `${prefix}start` + "`)")

                }



            } else if (targetcooldown) {
                
                const targettimeremaining = Duration(targetcooldown - Date.now(), {units : ['m', 's'], round: true})

                message.channel.send("this person is currently being taught a lesson in prison rn :weary: do not disturb pls! (`" + targettimeremaining + "` left)") 
                
                
                
            } else {


        let balanceembed = new Discord.MessageEmbed()
        .setDescription("**" + target.username + "**'s balance: `" + `${targetBalance}` + "` coins, lol broke ass")
        .setColor(userColor)
        .setFooter("requested by " + message.author.tag);
    
        return message.channel.send(balanceembed);
            }
    }
    
 

}




if (cmd === `${prefix}shop`) {
    let servericon = message.guild.iconURL({dynamic : true});

    const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail


    const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})

    if ( !db.get(`user.${message.author.id}`)) {

        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")



    } else


    if (jailcooldown) {

        



        message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`") 




    } else {
        let shoppg1 = new Discord.MessageEmbed()
    .setTitle("// VV SHOP :smirk:")
    .setColor(userColor)
    .setThumbnail(servericon)
    .setDescription("use `" + `${prefix}buy` + " <item number>` to buy something")
    .addField("`1.` chicken nugget - `100,000,000` coins", "<a:VV_chickennugget:758849124433920060> the most sacred thing god put on this earth")
    .addField("`2.` printer - `5,000` coins", ":printer: when combined with paper it can print you extra money")
    .addField("`3.` game coach - `4,000` coins", ":trophy: hire a knock off tenz from a sketchy fiver account to train you")
    .addField("`4.` aimbot - `1,000` coins", ":dart: good for when you're hardstuck iron 1 but don't feel like hiring a coach")
    .addField("`5.` gun - `1,000` coins", ":gun: greatly increases the success rate when you try to rob someone (40%)")
    .addField("`6.` knife - `500` coins", ":knife: slightly increases the success rate when you try to rob someone (20%)")
    .addField("`7.` paper - `20` coins", "<:VV_item_paper:813833655406297178> kill some trees, get some cash")
    .addField("`8.` happy meal - `20` coins", ":hamburger: the perfect meal to match your childish ass personality")
    .setFooter("page 1/1 - requested by " + message.author.tag);

    message.channel.send(shoppg1);
    }


    




}

//<a:VV_chickennugget:758849124433920060>



if(cmd === `${prefix}buy`) {

    const jailcooldown = jailCooldown.get(message.author.id); // 1 hour in jail


    const timeremaining = Duration(jailcooldown - Date.now(), {units : ['m', 's'], round: true})

    if(message.channel.type === "dm") return;
    if(message.author.bot) return;


    if ((!db.get(`user.${message.author.id}`))) {

        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")


    } else if (jailcooldown) {
        
        
        
        
        message.channel.send("**" + message.author.username + "**, you're still in jail for another `" + timeremaining + "`") 

        
        
    } else {




    if (message.content === `${prefix}buy 1`) { //chicken nugget - 10,000 coins

        if ((db.get(`user.${message.author.id}.balance`)) < 100000000) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (100000000-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 100000000) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought a **chicken nugget** <a:VV_chickennugget:758849124433920060> (you have `" + ((db.get(`user.${message.author.id}.balance`))-100000000) + "` coins left)")

            db.push(`user.${message.author.id}.inv`, "`chicken nugget` <a:VV_chickennugget:758849124433920060>")

            db.subtract(`user.${message.author.id}.balance`, 100000000)

            //db.remove amount from balance
        }


    } else if (message.content === `${prefix}buy 2`) {

        if ((db.get(`user.${message.author.id}.balance`)) < 5000) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (5000-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 5000) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought a **printer** :printer: (you have `" + ((db.get(`user.${message.author.id}.balance`))-5000) + "` coins left)")


            db.push(`user.${message.author.id}.inv`, "`printer` :printer:")
            db.subtract(`user.${message.author.id}.balance`, 5000)

        }


    } else if (message.content === `${prefix}buy 3`) {


        if (db.get(`user.${message.author.id}.inv`).includes("`game coach` :trophy:") ) {

            message.channel.send("**" + message.author.username + "**, you have to be realll garbage to need two game coaches" )


        } else {

if ((db.get(`user.${message.author.id}.balance`)) < 4000) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (4000-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 4000) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought a **game coach** :trophy: (you have `" + ((db.get(`user.${message.author.id}.balance`))-4000) + "` coins left)")

            db.push(`user.${message.author.id}.inv`, "`game coach` :trophy:")
            db.subtract(`user.${message.author.id}.balance`, 4000)

        }

        }

        
    
    } else if (message.content === `${prefix}buy 4`) {


        if (db.get(`user.${message.author.id}.inv`).includes("`aimbot` :dart:") ) {

            message.channel.send("**" + message.author.username + "**, are you trying to buy aimbot twice? :neutral_face:" )


        } else {

if ((db.get(`user.${message.author.id}.balance`)) < 1000) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (1000-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 1000) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought **aimbot** :dart: (you have `" + ((db.get(`user.${message.author.id}.balance`))-1000) + "` coins left)")

            db.push(`user.${message.author.id}.inv`, "`aimbot` :dart:")
            db.subtract(`user.${message.author.id}.balance`, 1000)


        }

        }
        

    } else if (message.content === `${prefix}buy 5`) {

        if (db.get(`user.${message.author.id}.inv`).includes("`gun` :gun:") ) {

            message.channel.send("**" + message.author.username + "**, no you don't need another gun :smiley:" )


        } else {
if ((db.get(`user.${message.author.id}.balance`)) < 1000) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (1000-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 1000) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought a **gun** :gun: (you have `" + ((db.get(`user.${message.author.id}.balance`))-1000) + "` coins left)")

            db.push(`user.${message.author.id}.inv`, "`gun` :gun:")
            db.subtract(`user.${message.author.id}.balance`, 1000)


        }
        }

        


    } else if (message.content === `${prefix}buy 6`) {
        if (db.get(`user.${message.author.id}.inv`).includes("`knife` :knife:")) {

            message.channel.send("**" + message.author.username + "**, you're not jett buddy, one knife is enough" )


        } else {

        if ((db.get(`user.${message.author.id}.balance`)) < 500) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (500-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 500) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought a **knife** :knife: (you have `" + ((db.get(`user.${message.author.id}.balance`))-500) + "` coins left)")

            db.push(`user.${message.author.id}.inv`, "`knife` :knife:")
            db.subtract(`user.${message.author.id}.balance`, 500)


        }
    }

    } else if (message.content === `${prefix}buy 7`) {

        if ((db.get(`user.${message.author.id}.balance`)) < 20) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (20-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 20) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought a **sheet of paper** <:VV_item_paper:813833655406297178> (you have `" + ((db.get(`user.${message.author.id}.balance`))-20) + "` coins left)")

            db.push(`user.${message.author.id}.inv`, "`sheet of paper` <:VV_item_paper:813833655406297178>")
            db.subtract(`user.${message.author.id}.balance`, 20)


        }

    } else if (message.content === `${prefix}buy 8`) {

        if ((db.get(`user.${message.author.id}.balance`)) < 20) {

            message.channel.send("**" + message.author.username + "**, you're too broke to buy that sorry :( (you're `" + (20-(db.get(`user.${message.author.id}.balance`))) + "` coins short)")
        } else if (db.get(`user.${message.author.id}.balance`) >= 20) {
            message.channel.send("**" + message.author.username + "**, yayyy you just bought a **happy meal** :hamburger: (you have `" + ((db.get(`user.${message.author.id}.balance`))-20) + "` coins left)")

            db.push(`user.${message.author.id}.inv`, "`happy meal` :hamburger:")
            db.subtract(`user.${message.author.id}.balance`, 20)


        }

    } else if(args === `8`) {
        message.channel.send("what item are you buying :confused: (you need to type the item number, like this: `" + `${prefix}buy 5` + "`")

    } else {
        message.channel.send("are you sure you're using that right :/ take a look in the `" + `${prefix}shop` + "` and check the item numbers")


    }

    }


}


if(cmd === `${prefix}start`) {              


    let chance = Math.floor(Math.random()*3) // 0 1 2

    const kaylaId = "382253023709364224";
    const loganId = "424325226332028929";


    
    
    if (!db.get(`user.${message.author.id}`)) {

        if (message.author.id === kaylaId) {


            db.set(`user.${message.author.id}`, {balance: 50, inv: ["`pet shaggy` :dog:"]});


            
        } else if (message.author.id === loganId) {


            db.set(`user.${message.author.id}`, {balance: 50, inv: ["`pet shaggy` :dog:"]});



        } else{

            if (chance == 0) {

    db.set(`user.${message.author.id}`, {balance: 50, inv: ["`pet monkey` :monkey:"]});


        } else if (chance == 1) {


            db.set(`user.${message.author.id}`, {balance: 50, inv: ["`pet koala` :koala:"]});



        } else if (chance === 2) {

            db.set(`user.${message.author.id}`, {balance: 50, inv: ["`pet fish` :tropical_fish:"]});



        }
        }

        



 let startembed = new Discord.MessageEmbed()
 .setColor(userColor)

    .setDescription("**" + message.author.username + "**, your economy account has been created for you :smiley::thumbsup:\nhappy earning/farming/robbing!")
    .addField("starting balance:", "`" + db.get(`user.${message.author.id}.balance`) + "` coins")
    .addField("starting items:", db.get(`user.${message.author.id}.inv`))

    .setFooter("⚠️ to keep bot storage fresh, all economy progress is randomly reset every 24 hours");

    message.channel.send(startembed);


    } else {

        message.channel.send("**" + message.author.username + "**, you already have an account dummy");


 
    }

}









































if(cmd === `${prefix}choose`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;

    let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);



        if(msg === `${prefix}choose`) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("no you dummy")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*choose <option 1>, <option 2>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);
        
        } else {

            let msgarray = msg.split(',');

            let chance = Math.floor(Math.random() * 3);


            let selected =  msgarray[Math.floor(Math.random() * msgarray.length)] ;

            if (selected.startsWith(' ')) {
                selected = selected.substring(1);



            }
            
      

            if (chance == 0) {

                if (randomTipChance <= 1) {

let embed1 = new Discord.MessageEmbed()
                .setDescription("**" + message.author.username + "**, i think i'll go with `" + selected + "` :smiley::thumbsup:")

                .setFooter(selectedTip)
                .setColor(userColor);
                message.channel.send(embed1);


                } else {
                    let embed1 = new Discord.MessageEmbed()
                    .setDescription("**" + message.author.username + "**, i think i'll go with `" + selected + "` :smiley::thumbsup:")
    
                    .setColor(userColor);
                    message.channel.send(embed1);




                }
                
            } else if (chance == 1) {
                
                if (randomTipChance <= 1) {


                    let embed2 = new Discord.MessageEmbed()
                    .setDescription("**" + message.author.username + "**, i obviously choose `" + selected + "` :smiley::thumbsup:")
                    .setFooter(selectedTip)
    .setColor(userColor);
    message.channel.send(embed2);
                } else {

                    let embed2 = new Discord.MessageEmbed()
                    .setDescription("**" + message.author.username + "**, i obviously choose `" + selected + "` :smiley::thumbsup:")
    .setColor(userColor);
    message.channel.send(embed2);

                }
               


            } else if (chance == 2) {



                if(randomTipChance <= 1) {


                    let embed3 = new Discord.MessageEmbed()
                    .setDescription("**" + message.author.username + "**, idk about you but i pick `" + selected + "` :smiley::thumbsup:")
                    .setFooter(selectedTip)
                    .setColor(userColor);
                    message.channel.send(embed3);



                } else {
                    let embed3 = new Discord.MessageEmbed()
                    .setDescription("**" + message.author.username + "**, idk about you but i pick `" + selected + "` :smiley::thumbsup:")
                    .setColor(userColor);
                    message.channel.send(embed3);

                }


            }

            


            
        }





}











/*

if (cmd === `${prefix}tictactoe`) {
    if(message.member.hasPermission("ADMINISTRATOR")) {

        if(!message.mentions.users.first()) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("you have to ping someone dumdum")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*tictactoe <@user>`")
            .setFooter("requested by " + message.author.tag);



            return message.channel.send(stopembed);


 
        

    } else {


        let player1 = message.author.id;
        let player2 = message.mentions.users.first.id;

        db.set(player1 + ".tictactoe", "true")



        message.channel.send("**<@" + player2 + ">**, you've been invited to a tic tac toe match by **<@" + player1 + ">**\nreact to accept ▶️")
       
  
        .then(message => {
            message.react('▶️'); 
             
     

 const editFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === player2;
 





      const collector = message.createReactionCollector(editFilter, {time:  20000 });   


    collector.on('collect', (reaction, user) => { 

        message.channel.send(`> **${message.author.username}** vs. **${message.mentions.users.first.tag}**`)

        

    }) 

})
        collector.on('end', collected => {

            if(collected.size != 0) {

                //this is where the game starts
                






            } else {

            message.channel.send(`**${message.author.username}**, the game can't start because **${message.mentions.users.first.tag}** is scared and won't accept <:VVwheeze:784129860762337290>`);

            db.delete(player1 + ".tictactoe")



            }
        });







    }














        
    }



}

*/








 //*clear cmd
 if(cmd ===`${prefix}clear`) {

    /*const boosts = bot.channels.cache.get('731957047809277972');
    const invites =  bot.channels.cache.get('737318091981324298');
    const rules = bot.channels.cache.get('657680016435314733');
    const info = bot.channels.cache.get('709083826890080287');
    const about = bot.channels.cache.get('725456816817045555');
    const roles1 = bot.channels.cache.get('707633273840336957');
    const roles2 = bot.channels.cache.get('749674536575696956');
    const roles3 = bot.channels.cache.get('724751100716253245');
    const agent = bot.channels.cache.get('826831462544179211');
    const rank = bot.channels.cache.get('830214484647215114');
    const lfg = bot.channels.cache.get('816054926673051708');
    const nitro = bot.channels.cache.get('718606483008258108');
    const events = bot.channels.cache.get('733857873834147871');
    const confessions = bot.channels.cache.get('709101840494755910');
    const partners = bot.channels.cache.get('725204043076599830');
    */

    if(message.channel.type === "dm") return;
    if(message.author.bot) return;

        if(message.member.hasPermission("MANAGE_MESSAGES")){

            var messagesplit = message.content.split(" ");
            var amt = messagesplit[1];

            if (message.channel.id === "847908733760831528" || message.channel.id === "847148033220935730" || message.channel.id === "710009723306639421" || message.channel.id === "731957047809277972" || message.channel.id === "737318091981324298" || message.channel.id ==="657680016435314733" || message.channel.id ==="709083826890080287" || message.channel.id ==="725456816817045555" ||message.channel.id === "707633273840336957" || message.channel.id ==="749674536575696956" || message.channel.id ==="724751100716253245" || message.channel.id ==="826831462544179211" ||message.channel.id === "830214484647215114" ||message.channel.id === "816054926673051708" ||message.channel.id === "718606483008258108" ||message.channel.id === "709101840494755910" || message.channel.id ==="725204043076599830") {
                 message.channel.send("you can't use that here sorry").then(message => {
                    message.delete({timeout:5000})
                }).catch(console.error);

            } else {


if ((isNaN(amt)) || (!isInteger(amt))){

                message.channel.send("**" + message.author.username + "**, you need to put a whole number stupid :neutral_face:");

            } else if (isInteger(amt)) {

                if((amt >= 1) && (amt < 101)) {

                   

                            message.channel.bulkDelete(amt).catch(err => {
                    console.err(err);
                    message.channel.send("oopsie **" + message.author.username + "**, something went wrong. try again in a few seconds");
                      })  


                    
                 

                } else {
                    message.channel.send("**" + message.author.username + "**, you can only use numbers between 1 and 100");


                }

            }




                }

            

        } else if (!message.member.hasPermission("MANAGE_MESSAGES")){

            message.channel.send("**" + message.author.username + "**, you can't use that dummy");

        }
   
    }

//testing since .bulkDelete() isnt working right for clear command
//it worked

/*
if(cmd ===`${prefix}bulkdelete`) {

    if(message.member.hasPermission("MANAGE_MESSAGES")){


            message.channel.bulkDelete(5).catch(err => {
            console.err(err);
            message.channel.send("oopsie **" + message.author.username + "**, something went wrong. try again in a few seconds");
        })

    }

}
*/











/*
if(cmd ===`${prefix}snipe`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;


    //for *snipe
bot.on("messageDelete", function(message, channel) {

    bot.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author.tag,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
        });
});
    
    let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

    

    if(msg === `${prefix}snipe`) {

   

        let mensaje = bot.snipes.get(message.channel.id);
        if(!mensaje) return message.channel.send("either there's nothing to snipe or i'm just slow <:VVflusheddd:729798621045850232>");

        let snipeembed = new Discord.MessageEmbed()

        .setTitle("// SNIPE")
        .setFooter(mensaje.author)
        .setDescription(mensaje.content)
        .setColor(userColor)
        if(mensaje.image)snipeembed.setImage(mensaje.image);

        return message.channel.send(snipeembed);





     } else {

        let stopembed = new Discord.MessageEmbed()

        .setTitle("no you idiot")
        .setColor("#FF0000")
        .addField("**unnecessary argument**", "type `*snipe` but without anything after it :smiley:")
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(stopembed);

    }
}
*/


//MOCK COMMAND
    if(cmd === `${prefix}mock`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;




        let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if(msg === `${prefix}mock`) {
            

            let stopembed = new Discord.MessageEmbed()

            .setTitle("slow down there, buckaroo")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*mock <message>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);
        } else if(msg.length >= 100) {

            let stop2embed = new Discord.MessageEmbed()

            .setTitle("why tf are you trying to mock something that long...")
            .setColor("#FF0000")
            .addField("**character limit reached**", "you can only mock a message less than 100 characters :neutral_face:")

            return message.channel.send(stop2embed);

        

        } else {



            if (randomTipChance <= 1) {



let mockembed = new Discord.MessageEmbed()

            .setTitle(mockingcase(msg))
            .setColor("#f7e948")
            .setDescription("are you annoyed yet <3")
            .setThumbnail("https://cdn.discordapp.com/attachments/661705313329872946/751017847936909353/kayla-ran-this-command.gif")
            .setFooter(selectedTip);

            message.channel.send(mockembed);

            } else {

                let mockembed = new Discord.MessageEmbed()

                .setTitle(mockingcase(msg))
                .setColor("#f7e948")
                .setDescription("are you annoyed yet <3")
                .setThumbnail("https://cdn.discordapp.com/attachments/661705313329872946/751017847936909353/kayla-ran-this-command.gif");
    
                message.channel.send(mockembed);
            }
         
            
            





            
        
        //i tried using a for loop but i realized it was hopeless LOL but i'm leaving it just for future reference in case idk

            /*
            for (i = 0; i < msg.length; i++) {
            let chance = Math.floor(Math.random() * 1);

            if (chance == 0) {
                msg.charAt(i).toUpperCase();
            } else if (chance == 1) {
                msg.charAt(i).toLowerCase();

            }


            }

            return message.channel.send(msg);
             //return message.channel.send(msg.charAt(0).toUpperCase() + msg.slice(1));

             */

        }
    
    
    }





































    //*roulette (embed), !!!!!!!!!!!!! NOT FINISHED !!!!!!!!!!
    /*
    if(cmd === `${prefix}roulette`) {
        if(message.channel.type === "dm") return;

        if(message.author.bot) return;

        


        if (message.member.hasPermission("ADMINISTRATOR")){
            
            
            
            let roulettemessage = await message.channel.send("**" + message.author.username + "** just started a game of **roulette! :gun:**\n\nreact to this message to join the game (10 seconds to join)\n\n**:warning: warning: loser gets punished with a ban**");

            await roulettemessage.react("🔫");
            


            //START COLLECTOR SECTION




            const reactions = await roulettemessage.awaitReactions(reaction => {
                reaction.emoji.name === "🔫";

        /*        
bot.on('messageReactionAdd', (reaction, user) => {
    if(reaction.emoji.name === "🔫") {
        console.log(reaction.users);
        message.channel.send(reaction.users)
    }
});
              

            }, {time: 10000});


            //END COLLECTOR SECTION

            const count = `${reactions.get("🔫").count-1}`;










            if (count == 1) {
                message.channel.send("time's up! there is only 1 user in the game, so it can't start.")
            } else if (count == 0) {
                message.channel.send("wow, nobody joined? stop ducking pussies")
            } else if (count > 1) {
                message.channel.send("time's up! there are " + count + " users in the game.")
            }
            console.log(reactions);





        var userIDs = [];
            var userTags = [];

            






            


            
            

        } else if (!message.member.hasPermission("ADMINISTRATOR")) {
                    let sorrynoembed = new Discord.MessageEmbed()
            
                        .setDescription("sorry, **" + message.author.username + "**, but you can't use this")
                        .setColor("ff0000")
                        return message.channel.send(sorrynoembed);
            
                  }
        
        

    }
*/

/*
    //vote command
    if (cmd === `${prefix}vote`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

    let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if(msg === `${prefix}vote`) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("slow down there, buckaroo")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*vote <question>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);


        } else {

            message.delete();

            const yes = ("✅");
            const no = ("❎");

            let votemessage = await message.channel.send("**" + message.author.username + "** just started a **vote poll**\n\n" + msg + "\n\n*you have 10 seconds to cast your vote*");
            await votemessage.react(yes);
            await votemessage.react(no);


            const reactions = await votemessage.awaitReactions(reaction => {
                return reaction.emoji.name === "✅" || reaction.emoji.name === "❎";

            }, {time: 10000});


            //didnt use this but whatever
            const yescount = `${reactions.get("✅").count-1}`;
            const nocount = `${reactions.get("❎").count-1}`;

            message.channel.send(`**the vote has ended!**\n\n${yes}: ${reactions.get(yes).count-1}\n${no}: ${reactions.get(no).count-1}`);





        }


    }
*/


    //SHIP COMMAND
    if (cmd === `${prefix}ship`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        //const messagesplit = message.content.split(" ");

        let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
        let user1 = message.mentions.users.first();






/*


        var count = 0; //To find out what user we're on.
        let firstUser; 
        let secondUser; 
        message.mentions.forEach(user => {
            count++; //Adding one onto the count variable
            if (count >= 3) {
                let stopembed = new Discord.MessageEmbed()

            .setTitle("you did it wrong :neutral_face:")
            .setColor("#FF0000")
            .addField("**unnecessary argument**", "the max amount of users you can ship is two (2)")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);
                



            } else
            if (count == 1) {
                
                firstUser = message.guild.members.cache.get(user.id); //Getting the first mentioned user
                
            }
        else {
            
            secondUser = message.guild.members.cache.get(user.id); //Getting the second mentioned user
            
        }
        });
*/










        const kaylaId = "382253023709364224";


        if(msg === `${prefix}ship`) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("you did it wrong :neutral_face:")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*ship <@user>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);

        } else if (msg.length >= 100) {


            let stop2embed = new Discord.MessageEmbed()

            .setTitle("your message is too long dummy")
            .setColor("#FF0000")
            .addField("**character limit reached**", "your message has to be less than 100 characters")

            return message.channel.send(stop2embed);


        } else if (user1 === message.author) {


            let stopembed = new Discord.MessageEmbed()

            .setTitle("you can't ship yourself with yourself")
            .setColor("#FF0000")
            .setDescription("but self love is the best love :smiling_face_with_3_hearts:")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);

         } else if (user1 === bot.user) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("i'm a bot")
            .setColor("#FF0000")
            .setDescription("wow you're lonely lolol")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);

        } 
                 else if (msg != user1) {

            
                let chance = Math.floor(Math.random() * 101)

                let shipembed = new Discord.MessageEmbed()
    
                .setTitle("// SHIP :revolving_hearts:")
                .setColor(userColor)
                .setDescription("**> <@" + message.author + ">**\n**> " + msg + "**")
                .addField("compatibility:", chance + "%")
                .setFooter("requested by " + message.author.tag);
    
                 message.channel.send(shipembed);
    
                if (chance == 0) {
                    message.channel.send("wtf LMAOOOO :nauseated_face:");
                } else if (chance > 0 && chance <= 30) {
                    message.channel.send("better luck next time :confused:");
                } else if (chance >= 31 && chance <= 60) {
                    message.channel.send("getting somewhere :slight_smile:");
                } else if (chance >= 61 && chance <= 80) {
                    message.channel.send("that's decent :smiley:");
                } else if (chance >= 81 && chance <= 90) {
                    message.channel.send("woah :flushed:");
                } else if (chance >= 91 && chance <= 99) {
                    message.channel.send("y'all cute or whateva");
                }else if (chance == 100) {
                    message.channel.send("fuck just get married already :weary:");
                }


            
            


           




        
            






         
            




            





            } else {

            let chance = Math.floor(Math.random() * 101)

            let shipembed = new Discord.MessageEmbed()

            .setTitle("// SHIP :revolving_hearts:")
            .setColor(userColor)
            .setDescription("**> <@" + message.author + ">**\n**> " + user1.username + "**")
            .addField("compatibility:", chance + "%")
            .setFooter("requested by " + message.author.tag);

             message.channel.send(shipembed);

            if (chance == 0) {
                message.channel.send("wtf LMAOOOO :nauseated_face:");
            } else if (chance > 0 && chance <= 30) {
                message.channel.send("better luck next time :confused:");
            } else if (chance >= 31 && chance <= 60) {
                message.channel.send("getting somewhere :slight_smile:");
            } else if (chance >= 61 && chance <= 80) {
                message.channel.send("that's decent :smiley:");
            } else if (chance >= 81 && chance <= 90) {
                message.channel.send("woah :flushed:");
            } else if (chance >= 91 && chance <= 99) {
                message.channel.send("y'all cute or whateva");
            }else if (chance == 100) {
                message.channel.send("fuck just get married already :weary:");
            }

        }


    


    }


/*
//testembed
if(cmd === `${prefix}testembed`) {
    if(message.member.hasPermission("ADMINISTRATOR")) {

        let testembed = new Discord.MessageEmbed()
        .setTitle("▬▬▬▬▬▬▬ WELCOME TO VV ▬▬▬▬▬▬▬")
     .setAuthor("// " + message.author.tag.toUpperCase(), message.author.displayAvatarURL())
     .setImage("https://cdn.discordapp.com/attachments/723691178977001494/837371105874149376/joinbanner.jpg")
     .setColor("#AE3B9A")

     message.channel.send(testembed)




    



    }


}
*/






if (cmd === `${prefix}bingus`) {

    let bingusList = ["https://media.tenor.com/images/bc309dddd91497e0a045d6d0a59d0be2/tenor.gif", "https://media.tenor.com/images/0bc4920ca4718a4a6d9d55d5ecd15e78/tenor.gif", "https://media.tenor.com/images/703fc21f83cc75dc142558161a56c1bc/tenor.gif", "https://i.imgur.com/oLI61Cp.gif", "https://i.imgur.com/sc6SeE6.gif", "https://i.kym-cdn.com/photos/images/original/001/920/643/f80.gif", "https://img1.picmix.com/output/pic/normal/7/0/6/8/9578607_3a5ba.gif", "https://i.imgur.com/3CS3TtI.gif?noredirect", "https://media.tenor.com/images/d5ee4aa08c8e778f283177894c936250/tenor.gif", "https://media.tenor.com/images/39ae5d58ce52e1e469cf7ad213636380/tenor.gif", "https://64.media.tumblr.com/b13238336eec95f038b165b89e38f2ed/408f6ef4f19074c7-94/s400x600/1a5eed291b69473864b749b381dee286fd1367a0.gifv", "https://img1.picmix.com/output/pic/normal/5/0/2/2/9682205_1d119.gif", "https://media.tenor.com/images/71d7d3b7172b8d1669b0ea78f5185eab/tenor.gif", "https://media.tenor.com/images/c1236fc01e0eaafe7a1310ca319bb2cb/tenor.gif", "https://media.tenor.com/images/4a8ec013cedd56ff44113c202033f4a0/tenor.gif", "https://i.kym-cdn.com/photos/images/original/002/047/520/57b.gif"];

    var selectedBingus = bingusList[(Math.random() * bingusList.length) | 0]
    message.channel.send("<:VVbingus:833690189037043742>")
    message.channel.send(selectedBingus)




}





if (cmd === `${prefix}kittyreview`) {

    let reviewList = ["https://tenor.com/view/kitty-review-cat-gamer-cat-pro-gamer-gif-21395567", "https://tenor.com/view/kitty-review-kitty-cat-review-gif-20973771", "https://tenor.com/view/cat-review-eating-bad-garbage-gif-20951259", "https://tenor.com/view/kitty-review-cat-review-gif-21140352", "https://tenor.com/view/kitty-review-kitty-ballin-kitty-review-cat-gif-21145619", "https://tenor.com/view/kitty-review-kitty-review-cat-gif-21086233", "https://tenor.com/view/kitty-review-cat-review-gif-21178325", "https://tenor.com/view/kitty-review-cat-kitty-review-gif-20973783", "https://tenor.com/view/kitty-review-kittyreview-cat-squishy-gif-21044823", "https://tenor.com/view/kitty-review-cat-kitty-review-stanky-gif-21071465", "https://tenor.com/view/kitty-review-cat-kitty-review-gif-20973774", "https://tenor.com/view/kitty-review-performance-kittie-cute-gif-21164379", "https://tenor.com/view/kitty-review-kitty-review-cat-dance-gif-21086436", "https://tenor.com/view/plus-kitty-review-kitty-cat-meme-gif-20796773", "https://tenor.com/view/kitty-review-kitty-cat-meme-funny-gif-20978803", "https://tenor.com/view/kitty-review-gif-21031795", "https://tenor.com/view/kitty-review-cat-review-gif-21140330", "https://tenor.com/view/kitty-review-kitty-review-cat-stealth-gif-21142091", "https://tenor.com/view/kitty-review-stupid-funny-cat-gif-21213106", "https://tenor.com/view/kitty-review-kitty-cat-cat-review-fat-cat-gif-21197159", "https://tenor.com/view/kitty-review-seal-funny-dubious-big-and-round-gif-21210102", "https://tenor.com/view/kitty-review-kitty-cat-cat-review-squishy-cat-gif-21193166", "https://tenor.com/view/kitty-review-kitty-cat-cat-review-gif-21193114", "https://tenor.com/view/kitty-cat-this-is-going-fucking-gif-21101497"];

    var selectedReview = reviewList[(Math.random() * reviewList.length) | 0] 

message.channel.send(":cat:")
message.channel.send(selectedReview);





}
 



/*

if(cmd === `${prefix}agentquiz`) {
    
    if (db.has(message.author.id + '.quiz')) {
        message.channel.send(`**${message.author.tag}**, you already opened a quiz dum dum :smiley:`).then(message => {
            message.delete({timeout:7000})
        }).catch(console.error);

    } else {
    db.set(message.author.id + '.quiz', 'true');


     

    let trueAuthorId = message.author.id;

    let trueAuthorTag = message.author.tag;
   
   

const testembed = new Discord.MessageEmbed()


        //CREATE original embed upon execution of *testembed
        .setTitle('// VALORANT AGENT QUIZ')
          .setColor(userColor)
.setImage("https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt9c7a6ba8d1239e1e/6038320ff54af27503f2df15/Whats-New-in-VALORANT-Episode-2-Act-II-Divider_comp.jpg")    
      .setDescription('answer the next 5 questions to learn which agent you\'re most similar to <:VVsadgesage:834791646414766101>')
          .setFooter(message.author.tag + " • react below in 20 seconds to start ▶️")
          message.channel.send(testembed) //SEND original embed
          .then(message => {
            message.react('▶️'); //REACT to original embed

            //FILTER
             
     

 const editFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === trueAuthorId;
 





      const collector = message.createReactionCollector(editFilter, {time:  20000 });   


    collector.on('collect', (reaction, user) => { 


 message.reactions.removeAll();

        const editembed = new Discord.MessageEmbed()
        .setTitle('// QUESTION 1')
    .setColor(userColor)
    .setThumbnail("https://i.ytimg.com/vi/oGRk4ptstyg/maxresdefault.jpg")
.addField("if you had to describe your room right now, you would say it's:", "`1` // a total fucking mess LMFAO\n`2` // organized, not a thing is out of place\n`3` // cluttered, but i know where everything is\n`4` // bold of you to assume i have a place to live")
    .setFooter(trueAuthorTag + " • wait a few seconds before answering to avoid api spam!");

        
    message.edit(editembed) .then(message => {
        


        //FILTER
         
 

const editFilter = m => (m.content == "1" || m.content == "2" || m.content == "3" || m.content == "4") && m.author.id === trueAuthorId;



  

  const collector = message.channel.createMessageCollector(editFilter, {time:  30000 });   
  


collector.on('collect', m => {
    m.delete();

    message.delete();

    


    const editembed2 = new Discord.MessageEmbed()
    .setTitle('// QUESTION 2')
.setColor(userColor)
.setThumbnail("https://i.ytimg.com/vi/-DNhNfe1CKA/maxresdefault.jpg")
.addField("your favorite food is:", "`1` // something like a burger or fries\n`2` // exotic and foreign foods\n`3` // my gf's titties\n`4` // the fear, pain, and terror of my enemies")
.setFooter(trueAuthorTag + " • wait a few seconds before answering to avoid api spam!");

    
message.channel.send(editembed2);

});

collector.on("end", (collected) =>{




}).then(message => {



    //FILTER
     


    const editFilter = m => (m.content == "1" || m.content == "2" || m.content == "3" || m.content == "4") && m.author.id === trueAuthorId;





    const collector = message.channel.createMessageCollector(editFilter, {time:  30000 });   
  


collector.on('collect', m => {
    m.delete();
    message.delete();


const editembed3 = new Discord.MessageEmbed()
.setTitle('// QUESTION 3')
.setColor(userColor)
.setThumbnail("https://i.ytimg.com/vi/qN_qhulO8CY/maxresdefault.jpg")
.addField("your spirit animal is:", "`1` // a dog or a cat, because i'm unoriginal and painfully average\n`2` // a peacock, because i'm beautiful and majestic\n`3` // a stinkbug, because i'm literally worthless\n`4` // deviant, because i'm a menace to society")
.setFooter(trueAuthorTag + " • wait a few seconds before answering to avoid api spam!");


message.channel.send(editembed3) .then(message => {
    


     

    const editFilter = m => (m.content == "1" || m.content == "2" || m.content == "3" || m.content == "4") && m.author.id === trueAuthorId;





const collector = message.channel.createMessageCollector(editFilter, {time:  30000 });   


collector.on('collect', m => {
    m.delete();

    message.delete();

    const editembed4 = new Discord.MessageEmbed()
        .setTitle('// QUESTION 4')
        .setColor(userColor)
        .setThumbnail("https://media.tenor.com/images/9828c49c50baa9bde9a25c3144fb0798/tenor.png")
        .addField("if you had to describe your clothing style, you would say:", "`1` // it's pretty casual, like sweats and tees\n`2` // luxurious, like diamond-encrusted silk dresses\n`3` // it's kinda embarrassing, i wear those minecraft jackets with the hoods that you can zip over your face\n`4` // it's dark, like black shirt, black pants, black shoes, black everything")
        .setFooter(trueAuthorTag + " • wait a few seconds before answering to avoid api spam!");

    message.channel.send(editembed4) .then(message => {



     


        const editFilter = m => (m.content == "1" || m.content == "2" || m.content == "3" || m.content == "4") && m.author.id === trueAuthorId;





        const collector = message.channel.createMessageCollector(editFilter, {time:  30000 });   
      

collector.on('collect', m => {
    m.delete();
    message.delete();


const editembed5 = new Discord.MessageEmbed()
.setTitle('// QUESTION 5')
.setColor(userColor)
.setThumbnail("https://i.ytimg.com/vi/nanFcbQmSUY/maxresdefault.jpg")
.addField("your valorant playstyle is best described as:", "`1` // aggressive, i almost always top frag and i feel like it's my duty to push in first\n`2` // protective, i make sure my teammates are always set up for success\n`3` // kinda retarded, i aim like i have feet for hands and i jump while shooting\n`4` // sneaky, i like to flank away from the team and mess with the enemy's heads")
.setFooter(trueAuthorTag + " • wait a few seconds before answering to avoid api spam!");


message.channel.send(editembed5).then(message => {
    

    //FILTER
     



    const editFilter = m => (m.content == "1" || m.content == "2" || m.content == "3" || m.content == "4") && m.author.id === trueAuthorId;





    const collector = message.channel.createMessageCollector(editFilter, {time:  30000 });   
   


collector.on('collect', m => {


const editembed = new Discord.MessageEmbed()
.setTitle('// YOUR QUIZ RESULTS')
.setDescription("**you agent is: PHOENIX** :fire:\n\nLMFAO what were you expecting <:VVusoppface:707671423077842965> we live by phoenix worship around these parts (and no this does not mean you should main him, if you try kayla will ban you thanks)")
.setColor(userColor)
.setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdzP7YpJvSqIsWYS_gcUNHs_HF5ci1vN03649Kmfp6Cekc9MuZgN1VeF8T11wzeGNFxWM&usqp=CAU")
.setFooter(trueAuthorTag);


message.edit(editembed)
message.reactions.removeAll();
db.delete(message.author.id + '.quiz');



})})


})})


})



})})














})

   

      
});



 
});

       

          
    });



     
  });
  
      





















    }


}






*/

//VALORANT TRIVIA
/*

if (answered == false) {
    userAnswer = message.content.toLowerCase();
    if(userAnswer == cAnswer) {

        message.channel.send("**" + message.author.username + "** got it right wow what a nerd :smiley::thumbsup:")




    } else {
        message.channel.send("**" + message.author.username + "**, LMAO you got it wrong get fucked")



    }
answered = true; cAnswer = ""; userAnswer = "";




}

*/

/*
if (cmd === `${prefix}valquiz`) {


    const quizArray = [];


    bot.users.cache.forEach(user => {   //THIS IS NOT THE ERROR BLOCK  


        if (db.has(user.id + '.quiz')) {

            quizArray.push(user);

        }
    });

   




    if (quizArray.length != 0) {


        message.channel.send(`a quiz is already in session shut up`).then(message => {
            message.delete({timeout:3000})
        }).catch(console.error);

    } else
    
    
if (db.has(message.author.id + '.quiz')) {
        message.channel.send(`**${message.author.tag}**, you already started a quiz idot`).then(message => {
            message.delete({timeout:3000})
        }).catch(console.error);

    } else {


    db.set(message.author.id + '.quiz', 'true');
dot

        var number = 14;
       

        var random = Math.floor(Math.random() * (number - 1 + 1)) + 1;

        switch (random) {




            case 1: 
            let case1embed = new Discord.MessageEmbed()
            .setTitle("// VALORANT TRIVIA")
            .setColor(userColor)

            .setDescription("be the first to answer correctly in **10 seconds**")
            .setThumbnail("https://preview.redd.it/gwx9mwfgyzb51.png?width=973&format=png&auto=webp&s=fea549194ca0f838eb3eeeab3ac80720d97540e9")
            .addField("what is raze's real name?", "<:VVdot:809087399094124624> `A` // camila\n<:VVdot:809087399094124624> `B` // izzy\n<:VVdot:809087399094124624> `C` // bruna\n<:VVdot:809087399094124624> `D` // alzira")
            .setFooter(message.author.tag + " started a question, but anyone can answer!")
            message.channel.send(case1embed);
            cAnswer = "B";
            break;

                case 2:
let case2embed = new Discord.MessageEmbed()
.setTitle("// VALORANT TRIVIA")
.setColor(userColor)
 
.setDescription("be the first to answer correctly in **10 seconds**")
.setThumbnail("https://preview.redd.it/a2thumk4zzb51.png?width=733&format=png&auto=webp&s=d105410d745d3fab918506be0c7eb1aaf70d7d8b")
            .addField("what is phoenix's real name?", "<:VVdot:809087399094124624> `A` // tyson\n<:VVdot:809087399094124624> `B` // rommell\n<:VVdot:809087399094124624> `C` // god\n<:VVdot:809087399094124624> `D` // grant")
            .setFooter(message.author.tag + " started a question, but anyone can answer!")

            message.channel.send(case2embed);
            cAnswer = "C";
            break;

                    case 3:
                        let case3embed = new Discord.MessageEmbed()
                        .setTitle("// VALORANT TRIVIA")
                        .setColor(userColor)

                        .setDescription("be the first to answer correctly in **10 seconds**")
                        .setThumbnail("https://preview.redd.it/zi13wq8vyzb51.png?width=775&format=png&auto=webp&s=df9effdb738c31309fae17ab7699f25a36f696be")
            .addField("who is the objectively most annoying agent?", "<:VVdot:809087399094124624> `A` // skye\n<:VVdot:809087399094124624> `B` // yoru\n<:VVdot:809087399094124624> `C` // killjoy\n<:VVdot:809087399094124624> `D` // breach")
            .setFooter(message.author.tag + " started a question, but anyone can answer!")

            message.channel.send(case3embed);
            cAnswer = "D";
            break;

                        case 4:
let case4embed = new Discord.MessageEmbed()
.setTitle("// VALORANT TRIVIA")
.setColor(userColor)

                                .setThumbnail("https://preview.redd.it/12l1n0ozyzb51.png?width=824&format=png&auto=webp&s=ddf31a9914f791dc936a0566e436d4441ed35162")
                                .setDescription("be the first to answer correctly in **10 seconds**")
                                .addField("how old is brimstone?", "<:VVdot:809087399094124624> `A` // 28\n<:VVdot:809087399094124624> `B` // 34\n<:VVdot:809087399094124624> `C` // 37\n<:VVdot:809087399094124624> `D` // idk but he's old as shit")
                                .setFooter(message.author.tag + " started a question, but anyone can answer!")


                                message.channel.send(case4embed);
                                cAnswer = "D";

                                break;

                           case 5:
                            let case5embed = new Discord.MessageEmbed()
                            .setTitle("// VALORANT TRIVIA")
                            .setColor(userColor)

                            .setDescription("be the first to answer correctly in **10 seconds**")
                            .setThumbnail("https://preview.redd.it/ye5bl4amyzb51.png?width=885&format=png&auto=webp&s=629b1d514f1a05b5945b35bb231e729fe08927fa")
                            .addField("what is jett's real name?", "<:VVdot:809087399094124624> `A` // cho-hee\n<:VVdot:809087399094124624> `B` // young-hee\n<:VVdot:809087399094124624> `C` // joon-hee\n<:VVdot:809087399094124624> `D` // hae-won")
                            .setFooter(message.author.tag + " started a question, but anyone can answer!")

                            message.channel.send(case5embed);
                            cAnswer = "C";

                            break;





                            case 6:
                                let case6embed = new Discord.MessageEmbed()
                                .setTitle("// VALORANT TRIVIA")
                                .setColor(userColor)
    
                                .setDescription("be the first to answer correctly in **10 seconds**")
                                .setThumbnail("https://i.redd.it/lyh08nvhyzb51.png")
                                .addField("who is the hottest agent?", "<:VVdot:809087399094124624> `A` // reyna\n<:VVdot:809087399094124624> `B` // phoenix\n<:VVdot:809087399094124624> `C` // sage\n<:VVdot:809087399094124624> `D` // sova")
                                .setFooter(message.author.tag + " started a question, but anyone can answer!")
    
                                message.channel.send(case6embed);
                                cAnswer = "B";
    
                                break;

                                case 7:
                                let case7embed = new Discord.MessageEmbed()
                                .setTitle("// VALORANT TRIVIA")
                                .setColor(userColor)
    
                                .setDescription("be the first to answer correctly in **10 seconds**")
                                .setThumbnail("https://preview.redd.it/2umgiaw9t6851.png?width=775&format=png&auto=webp&s=f344b1a222a9cf8dc97464e2d6fef9f91ffdddac")
                                .addField("what country is sage from?", "<:VVdot:809087399094124624> `A` // north korea\n<:VVdot:809087399094124624> `B` // south korea\n<:VVdot:809087399094124624> `C` // japan\n<:VVdot:809087399094124624> `D` // china")
                                .setFooter(message.author.tag + " started a question, but anyone can answer!")
    
                                message.channel.send(case7embed);
                                cAnswer = "D";
    
                                break;






                                case 8:
                                let case8embed = new Discord.MessageEmbed()
                                .setTitle("// VALORANT TRIVIA")
                                .setColor(userColor)
    
                                .setDescription("be the first to answer correctly in **10 seconds**")
                                .setThumbnail("https://preview.redd.it/36n1dd5uyzb51.png?width=904&format=png&auto=webp&s=a17ca4c347c1fe14d657c332b6ce4e26a4233eaf")
                                .addField("what is sova's role?", "<:VVdot:809087399094124624> `A` // duelist\n<:VVdot:809087399094124624> `B` // initiator\n<:VVdot:809087399094124624> `C` // sentinel\n<:VVdot:809087399094124624> `D` // controller")
                                .setFooter(message.author.tag + " started a question, but anyone can answer!")
    
                                message.channel.send(case8embed);
                                cAnswer = "B";
    
                                break;

                                case 9:
                                    let case9embed = new Discord.MessageEmbed()
                                    .setTitle("// VALORANT TRIVIA")
                                    .setColor(userColor)
        
                                    .setDescription("be the first to answer correctly in **10 seconds**")
                                    .setThumbnail("https://preview.redd.it/xik0dntdyzb51.png?width=797&format=png&auto=webp&s=57f1f21daf0e840c32ef97b35eaa8357241c34ce")
                                    .addField("what is viper's real name?", "<:VVdot:809087399094124624> `A` // savine\n<:VVdot:809087399094124624> `B` // sabine\n<:VVdot:809087399094124624> `C` // serene\n<:VVdot:809087399094124624> `D` // sapine")
                                    .setFooter(message.author.tag + " started a question, but anyone can answer!")
        
                                    message.channel.send(case9embed);
                                    cAnswer = "B";
        
                                    break;
    
                                    case 10:
                                        let case10embed = new Discord.MessageEmbed()
                                        .setTitle("// VALORANT TRIVIA")
                                        .setColor(userColor)
            
                                        .setDescription("be the first to answer correctly in **10 seconds**")
                                        .setThumbnail("https://preview.redd.it/gdfs4cikyzb51.png?width=903&format=png&auto=webp&s=dc52611a934c07fd9577051d9cf3ae2583567c46")
                                        .addField("who is the scariest agent?", "<:VVdot:809087399094124624> `A` // omen\n<:VVdot:809087399094124624> `B` // raze\n<:VVdot:809087399094124624> `C` // cypher\n<:VVdot:809087399094124624> `D` // phoenix (when kayla is playing him)")
                                        .setFooter(message.author.tag + " started a question, but anyone can answer!")
            
                                        message.channel.send(case10embed);
                                        cAnswer = "D";
            
                                        break;
        

                                        case 11:
                                            let case11embed = new Discord.MessageEmbed()
                                            .setTitle("// VALORANT TRIVIA")
                                            .setColor(userColor)
                
                                            .setDescription("be the first to answer correctly in **10 seconds**")
                                            .setThumbnail("https://preview.redd.it/eloidlkqt6851.png?width=755&format=png&auto=webp&s=09307ed14646f7022c69b7d0eae30381632de90a")
                                            .addField("who is the best valorant player ever to exist?", "<:VVdot:809087399094124624> `A` // tenz\n<:VVdot:809087399094124624> `B` // hiko\n<:VVdot:809087399094124624> `C` // xtr\n<:VVdot:809087399094124624> `D` // sinatraa")
                                            .setFooter(message.author.tag + " started a question, but anyone can answer!")
                
                                            message.channel.send(case11embed);
                                            cAnswer = "C";
                
                                            break;
            
                                            case 12:
                                                let case12embed = new Discord.MessageEmbed()
                                                .setTitle("// VALORANT TRIVIA")
                                                .setColor(userColor)
                    
                                                .setDescription("be the first to answer correctly in **10 seconds**")
                                                .setThumbnail("https://cdn1.dotesports.com/wp-content/uploads/2021/04/22125419/Breeze-VAL-768x420.png")
                                                .addField("which of these is NOT a location on any map?", "<:VVdot:809087399094124624> `A` // pizza\n<:VVdot:809087399094124624> `B` // secret\n<:VVdot:809087399094124624> `C` // banana\n<:VVdot:809087399094124624> `D` // swings")
                                                .setFooter(message.author.tag + " started a question, but anyone can answer!")
                    
                                                message.channel.send(case12embed);
                                                cAnswer = "D";
                    
                                                break;

                                                case 13:
                                                let case13embed = new Discord.MessageEmbed()
                                                .setTitle("// VALORANT TRIVIA")
                                                .setColor(userColor)
                    
                                                .setDescription("be the first to answer correctly in **10 seconds**")
                                                .setThumbnail("https://i.pinimg.com/236x/d4/47/a0/d447a08dac0401300ba7e492b3f60ae5.jpg")
                                                .addField("how many stars does astra have?", "<:VVdot:809087399094124624> `A` // two\n<:VVdot:809087399094124624> `B` // three\n<:VVdot:809087399094124624> `C` // four\n<:VVdot:809087399094124624> `D` // five")
                                                .setFooter(message.author.tag + " started a question, but anyone can answer!")
                    
                                                message.channel.send(case13embed);
                                                cAnswer = "D";
                    
                                                break;

                                                case 14:
                                                let case14embed = new Discord.MessageEmbed()
                                                .setTitle("// VALORANT TRIVIA")
                                                .setColor(userColor)
                    
                                                .setDescription("be the first to answer correctly in **10 seconds**")
                                                .setThumbnail("https://scontent.fric1-1.fna.fbcdn.net/v/t1.6435-9/127640019_204248977862133_5622107025234733984_n.jpg?_nc_cat=101&ccb=1-3&_nc_sid=730e14&_nc_ohc=j1SJc1A3J1gAX8-5kZg&_nc_ht=scontent.fric1-1.fna&oh=d3e17b1eb4c80087260d4a82eaaea2de&oe=60C6386E")
                                                .addField("how long does a jett smoke last?", "<:VVdot:809087399094124624> `A` // three seconds\n<:VVdot:809087399094124624> `B` // four seconds\n<:VVdot:809087399094124624> `C` // six seconds\n<:VVdot:809087399094124624> `D` // 10 seconds")
                                                .setFooter(message.author.tag + " started a question, but anyone can answer!")
                    
                                                message.channel.send(case14embed);
                                                cAnswer = "B";
                    
                                                break;





        }

        
const filter = m => (m.content.toUpperCase() == "A" || m.content.toUpperCase() == "B" || m.content.toUpperCase() == "C" || m.content.toUpperCase() == "D") && m.author.id;
const collector = message.channel.createMessageCollector(filter, { time:  10000 });   



collector.on('collect', (m) => {
   // if(!db.has(m.author.id + '.answered')) {


if(m.content.toUpperCase() == cAnswer) {

        m.react("👍")
        m.channel.send("**" + m.author.username + "** got it right wow what a nerd :smiley:")
        collector.stop();
        //db.set(m.author.id + '.answered', 'true');

    } else {
        m.react("🚮")
        //db.set(m.author.id + '.answered', 'true');

    }

    //} else {

//return;


    //}
    

})

collector.on("end", (collected) => {
        message.channel.send("this quiz is over, ask another question with `" + `${prefix}valquiz` + "`")
        db.delete(message.author.id + '.quiz');
       // db.delete(message.author.id + '.answered');
       // db.delete(m.author.id + '.answered');
      
      
      
      
      
      })





    }



    
}

*/

//trying to edit message embed based on reaction
//SUCCESS !!!

if (cmd === `${prefix}fortune`) {

    let fortuneList = ["once you get your covid vaccine, you'll turn into a flesh-eating zombie after 4 weeks", "someday in a few years kayla will hire you to babysit her and logan's kids for $0.78 an hour", "you're invited to logan and kayla's wedding in 10 years!", "you'll randomly have a sex change in 2 years and your pp will vanish", "in exactly 48 days your legs will become your arms and your arms will become your legs", "when you go to college, you'll be able to room with your best friends! lucky you", "at 3 a.m. tomorrow you will wake up to find a BIG ASS COCKROACH ON YOUR PILLOW", "your precious puppy might get devoured by kayla one of these days so watch out!!!", "valorant will become lame and dead and everyone in the server will go back to csgo", "your favorite food will be BANNED in your country for eternity.", "in 13 days, you will be demoted to iron 1, your main and favorite map will be removed from the game, and you will have a 7-day queue ban from all game modes", "you will someday grow a pair of boobs congrats", "by the end of this year, you're gonna be in an intimate relationship with deviant", "YOU'LL BECOME A SKYE MAIN :nauseated_face:", "you're gonna die alone and in like 4 days lol", "you'll become rich from the lottery but the government will take 98% of the money", "you'll become a pro valorant player in the next 3 years", "you're so ugly you don't deserve a fortune.", "kayla's gonna ban you in less than a week", "it says you'll finally get a gf! ...wait i wasn't wearing my glasses, it says you're gonna die alone", "you're gonna get stuck in a dark alleyway with stan and deviant LMFAO", "you're gonna own amazon in 10 years (if you're not dead by then lol)", "in 3 weeks you'll get banned from valorant", "if you dm stan and say \"hey wassup baby\" he'll give you $200, go try it", "you'll die at 69", "if the world ends, you'll be the only one who survives", "the person you'll marry someday is asian", "tenz will become your best friend by the end of this year and he'll train you in valorant", "your valorant main gets entirely removed by riot because they said they're \"unnecessary\" to the game LOL", "the next time you go outside, a random feral child will try to bite off your finger"];

    var selectedFortune = fortuneList[(Math.random() * fortuneList.length) | 0]



    let trueAuthorId = message.author.id;

    let trueAuthorTag = message.author.tag;
   
   

const testembed = new Discord.MessageEmbed()


        //CREATE original embed upon execution of *testembed
        .setTitle('// FORTUNE TELLER')
          .setColor(userColor)
          .setThumbnail("https://cdn.discordapp.com/attachments/723691178977001494/837033723429126224/image-removebg-preview_7.png")
          .setDescription('react below to see your **100000% accurate** and totally not fabricated fortune! :fortune_cookie:')
          .setFooter(message.author.tag + " • react in 10 seconds or i'm not telling u")
          message.channel.send(testembed) //SEND original embed
          .then(message => {
            message.react('🥠'); //REACT to original embed

            //FILTER
             
     

 const editFilter = (reaction, user) => reaction.emoji.name === '🥠' && user.id === trueAuthorId;
 
 //THIS IS WHERE THE ERROR IS, for some reason the message author is being detected as the bot instead of the user who executed the command 

      const collector = message.createReactionCollector(editFilter, {time:  10000 });   


    collector.on('collect', (reaction, user) => { //this should execute ONLY when the message author reacts to the embed

 message.reactions.removeAll();

        const editembed = new Discord.MessageEmbed()
        .setTitle('// FORTUNE TELLER')
    .setColor(userColor)
    .setThumbnail("https://cdn.discordapp.com/attachments/723691178977001494/837033723429126224/image-removebg-preview_7.png")
    .setDescription(":sparkles: **" + selectedFortune + "** :sparkles:")
    .setFooter(trueAuthorTag + "'s fortune");

        
    message.edit(editembed);

       

          
    });



     
  });
  
      







}







//attempt at the roulette command
/*
if (cmd === `${prefix}roulette`) {
    if(message.member.hasPermission("ADMINISTRATOR")) {


    

    let trueAuthorId = message.author.id;

    let trueAuthorTag = message.author.tag;
   
   

const startEmbed = new Discord.MessageEmbed()


        .setTitle('// ROULETTE')
          .setColor(userColor)
          .setThumbnail("")
          .setDescription("**" + message.author.username + '** just started a *totally super fun* game of russian roulette! react below to join 💣\n**warning: loser gets auto banned**')
          .setFooter("the game will start in 15")
          message.channel.send(startEmbed) //SEND original embed
          .then(message => {
            message.react('💣'); //REACT to original embed

            //FILTER
 const editFilter = (reaction, user) => reaction.emoji.name === '💣' && user.id !== trueAuthorId;
 
 //THIS IS WHERE THE ERROR IS, for some reason the message author is being detected as the bot instead of the user who executed the command 

      const collector = message.createReactionCollector(editFilter, {time:  10000 });   







    collector.on('collect', (reaction, user) => { //this should execute ONLY when the message author reacts to the embed


        const editembed = new Discord.MessageEmbed()
        .setTitle('// FORTUNE TELLER')
    .setColor(userColor)
    .setThumbnail("https://cdn.discordapp.com/attachments/723691178977001494/837033723429126224/image-removebg-preview_7.png")
    .setDescription(":sparkles: **" + selectedFortune + "** :sparkles:")
    .setFooter(trueAuthorTag + "'s fortune");

        
    message.edit(editembed);

       

          
    });



     
  });
  
      





    }



}*/






























    
//TYPETEST


if(cmd === `${prefix}typetestlb`) {
    const difarray = [];


        bot.users.cache.forEach(user => {   //THIS IS NOT THE ERROR BLOCK  


            if (db.has(user.id + '.highscore')) {
                if (db.get(user.id + '.highscore') >= 70) {
                                    difarray.push(user);

                } else {
                    return;
                }


            }
        });


 var allmembers = difarray.length;
 /* 
 let people = 0;
 let peopleToShow = 10;*/

 const mes = [];

 for (let i = 0; i < allmembers; i++) {

    var score = db.get(difarray[i].id + '.highscore');



    mes.push({
        name: difarray[i].tag,
        score: score
    });
 }


 const realArr = [];

 for (let k = 0; k < mes.length; k++) {
     /*
     people++
     if(people>=peopleToShow) continue;*/
     realArr.push(`**${mes[k].name}** . . . ${mes[k].score} WPM`);

 }

 //[3, 8, -10, 23, 19, -4, -14, 27].sort((a,b)=>a-b)
// Output: Array(8)  [ -14, -10, -4, 3, 8, 19, 23, 27 ]

 var finalList = realArr.join("\n<:VVdot:809087399094124624>")

 if (finalList.length == 0) {

    let typetestlistembed = new Discord.MessageEmbed()
                .setTitle("// TYPETEST LEADERBOARD (70+ WPM)")
                .setThumbnail("https://cdn.discordapp.com/attachments/723691178977001494/836673740602605568/tumblr_pejvi8ZjpB1tlkklno1_500.png")

                .setColor(userColor)
                .setDescription("no one has played type test so far!")
                .setFooter("requested by " + message.author.tag + " • leaderboard resets every 24 hours");
                message.channel.send(typetestlistembed);
    
 } else {

    
                let typetestlistembed = new Discord.MessageEmbed()
                .setTitle("// TYPETEST LEADERBOARD (70+ WPM)")
                .setThumbnail("https://cdn.discordapp.com/attachments/723691178977001494/836673740602605568/tumblr_pejvi8ZjpB1tlkklno1_500.png")
                .setColor(userColor)
                .setDescription("<:VVdot:809087399094124624>" + finalList)
                .setFooter("requested by " + message.author.tag + " • leaderboard resets every 24 hours");

                message.channel.send(typetestlistembed);
 }

}



    if (cmd === `${prefix}typetest`) {

      /*  typetestCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.16666666666);
        setTimeout(() => { typetestCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.00277778);*/
    
        if (db.has(message.author.id + '.typetest')) {
            message.channel.send(`**${message.author.tag}**, you're already doing a typing test and now i have to end it idot :smiley:\ntype \`${prefix}typetest\` to start again`).then(message => {
                message.delete({timeout:7000})
            }).catch(console.error);
    
        } else {
        db.set(message.author.id + '.typetest', 'true');
    
    
    
    
    
        var startTime;
        var endTime;
    
    function start() {
      startTime = new Date();
    };
    
    function end() {
      endTime = new Date();
     
    }
    
    /*"brimstone kinda thick ngl", "Viper should definitely be French and not American.", "kayla will ban all other phoenix mains in this server, so watch out", "WORST FEMALE: Jett", "BATTLE SAGEEE", "revealing area to find who the fuck asked", "NO SKYE MAINS.", 'cypher: haha, where did you come-', */
        const phraseList = ["When God created women, he gave her not two breasts, but three. When the middle one got in the way, God performed surgery. As he stood there in the garden, with the middle breast in hand, he said \"what do I do with this useless boob?\" And so God created man.", "After a long day of work, Kanye West goes to his Kanye Nest to take his Kanye Rest. He wakes up feeling his Kanye Best. Then he’ll get Kanye Dressed on his Kanye Vest to go on a Kanye Quest.", "\"Hey Klorox baby,\" said Hunter, gazing over his beloved in his cat ear headset and pink studded gaming chair.","I've worked my whole life just to get high just to realize, everything I need is on the ground", "HI FRIENDS this is kayla's ranking of the prettiest to least females in valorant: raze, sage, reyna, and the rest don't matter lmao", "Gazing thusinto her alien eyes-those unknowable pools of vast and bottomless hunger-the rancher muttered in a fit of instinctual frenzy: \"Hypaea.\"", "psst a little birdie told me that kayla's gonna ban every other phoenix main in this server hehe... it's only a rumor ofc!", "▄▄▄▀▀▀▄▄███▄░░░░░▄▀▀░░░░░░░▐░▀█ █░░░▄▀░░░░▄▄███░", "Excuse me? I find vaping to be one of the best things in my life. It has carried me through the toughest of times and brought light and vapor upon my spirit.", "Equip an echo that mimics footsteps when activated. Fire to activate and send the echo forward. Alt Fire to place an echo in place. Use the inactive echo to send it forward", "daddys back from his discord session, and seen you didnt give him hole pics, daddy is very angry with you, snap me one right now before i come over there and punish my little kitten", "VALORANT is a free to play 5v5, character-based tactical shooter. The game operates on an economy-round, objective-based, first-to-13 competitive format where you select a unique agent to play for the entirety of the match.", "Yoru seems kind of balls to me. his ult makes a huge noise when he's out of it so you're going to be expected, his footsteps stop when they collide with anything so they're hardly useful", "breach? more like BEACH. breach should not exist as an agent. he is ENTIRELY just PURELY THE EPITOME of annoyance. why does someone need 3 flashes?? why?", "Shrouded Step also completely shuts down Cypher traps. See a Cypher trap? Teleport right past it! I can't tell you the amount of times I've flanked and caught the enemy Cypher completely off guard because I never broke his trap.", "Be more specific what are you actually asking to be nerfed about her? She has many different abilities what are you wanting to see? 'Nerf Raze' is kind of a broad term.", "same with me yesterday... the enemy astra just smokes all her stars at the base we were attacking and my fps dropped from 60(limited) to15-20 and same with my teamates...", "I love being a fat worthless slut for daddy. I hope I can find someone to over feed me", "Once upon a time, Asante was walking down the street to the grocery store. He bumped into Stan and Deviant on the way there and...well, you get the rest.", "𓀲	𓀳	𓀴	𓀵	𓀶	𓀷	𓀸	𓀹	𓀺	𓀻	𓀼	𓀽	𓀾	𓁀	𓁁	𓁂	𓁃	𓁄	𓁅	𓁆	𓁇	𓁈	𓁉	𓁊	𓁋	𓁌	𓁍	𓁎", "var isKaylaABadBitch = true;", "Hey if you haven't signed up for our 5v5 VALORANT tourney yet you should!!! Check events channel", "Nobody: _ Cam after 2 months of disappearing: hey guys check out my new memes", ":) :( :/ :| :D :C :O", "OPd8d 82 GDBanbxbvv JAVJ6XWv2l nx2bc wo8F2Pg 8", "ẃ̴͙͙͌̍e̵͙͓̲͙̓̍͋̚l̴̮̺̭̿̚͠ḷ̶̡͕̍̂͑͝ ̷̟͎̬͘i̸̳̽̈́̏̈́t̷̝̿͊̈̒ ̷̡͍̗̣͗́̕l̵̢͖̱̓̕ͅo̴̬̔̆̽͠o̸̡̹̞̫̒̉̕k̷̙̜̀͒̀͘s̴̮͙̺̏̎͝ ̶͎̮̰̞̈́́̂ĺ̶̡̨̪̮i̸͍͔͆k̵̰̺̈́͐é̶͈̰ ̸̀̅iiwon̶̡̞̮͖̔̑L̴͕̣͙͐̓̕̕M̵̗̲̒̐̕Ǎ̸̡̯̉̾̈́Ȏ̸͙̺͗͘"];
    
        var selectedPhrase = phraseList[(Math.random() * phraseList.length) | 0]

        var characters = selectedPhrase.length;

    
    
            message.channel.send("**" + message.author.username + "**, type the following prompt **exactly** how it appears to end the test (include ALL spaces, capitals, punctuation, etc.)")
            start();
    
            let filter = n => n.author.id === message.author.id;

            let promptembed = new Discord.MessageEmbed()
            .setTitle("// TYPE THIS PROMPT")
            .setDescription("`" + selectedPhrase + "`")
            .setFooter(message.author.tag + " • 60 seconds before the test closes!")
            .setColor(userColor);
            message.channel.send(promptembed)
            .then(() => {
    
    
                //filter
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                })
                .then(message => {
                    message = message.first()
    
                    let answer = message.content;
    
                    //begin checks here
                    if (answer == selectedPhrase) {
                        end();
    
                        var timeDiff = endTime - startTime; 
                        timeDiff /= 1000;
                        var seconds = Math.round(timeDiff);
                        var minutes = seconds/60;
    

                        var wpm = (characters/5) / minutes;


                        var finishedWPM = Math.round(wpm);
    
                        if (finishedWPM >= 120) {
                            message.channel.send("**" + message.author.username + "**, you finished! unfortunately i caught you cheating LOL imagine");
                        db.delete(message.author.id + '.typetest');

                        } else {


                            message.channel.send("**" + message.author.username + "**, you finished! your speed was **" + finishedWPM + "** words per minute");
                            db.delete(message.author.id + '.typetest');

                            //`user.${message.author.id}.balance`
                            if (!db.has(message.author.id + '.highscore')) {

                                db.set(message.author.id + '.highscore', finishedWPM);


                            } else if (db.has(message.author.id + '.highscore') && finishedWPM > db.get(message.author.id + '.highscore')) {
                                db.set(message.author.id + '.highscore', finishedWPM);




                            } else {

                                return;




                            }



                            
                            
                        }
    
                        
    
    
                    } else {
                        if (answer === `${prefix}typetest`) {
                            db.delete(message.author.id + '.typetest');


                        return;

                        } else {

                            message.channel.send("**" + message.author.username + "**, youuuu typed it wrong and therefore you suck");
                        db.delete(message.author.id + '.typetest');
                        }
    
    
                        
    
    
    
                    }
    
                    
    
                    
                })
                .catch(collected => {
                    message.channel.send(`**${message.author.username}**, 60 seconds have passed sooo i'll just give you a score of **bad** :smiley:`)
                    db.delete(message.author.id + '.typetest');

                })
    
            })
    
    
            
            
            
           
                    
    
     
    
                }}


















 

    //*botinfo (info cmd, embed)
    if(cmd === `${prefix}botinfo`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;




            let boticon = bot.user.displayAvatarURL({dynamic : true});

            let botembed = new Discord.MessageEmbed()
    
            .setTitle("// BOT INFO")
            .setDescription("this bot was coded using the **discord.js** (javascript) library\n")
            .setThumbnail(boticon)
            .setColor(userColor)
            .addField("**name**", "`" + `${bot.user.tag}` +"`")
            .addField("**created on**", "05.09.2020")
            .addField("**created by**", "<@382253023709364224>")
            .addField("**total current commands**", "59")
            .setFooter("requested by " + message.author.tag);
            
            return message.channel.send(botembed);

             
        
       
    }
   

    //*calc
    if(cmd === `${prefix}calc`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        let expression = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if(expression === `${prefix}calc`) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("...what are you doing")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*calc <expression>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);

        } else {

            let resp;
            try {
                resp = math.evaluate(args.join(' '));
                
            } catch (e) {
                return message.channel.send("**" + message.author.tag + "**, please enter a valid mathematical expression you fucking pea brain");
            }

            let mathembed = new Discord.MessageEmbed()

            .setColor(userColor)
            .setTitle("math calculation")
            .addField("input", `\`\`\`js\n${args.join(' ')}\`\`\``)
            .addField("output", `\`\`\`js\n${resp}\`\`\``)

            message.channel.send(mathembed);




        }




    }


//*TYPERACE
/*
if (cmd === `${prefix}typerace`) {


    const example = {
        channelID: {
            message: "message object",
            stage: "string",
            counter: "number",
            currentWord: "string",
            remainingWords: ["words here"],
            points: {
                userID: "points"
            }
        }
    }

    const games = {};

    const stages = {
        "STARTING": (counter) => {
            return "**" + message.author.username + "** just started a new game of TYPERACE (starting in `" + `${counter}` + "` second(s))"
        },
        "MID GAME": () => {},
        "ENDING": () => {}
    }



    const gameLoop = () => {
        for (const key in game) {


            const game = games[key]
            const { message, stage } = game


            if (stage === "STARTING") {
                message.edit(stages[stage])(game.counter)
            }

        }


        setTimeout(gameLoop, 1000)
    }




    gameLoop();




}


*/
    //*HANGMAN wooo yay fun

    /*

    if (cmd === `${prefix}hangman`) {
        if (db.has(message.author.id + '.hangman')) {
            message.channel.send(`**${message.author.tag}**, you're already in a game of hangman! (type \`${prefix}hangmancancel\` to end it)`).then(message => {
                message.delete({timeout:7000})
            }).catch(console.error);
    
        } else {

        db.set(message.author.id + '.hangman', 'true');

        var stages = [`\`\`\`
/---|
|   
|
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|   |
| 
|
\`\`\`
`, `\`\`\`
/---|
|   o
|  /|
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|  /|\\
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|  /|\\
|  /
|
\`\`\`
`, `\`\`\`
/---|
|   o ~ thanks
|  /|\\
|  / \\
|
\`\`\`
`];


let currentStage = stages[0];


        const wordList = ["brimstone", "viper", "phoenix", "jett", "sage", "sova", "skye", "cypher", "yoru", "killjoy", "omen", "raze", "reyna", "astra", "classic", "shorty", "frenzy", "ghost", "sheriff", "stinger", "spectre", "bucky", "judge", "bulldog", "guardian", "phantom", "vandal", "marshal", "operator", "ares", "odin"];

        var selectedWord = wordList[(Math.random() * wordList.length) | 0]

        console.log(selectedWord); //WORKS

        let spaces = "";

        for (let i = 0; i < selectedWord.length; i++) {
       
          spaces+="_ ";
        }

        console.log(spaces); //WORKS

        message.channel.send(currentStage); 
        message.channel.send("**guess this word:** ` " + spaces + "`(`" + `${prefix}hangmancancel` + "` to end)")



        }


    }



















 
    if (cmd === `${prefix}hangmancancel`) {

        if (db.has(message.author.id + '.hangman')) {


            let returnembed = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription(`**${message.author.tag}**, i cancelled your game of hangman (u suck :thumbsup:)`);
                message.channel.send(returnembed).then(message => {
                    message.delete({timeout:7000})
                }).catch(console.error);
         
         
         
             
                db.delete(message.author.id + '.hangman');
              
         
         
         } else {
         
             message.channel.send("**" + message.author.username + "**, you're not in any hangman game right now :face_with_raised_eyebrow:");
         
         }

        


    }


*/


//CUSTOM commands

//https://cdn.discordapp.com/attachments/657679783735328791/779860644404920351/images.png





    if(cmd === `${prefix}stan`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://tenor.com/view/raze-valorant-meme-funny-gaming-gif-18816053")
    }
    if(cmd === `${prefix}mods`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/717916711222771762/732600039796506784/muted.jpg")
    }
 
     
    

    if(cmd === `${prefix}no`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/726269819980087327/734915660185862225/image0.png")
    }
    if(cmd === `${prefix}headass`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://tenor.com/view/headass-pixar-parody-gif-7621934")
    }
    if(cmd === `${prefix}ihateithere`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/657679783735328791/734215765523300433/image0.jpg")
    }
    if(cmd === `${prefix}holdthis`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://media.discordapp.net/attachments/713643566580367431/749533415921156166/image0.gif")
    }
    if(cmd === `${prefix}valorant`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://tenor.com/view/armin-eren-valorant-ihate-valorant-gif-20762753")
    }
 
    if(cmd === `${prefix}asante`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://tenor.com/view/valorant-sova-golden-moment-gif-20771849")
    }
    if(cmd === `${prefix}craig`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://preview.redd.it/o65ltp3mdy261.jpg?auto=webp&s=4d567f1d26766fdfdf41400337c130967a2735a4")
    }
    if(cmd === `${prefix}cap`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://tenor.com/view/cap-thats-cap-eyeglasses-selfie-boy-gif-17626520")
    }
    if(cmd === `${prefix}reynamain`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://tenor.com/view/valorant-reyna-ez-reyna-sucks-reyna-bad-gif-20934882")
    }
    if(cmd === `${prefix}klorox`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://media.giphy.com/media/HvoFavqNkfwAY3ClL2/giphy.gif")
    }
 

    if(cmd === `${prefix}unsainted`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/657679783735328791/832779851827511313/e.mp4")
    }
    
    if(cmd === `${prefix}adamm`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://pics.me.me/europe-no-brits-allowed-2916287.png")
    }
    if(cmd === `${prefix}asante2`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://pbs.twimg.com/media/EeDJsHrX0AYHnQr.jpg")
    }
    if(cmd === `${prefix}sus`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/657679783735328791/836979800354586664/stananddev.png")
    }
    if(cmd === `${prefix}stan2`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/657679783735328791/836995857994743868/9k.png")
    }
    if(cmd === `${prefix}stan3`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/657679783735328791/840052909541425162/image0.png")
    }
    if(cmd === `${prefix}bye`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://tenor.com/view/goodbye-chat-gif-20275788")
    }
    if(cmd === `${prefix}brits`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://cdn.discordapp.com/attachments/810641714145525781/845222412907315270/video0.mp4")
    }
    

    if(cmd === `${prefix}brits2`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        message.channel.send("https://media.discordapp.net/attachments/724028063943229600/941100334040899634/men.png?width=730&height=703")
    } 

 


    if(cmd === `${prefix}custom`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        if(randomTipChance <= 1) {


 
let serverembed = new Discord.MessageEmbed()

            .setTitle("// VV CUSTOM COMMANDS (20)")
            .setColor(userColor)
            .setDescription("`sus`, `brits`, `brits2`, `holdthis`, `headass`, `ihateithere`, `mods`, `no`, `bye`, `reynamain`, `asante`, `asante2`, `stan`, `stan2`, `stan3`, `unsainted`, `valorant`, `craig`, `cap`, `klorox`")
            .setFooter(selectedTip);
    
            return message.channel.send(serverembed);

        } else {

            let serverembed = new Discord.MessageEmbed()

            .setTitle("// VV CUSTOM COMMANDS (20)")
            .setColor(userColor)
            .setDescription("`sus`, `brits`, `brits2`, `holdthis`, `headass`, `ihateithere`, `mods`, `no`, `bye`, `reynamain`, `asante`, `asante2`, `stan`, `stan2`, `stan3`, `unsainted`, `valorant`, `craig`, `cap`, `klorox`")
            .setFooter("requested by " + message.author.tag);
    
            return message.channel.send(serverembed);


        }

    
            
    


        

        






    }







    //*serverinfo (info cmd, embed)
    if(cmd === `${prefix}serverinfo`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let servericon = message.guild.iconURL({dynamic : true});


        let serverembed = new Discord.MessageEmbed()

        .setTitle("// SERVER INFO")
        .setThumbnail(servericon)
        .setColor(userColor)
        .addField("**name**", "`" + message.guild.name + "`")
        .addField("**created on**", "12.20.2019")
        .addField("**member count**", message.guild.memberCount)
        .addField("**owner**", "<@382253023709364224>")
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(serverembed);






    }

    if(cmd ===`${prefix}pp`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        if(!message.mentions.users.first()) {



            //logan
                if(message.author.id==="575805778276122693") {

                    let chance = Math.floor(Math.random() * 11);


                    if (chance==0) {
        
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8D lmao :avocado:");
        
        
                    } else if (chance==1) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=D lmao :avocado:");
        
        
                    } else if (chance==2) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8==D lmao :avocado:");
        
        
                    } else if (chance==3) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8===D :avocado:");
        
        
                    } else if (chance==4) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8====D :avocado:");
        
        
                    } else if (chance==5) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=====D :avocado:");
        
        
                    } else if (chance==6) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8======D :avocado:");
        
        
                    } else if (chance==7) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=======D :avocado:");
        
                    } else if (chance==8) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8========D :avocado:");
        
                    } else if (chance==9) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=========D :avocado:");
        
                    } else if (chance==10) {
                        message.channel.send("**" + message.author.username + "**'s pp size:\n\n8==========D :avocado:");
        
                    }
                    } else {

                    let chance = Math.floor(Math.random() * 11);


            if (chance==0) {

                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8D lmao");


            } else if (chance==1) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=D lmao");


            } else if (chance==2) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8==D lmao");


            } else if (chance==3) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8===D :neutral_face:");


            } else if (chance==4) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8====D :neutral_face:");


            } else if (chance==5) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=====D :smiley:");


            } else if (chance==6) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8======D :smiley:");


            } else if (chance==7) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=======D :flushed:");

            } else if (chance==8) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8========D :flushed:");

            } else if (chance==9) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8=========D <:VVmilk:750364304674390066>");

            } else if (chance==10) {
                message.channel.send("**" + message.author.username + "**'s pp size:\n\n8==========D <:VVcummies:750364329588686980>");

            }
        }
        

        } else {
            let target = message.mentions.users.first();

            //target.username

            if (target.id==="424325226332028929") {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=================================D :heart:"); 

            } else if (target.id==="575805778276122693") {


                let chance = Math.floor(Math.random() * 11);

            if (chance==0) {

                message.channel.send("**" + target.username + "**'s pp size:\n\n8D lmao :avocado:");


            } else if (chance==1) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=D lmao :avocado:");


            } else if (chance==2) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8==D lmao :avocado:");


            } else if (chance==3) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8===D :avocado:");


            } else if (chance==4) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8====D :avocado:");


            } else if (chance==5) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=====D :avocado:");


            } else if (chance==6) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8======D :avocado:");


            } else if (chance==7) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=======D :avocado:");

            } else if (chance==8) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8========D :avocado:");

            } else if (chance==9) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=========D :avocado:");

            } else if (chance==10) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8==========D :avocado:");

            }

        




            

            } else {

                let chance = Math.floor(Math.random() * 11);

            if (chance==0) {

                message.channel.send("**" + target.username + "**'s pp size:\n\n8D lmao");


            } else if (chance==1) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=D lmao");


            } else if (chance==2) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8==D lmao");


            } else if (chance==3) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8===D :neutral_face:");


            } else if (chance==4) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8====D :neutral_face:");


            } else if (chance==5) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=====D :smiley:");


            } else if (chance==6) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8======D :smiley:");


            } else if (chance==7) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=======D :flushed:");

            } else if (chance==8) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8========D :flushed:");

            } else if (chance==9) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8=========D <:VVmilk:750364304674390066>");

            } else if (chance==10) {
                message.channel.send("**" + target.username + "**'s pp size:\n\n8==========D <:VVcummies:750364329588686980>");

            } 

        }
            }
    }

    if(cmd ===`${prefix}rate`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;


        if(!message.mentions.users.first()) {
           if(message.author.id==="382253023709364224") {
                message.channel.send("**3740824027402424/10**, kayla's fine as hell lmao damn :heart_eyes_cat:");


            } else {

            let chance = Math.floor(Math.random() * 11);

            if (chance==0) {

                message.channel.send("**0/10**, god DAMN you're ugly lmao **" + message.author.username + "** :nauseated_face:");


            } else if (chance==1) {
                message.channel.send("**1/10**, go brush your teeth wtf **" + message.author.username + "** <:VVusoppface:707671423077842965>");


            } else if (chance==2) {
                message.channel.send("**2/10**, i mean you're not like HORRIBLE...but you're still pretty ugly yeah :heart: **" + message.author.username + "**");


            } else if (chance==3) {
                message.channel.send("**3/10**, i ain't never seen two pretty bestfriends :eye::lips::eye: **" + message.author.username + "**");


            } else if (chance==4) {
                message.channel.send("**4/10**, you're ok i guess **" + message.author.username + "**");


            } else if (chance==5) {
                message.channel.send("**5/10**, yayyyy halfway there! now go get a rhinoplasty **" + message.author.username + "** :neutral_face:");


            } else if (chance==6) {
                message.channel.send("**6/10**, better than average...barely **" + message.author.username + "**");


            } else if (chance==7) {
                message.channel.send("**7/10**, cool, decent **" + message.author.username + "** :smiley:");

            } else if (chance==8) {
                message.channel.send("**8/10**, wow look at you you're almost hot **" + message.author.username + "** :partying_face:");

            } else if (chance==9) {
                message.channel.send("**9/10**, omg you're so sexy wtf omg wow you're almost as hot as kayla haha **" + message.author.username + "**");

            } else if (chance==10) {
                message.channel.send("**10/10**, YOU'RE SO FUCKING HOT WTF OMG BRO **" + message.author.username + "** <:VVcummies:750364329588686980> (kayla's still hotter tho)");

            } 
        }

            }  else {
                

                let target = message.mentions.users.first();
                if(target.id==="382253023709364224") {
                    message.channel.send("**3740824027402424/10**, kayla's fine as hell lmao damn :heart_eyes_cat:");
    
    
                } else {

            let chance = Math.floor(Math.random() * 11);

            if (chance==0) {

                message.channel.send("**0/10**, god DAMN you're ugly lmao **" + target.username + "** :nauseated_face:");


            } else if (chance==1) {
                message.channel.send("**1/10**, go brush your teeth wtf **" + target.username + "** <:VVusoppface:707671423077842965>");


            } else if (chance==2) {
                message.channel.send("**2/10**, i mean you're not like HORRIBLE...but you're still pretty ugly yeah :heart: **" + target.username + "**");


            } else if (chance==3) {
                message.channel.send("**3/10**, i ain't never seen two pretty bestfriends :eye::lips::eye: **" + target.username + "**");


            } else if (chance==4) {
                message.channel.send("**4/10**, you're ok i guess **" + target.username + "**");


            } else if (chance==5) {
                message.channel.send("**5/10**, yayyyy halfway there! now go get a rhinoplasty **" + target.username + "** :neutral_face:");


            } else if (chance==6) {
                message.channel.send("**6/10**, better than average...barely **" + target.username + "**");


            } else if (chance==7) {
                message.channel.send("**7/10**, cool, decent **" + target.username + "** :smiley:");

            } else if (chance==8) {
                message.channel.send("**8/10**, wow look at you you're almost hot **" + target.username + "** :partying_face:");

            } else if (chance==9) {
                message.channel.send("**9/10**, omg you're so sexy wtf omg wow you're almost as hot as kayla haha **" + target.username + "**");

            } else if (chance==10) {
                message.channel.send("**10/10**, YOU'RE SO FUCKING HOT WTF OMG BRO **" + target.username + "** <:VVmilk:750364304674390066> (kayla's still hotter tho)");

            }
        }
            

    }


        }




    //*avatar cmd
    if((cmd ===`${prefix}avatar`) || (cmd ===`${prefix}av`)) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        if(!message.mentions.users.first()) {

                let sentence = message.author.username;

            let avatarembed = new Discord.MessageEmbed()

        .setTitle("// " + sentence.toUpperCase() + "'S AVATAR")
        .setColor(userColor)
        .setImage(message.author.displayAvatarURL({dynamic : true}))
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(avatarembed);

        } else {
            let target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

            let sentence2 = target.username;


            let avatarembed = new Discord.MessageEmbed()

        .setTitle("// " + sentence2.toUpperCase() + "'S AVATAR")
        .setColor(userColor)
        .setImage(target.displayAvatarURL({dynamic : true}))
        .setFooter("requested by " + message.author.tag);

        return message.channel.send(avatarembed);
        }
    }

   


    //*flip
    if(cmd ===`${prefix}flip`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        let chance = Math.floor(Math.random() * 2);
        if (chance == 0) {
            let headsembed = new Discord.MessageEmbed()

            .setColor(userColor)
            .setDescription("**" + message.author.username + "**'s coin landed on heads <:VVflushed:729798621045850232>")
            .setThumbnail("https://cdn.discordapp.com/attachments/466328575231000576/806263770765590528/heads.png")


            return message.channel.send(headsembed);

            
        } else {
            
            let tailsembed = new Discord.MessageEmbed()

            .setColor(userColor)
            .setDescription("**" + message.author.username + "**'s coin landed on tails <:VVcake:710240779733434458>")
            .setThumbnail("https://cdn.discordapp.com/attachments/466328575231000576/806263783315996752/tails.png")


            return message.channel.send(tailsembed);
            
        }
    }





    //*roll

    if(cmd ===`${prefix}roll`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        if(arrayspot1) {

            if((isNaN(arrayspot1)) || (!isInteger(arrayspot1) || arrayspot1 == 0)) {

                message.channel.send("you have to roll a whole number bigger than 0 dummy")
            } else {

            let chance = Math.floor(Math.random() * arrayspot1);

           
            if(randomTipChance <= 1) {

                let embed1 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** rolled a " + chance + " :flushed:")
                .setFooter(selectedTip)
            return message.channel.send(embed1);


            } else{

let embed1 = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "** rolled a " + chance + " :flushed:")
                return message.channel.send(embed1);



            }

                


            }
 



        } else {




        


        

            let chance = Math.floor(Math.random() * 6);
            if (chance == 0) {



                if (randomTipChance <=1) {


                    let embed1 = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "** rolled a 1!")
                    .setFooter(selectedTip)
                    return message.channel.send(embed1);


                } else {

 let embed1 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** rolled a 1!")
                return message.channel.send(embed1);


                }

               
            } else if (chance == 1) {


                if(randomTipChance <= 1) {


                    let embed2 = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "** rolled a 2!")
                    .setFooter(selectedTip)
                    return message.channel.send(embed2);

                } else {

  let embed2 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** rolled a 2!")
                return message.channel.send(embed2);

                }




              
            } else if (chance == 2) {





                if(randomTipChance <= 1) {


                    let embed3 = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "** rolled a 3!")
                    .setFooter(selectedTip)
                    return message.channel.send(embed3);

                } else {

  let embed3 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** rolled a 3!")
                return message.channel.send(embed3);

                }



            } else if (chance == 3) {





                if(randomTipChance <= 1) {


                    let embed4 = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "** rolled a 4!")
                    .setFooter(selectedTip)
                    return message.channel.send(embed4);

                } else {

  let embed4 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** rolled a 4!")
                return message.channel.send(embed4);

                }



            } else if (chance == 4) {




                if(randomTipChance <= 1) {


                    let embed5 = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "** rolled a 5!")
                    .setFooter(selectedTip)
                    return message.channel.send(embed5);

                } else {

  let embed5 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** rolled a 5!")
                return message.channel.send(embed5);

                }



            } else if (chance == 5) {




                if(randomTipChance <= 1) {


                    let embed6 = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "** rolled a 6!")
                    .setFooter(selectedTip)
                    return message.channel.send(embed6);

                } else {

  let embed6 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** rolled a 6!")
                return message.channel.send(embed6);

                }
            } 





        }

    }


    //*f command (like respects type shit)
    if(cmd === `${prefix}f`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;



        let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if (msg === `${prefix}f`) {


            if (randomTipChance <=1 ) {

let respectembed = new Discord.MessageEmbed()
        .setColor(userColor)
        .setDescription("**" + message.author.username + "** has paid their respects :thumbsup:")
        .setFooter(selectedTip)
                    //add counter later but not yet
                    return message.channel.send(respectembed);

            } else {

                let respectembed = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** has paid their respects :thumbsup:")
                            //add counter later but not yet
                            return message.channel.send(respectembed);


            }




        


        } else {


            if (randomTipChance <=1 ) {

let respectembed2 = new Discord.MessageEmbed()
        .setColor(userColor)
        .setDescription("**" + message.author.username + "** has paid their respects for **" + msg + "** :thumbsup:")
        .setFooter(selectedTip)

                    //add counter later but not yet

        return message.channel.send(respectembed2);


            } else {

                let respectembed2 = new Discord.MessageEmbed()
                .setColor(userColor)
                .setDescription("**" + message.author.username + "** has paid their respects for **" + msg + "** :thumbsup:")
                            //add counter later but not yet
        
                return message.channel.send(respectembed2);


            }
            
        }
    }













    if(cmd === `${prefix}ping`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;



        let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if(msg === `${prefix}ping`) {


            message.channel.send("my current ping is " + `**${Date.now()-message.createdTimestamp}** ms`);






            

        } else {
            message.channel.send("bro what are you trying to do, just type `*ping`");

        }
        
    }






    //*say (later *confess), i hope i can make this work
    //IT WORKS !!!!!!! god is good
    if(cmd === `${prefix}say`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;




        let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if(msg === `${prefix}say`) {
            message.delete();


            let stopembed = new Discord.MessageEmbed()

            .setTitle("slow down there, buckaroo")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*say <message>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);

        } else if (msg.length >= 100) {
            message.delete();

            let stop2embed = new Discord.MessageEmbed()

            .setTitle("woah that's a lot of letters")
            .setColor("#FF0000")
            .addField("**character limit reached**", "your message has to be less than 100 characters for it to send")

            return message.channel.send(stop2embed);

        
        } else if (msg.includes("@everyone") || msg.includes("@here")){
            message.channel.send("**" + message.author.username + "**, i smell a ping go away <:VVhyperRAGE:713514131541590118>");
            



        } else {
            message.delete();

            

                            message.channel.send(msg);

            


        }
        
    }




//8ball command YAY
    if(cmd === `${prefix}8ball`) {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;



        let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if(msg === `${prefix}8ball`) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("you did it wrong stoopid")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*8ball <question>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);

        } else if (msg.length >= 100) {
            let stop2embed = new Discord.MessageEmbed()

            .setTitle("sorry, your question is too long :(")
            .setColor("#FF0000")
            .addField("**character limit reached**", "your question has to be less than 100 characters")

            return message.channel.send(stop2embed);


        

        } else {
            var chance = Math.floor(Math.random() * 8);

            if (chance == 0) {

                if (randomTipChance <= 1) {

                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/793905130398679050/image0.png");//ask again later i dont have time
    
                    return message.channel.send(embed);


                } else {

                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/793905130398679050/image0.png");//ask again later i dont have time
    
                    return message.channel.send(embed);




                }
                

            } else if (chance == 1) {

                if (randomTipChance <= 1) {

                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322479346024508/image1.png");//probably not          GOOD
    
                    return message.channel.send(embed);
    

                } else {
let embed = new Discord.MessageEmbed()

                .setTitle("// 8BALL :8ball:")
                .setColor(userColor)

                .setDescription("**" + message.author.username + "** asked " + msg)
                .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322479346024508/image1.png");//probably not          GOOD

                return message.channel.send(embed);


                }
                

            } else if (chance == 2) {

                if (randomTipChance <= 1) {

                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322480138879036/image2.png");//probably             GOOD
    
                    return message.channel.send(embed);


                } else {

let embed = new Discord.MessageEmbed()

                .setTitle("// 8BALL :8ball:")
                .setColor(userColor)

                .setDescription("**" + message.author.username + "** asked " + msg)
                .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322480138879036/image2.png");//probably             GOOD

                return message.channel.send(embed);

                }
                

            } else if (chance == 3) {

                if (randomTipChance <= 1) {


                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322480625418340/image3.png");//possibly              GOOD
    
                    return message.channel.send(embed);


                } else {

                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322480625418340/image3.png");//possibly              GOOD
    
                    return message.channel.send(embed);


                }
              


            }  else if (chance == 4) {


                if (randomTipChance <= 1) {



                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322481015619717/image4.png");//my senses tell me no            GOOD
    
                    return message.channel.send(embed);
                } else {


                    let embed = new Discord.MessageEmbed()

                .setTitle("// 8BALL :8ball:")
                .setColor(userColor)

                .setDescription("**" + message.author.username + "** asked " + msg)
                .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322481015619717/image4.png");//my senses tell me no            GOOD

                return message.channel.send(embed);
                }

                
            }   else if (chance == 5) {


                if (randomTipChance <= 1) {

                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/785343495078543370/dumb.png");//thats a dumb thing to ask       GOOD
    
                    return message.channel.send(embed);

                     
                } else {


                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/785343495078543370/dumb.png");//thats a dumb thing to ask       GOOD
    
                    return message.channel.send(embed);


                }
            

            }    else if (chance == 6) {

                if (randomTipChance <= 1) {




                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/793905130927685662/image1.png");//of course
    
                    return message.channel.send(embed);

                } else {
                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/793905130927685662/image1.png");//of course
    
                    return message.channel.send(embed);



                }
                
            }     else if (chance == 7) {



                if (randomTipChance <= 1) {

                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setFooter(selectedTip)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322482663981096/image7.png");//absolutely not.               GOOD
    
                    return message.channel.send(embed);


                } else {
                    let embed = new Discord.MessageEmbed()

                    .setTitle("// 8BALL :8ball:")
                    .setColor(userColor)
    
                    .setDescription("**" + message.author.username + "** asked " + msg)
                    .setImage("https://cdn.discordapp.com/attachments/466328575231000576/724322482663981096/image7.png");//absolutely not.               GOOD
    
                    return message.channel.send(embed);

                }
                
            } 




        }
        
    }

 

//APPROVE COMMAND
    if(cmd === `${prefix}approve`) {


        let item = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

        if(item === `${prefix}approve`) {

            let stopembed = new Discord.MessageEmbed()

            .setTitle("what am i rating...")
            .setColor("#FF0000")
            .addField("**missing argument**", "try using `*approve <message>`")
            .setFooter("requested by " + message.author.tag);

            return message.channel.send(stopembed);


        } else if (item.length >= 100) {

            let stop2embed = new Discord.MessageEmbed()

            .setTitle("your message is too long dummy")
            .setColor("#FF0000")
            .addField("**character limit reached**", "your message has to be less than 100 characters for it to be rated")

            return message.channel.send(stop2embed);
        
        } else {

            let rating = Math.floor(Math.random() * 11);
            if (rating == 0) {

                let badrateembed = new Discord.MessageEmbed()
                .setTitle("// JUDGING IN PROGRESS...")
                .setColor(userColor)
                .setDescription("wtf is **" + item + "** LMFAOOO i give it an absolute 0.")
                .setFooter("lol sorry " + message.author.tag)

                message.channel.send(badrateembed);

            } else if (rating >= 1 && rating <= 4) {

                let mehrateembed = new Discord.MessageEmbed()
                .setTitle("// JUDGING IN PROGRESS...")

                .setColor(userColor)
                .setDescription("**" + item + "**? disgraceful. this is worth a " + rating + ".")
                .setFooter("lol sorry "+message.author.tag)

                message.channel.send(mehrateembed);

            } else if (rating >= 5 && rating <= 9) {

                let okrateembed = new Discord.MessageEmbed()
                .setTitle("// JUDGING IN PROGRESS...")

                .setColor(userColor)
                .setDescription("i mean **" + item + "** is pretty cool so i rate this a " + rating + ".")
                .setFooter("not bad " + message.author.tag)

                message.channel.send(okrateembed);


            } else if (rating == 10) {

                let perfectrateembed = new Discord.MessageEmbed()
                .setTitle("// JUDGING IN PROGRESS...")

                .setColor(userColor)
                .setDescription("i am VERY pleased with **" + item + "**, i rate this a 10.")
                .setFooter("a blessed offering " + message.author.tag)

                message.channel.send(perfectrateembed);

            }

        }
        
    }
























/*

    //*announce command 
    if(cmd === `${prefix}announce`) {
        if(message.channel.type === "dm") return;
    if(message.author.bot) return;

        let announcement = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);


        if (message.member.hasPermission("MANAGE_MESSAGES")){


            if(announcement === `${prefix}announce`){
                let stopembed = new Discord.MessageEmbed()

                .setTitle("that's not how it works")
                .setColor("#FF0000")
                .addField("**missing argument**", "try using `*announce <message>`")
                .setFooter("requested by " + message.author.tag);



                return message.channel.send(stopembed);

            } else if (announcement.length >= 300) {

                let stop2embed = new Discord.MessageEmbed()

                .setTitle("sorry, your announcement is too long :(")
                .setColor("#FF0000")
                .addField("**character limit reached**", "your message has to be less than 300 characters for it to send")
    
                return message.channel.send(stop2embed);

            


            } else if (announcement !== `${prefix}announce`) {


                const channel = bot.channels.cache.get('710009723306639421');

                channel.send(announcement);

                let okayembed = new Discord.MessageEmbed()


                .setTitle("**" + message.author.username + "**, your announcement was sent!")
                .setColor("#fa1e36")
                .setDescription("find it in VV's <#710009723306639421> :thumbsup:")


                return message.channel.send(okayembed);

            }



        } else if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        let sorrynoembed = new Discord.MessageEmbed()

        .setDescription("sorry, **" + message.author.username + "**, but you can't use this")
        .setColor("ff0000")
            return message.channel.send(sorrynoembed);

      } 


    }


*/

    




//NICKNAME SYSTEM
 
if(cmd === `${prefix}nick`) {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    

    





    let previousnick = message.member.nickname;
    let msg = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

    if(msg === `${prefix}nick`) {

        message.channel.send("**" + message.author.username + "**, what are you changing your nickname to idiot :neutral_face:")

    } else if (msg.length >= 31) {

        message.channel.send("hey try something that'll actually fucking work thanks :smiley:")
    
    } else {
       //change nickname stuff goes here
       if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send("i don't have permission to do this sigh :pensive:");
        message.member.setNickname(message.content.replace(`${prefix}nick`, ''));
                //IF NO NICKNAME BEFORE
                if (!previousnick) {
                    let nickembed1 = new Discord.MessageEmbed()
                    .setTitle("nickname changed!")
                    .addField("previous nickname:", "• `" + "no nickname set" + "`")
                    .addField("new nickname:", "•**" + message.content.replace(`${prefix}nick`, '') + "**")
        .setColor(userColor)
        .setFooter(message.author.tag);

        message.channel.send(nickembed1);




                } else {

let nickembed2 = new Discord.MessageEmbed() 
        .setTitle("nickname changed!")
        
        .addField("previous nickname:", "• **" + previousnick  + "**")
        
        
        .addField("new nickname:", "•**" + message.content.replace(`${prefix}nick`, '') + "**")
        .setColor(userColor)
        .setFooter(message.author.tag);

        message.channel.send(nickembed2);

                }

                    

                



    

    }
    
}

}





const unratedNum = message.guild.roles.cache.find(role => role.name === "lfg // unrated");
const compNum = message.guild.roles.cache.find(role => role.name === "lfg // competitive");
const customNum = message.guild.roles.cache.find(role => role.name === "lfg // scrims + custom");
const otherNum = message.guild.roles.cache.find(role => role.name === "lfg // other");












const cooldownforSTARTlfgping = startLFGPINGcooldown.get(message.author.id); 


const cooldownforlfgping = lfgpingCooldown.get(message.author.id); 


if (cooldownforSTARTlfgping) return;


    if (cmd === `${prefix}lfgping`) { //start
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        if (cooldownforlfgping) {

            const timeremaining = Duration(cooldownforlfgping - Date.now(), {units : ['m', 's'], round: true})
        
        
            return message.channel.send("**" + message.author.username + "**, you just pinged everyone shut up (you can ping again in `" + timeremaining + "`)").then(message => {
                message.delete({timeout:5000})
            }).catch(console.error);
        
        
        
        } else {
            
    
       startLFGPINGcooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.16666666666);
                    setTimeout(() => {startLFGPINGcooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.00277778);
    
        
    
            if (!message.member.roles.cache.some(role => role.name === 'VALORANT')) {


                let noembed = new Discord.MessageEmbed()
                .setDescription("you have to have the <@&736376787461734443> role to use this command dummy (get it in <#749674536575696956>")
                .setColor(userColor)
                .setFooter("requested by " + message.author.tag)

                message.channel.send(noembed);
                



            } else

    
            if(message.channel.id !== "814310050653929473") {   
                
                
                let noembed = new Discord.MessageEmbed()
                .setDescription("you have to use this command in the <#814310050653929473> channel dum dum")
                .setColor(userColor)
                .setFooter("requested by " + message.author.tag)

                message.channel.send(noembed);

            } else {

                let filter = n => n.author.id === message.author.id;
    
                let lfgembed = new Discord.MessageEmbed()
            //<:VVdot:809087399094124624>
                .setTitle("// VALORANT LFG ROLE PING")
                .addField("type ONE corresponding number to ping that role", "\n<:VVdot:809087399094124624>`1`  //  <@&816064013552582707> (`" + unratedNum.members.size + "` members)\n<:VVdot:809087399094124624>`2`  //  <@&816064196608786474> (`" + compNum.members.size + "` members)\n<:VVdot:809087399094124624>`3`  //  <@&816064466964971560> (`" + customNum.members.size + "` members)\n<:VVdot:809087399094124624>`4`  //  <@&816064637815619587> (`" + otherNum.members.size + "` members)")
                .setFooter("requested by " + message.author.tag + " • respond in 10 seconds")
                .setColor(userColor);
            
            
            
                message.channel.send(lfgembed)
                .then(() => {
            
            
                    //filter
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    })
                    .then(message => {
                        message = message.first()
            
                        let numb = message.content;
            
                        //begin checks here 
            
                        
                        if ((isNaN(numb)) || (!isInteger(numb))){
            
                            message.channel.send("**" + message.author.username + "** lol what")
            
                        
                        
                        
                        } else if (numb <=0) {
                                message.channel.send("type a number between `1` and `4` next time it would make my job a lot easier...")
            
                               
                            
                    
                            
                            
                        } else if (numb >= 5) {
                             message.channel.send("type a number between `1` and `4` next time it would make my job a lot easier...");
                                
            
            
                            
                        } else if (numb == 1) {
                            
                    message.channel.send("<:VVdot:809087399094124624> <@&816064013552582707> **" + message.author.tag + "** wants to play valorant <:VVnotlikethis:823917572763680778>");

                
        
                        } else if (numb == 2) {
                            message.channel.send("<:VVdot:809087399094124624> <@&816064196608786474> **" + message.author.tag + "** wants to play valorant <:VVnotlikethis:823917572763680778>");
                           
        
                        } else if (numb == 3) {
                            message.channel.send("<:VVdot:809087399094124624> <@&816064466964971560> **" + message.author.tag + "** wants to play valorant <:VVnotlikethis:823917572763680778>");
                            
        
                        } else if (numb == 4) {
                            message.channel.send("<:VVdot:809087399094124624> <@&816064637815619587> **" + message.author.tag + "** wants to play valorant <:VVnotlikethis:823917572763680778>");
                            
        
                        }
                        lfgpingCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.0833333);
                            setTimeout(() => { lfgpingCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.0833333);
            
                        
                    })
                    .catch(collected => {
                        message.channel.send(`nvm try again later you take too long`)
                    })
                
                })
            
            


            }
    
       
    
        }
        
    


    }













































/*


const cooldownforlfg = lfgCooldown.get(message.author.id); 

if (cooldownforlfg) {

return;


} else {
    if (cmd === `${prefix}lfg`) { //start
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;
    
        lfgCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.16666666666);
                    setTimeout(() => { lfgCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.00277778);
    
        if (db.has(message.author.id + '.lfg')) {
            message.channel.send(`**${message.author.tag}**, you're already on the lfg list (to take yourself off type \`${prefix}lfgremove\`)`).then(message => {
                message.delete({timeout:5000})
            }).catch(console.error);
    
        } else {
    
    
    
    
    
    
        let filter = n => n.author.id === message.author.id;
    
        let lfgembed = new Discord.MessageEmbed()
    
        .setTitle("// VALORANT LFG SETUP")
        .addField("type ONE corresponding number to be placed on the lfg list", "\n<:VVdot:809087399094124624> `1`  //  unrated\n<:VVdot:809087399094124624> `2`  //  competitive\n<:VVdot:809087399094124624> `3`  //  scrims + customs\n<:VVdot:809087399094124624> `4`  //  other (deathmatch, spike rush, etc.)")
        .setFooter("requested by " + message.author.tag + " • respond in 10 seconds")
        .setColor(userColor);
    
    
    
        message.channel.send(lfgembed)
        .then(() => {
    
    
            //filter
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
            })
            .then(message => {
                message = message.first()
    
                let numb = message.content;
    
                //begin checks here 
    
                
                if ((isNaN(numb)) || (!isInteger(numb))){
    
                    message.channel.send("**" + message.author.username + "** lol what")
    
                
                
                
                } else if (numb <=0) {
                        message.channel.send("type a number between `1` and `4` next time it would make my job a lot easier...")
    
                       
                    
            
                    
                    
                } else if (numb >= 5) {
                     message.channel.send("type a number between `1` and `4` next time it would make my job a lot easier...");
                        
    
    
                    
                } else if (numb == 1) {
                    let unratedembed = new Discord.MessageEmbed()
            .setColor(userColor)
            .setDescription("**" + message.author.username + "**, you've been put on the lfg list for `unrated` :smiley: (`*lfglist` to see it!)")
            .setFooter("⚠️ to keep bot storage fresh, lfg statuses are removed randomly every 24 hours");
            message.channel.send(unratedembed);

            const currentDate = new Date();
let timestamp = currentDate.toLocaleString('en-US', {timeZone : 'America/New_York'});

let finishedTime = timestamp.split(', ')[1];

    
                    db.set(message.author.id + '.lfg', 'true');
                    db.set(message.author.id + '.game', 'unrated');
                    db.set(message.author.id + '.time', finishedTime);

                } else if (numb == 2) {
                    let compembed = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "**, you've been put on the lfg list for `competitive` :smiley: (`*lfglist` to see it!)")
                    .setFooter("⚠️ to keep bot storage fresh, lfg statuses are removed randomly every 24 hours");
                    message.channel.send(compembed);

                    const currentDate = new Date();
                    let timestamp = currentDate.toLocaleString('en-US', {timeZone : 'America/New_York'});
                    let finishedTime = timestamp.split(', ')[1];

                    db.set(message.author.id + '.lfg', 'true');
                    db.set(message.author.id + '.game', 'competitive');
                    db.set(message.author.id + '.time', finishedTime);

                } else if (numb == 3) {
                    let scrimsembed = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "**, you've been put on the lfg list for `scrims + custom` :smiley: (`*lfglist` to see it!)")
                    .setFooter("⚠️ to keep bot storage fresh, lfg statuses are removed randomly every 24 hours");
                    message.channel.send(scrimsembed);

                    const currentDate = new Date();
                    let timestamp = currentDate.toLocaleString('en-US', {timeZone : 'America/New_York'});
                    let finishedTime = timestamp.split(', ')[1];
    
                    db.set(message.author.id + '.lfg', 'true');
                    db.set(message.author.id + '.game', 'custom');
                    db.set(message.author.id + '.time', finishedTime);

                } else if (numb == 4) {
                    let otherembed = new Discord.MessageEmbed()
                    .setColor(userColor)
                    .setDescription("**" + message.author.username + "**, you've been put on the lfg list for `other` :smiley: (`*lfglist` to see it!)")
                    .setFooter("⚠️ to keep bot storage fresh, lfg statuses are removed randomly every 24 hours");
                    message.channel.send(otherembed);

                    const currentDate = new Date();
                    let timestamp = currentDate.toLocaleString('en-US', {timeZone : 'America/New_York'});
                    let finishedTime = timestamp.split(', ')[1];
    
                    db.set(message.author.id + '.lfg', 'true');
                    db.set(message.author.id + '.game', 'other');
                    db.set(message.author.id + '.time', finishedTime);

                }
    
                 
            })
            .catch(collected => {
                message.channel.send(`time's up you take forever omg`)
            })
        
        })
    
    
     
        }
        
    }




}
*/
const cooldownforspawn = spawnCooldown.get(message.author.id); 


if (cooldownforspawn) {

    return;

} else {

    if(cmd === `${prefix}spawn`) {  
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;

    spawnCooldown.set(message.author.id, Date.now() + 1000 * 60 * 60 * 0.16666666666);
    setTimeout(() => { spawnCooldown.delete(message.author.id)}, 1000 * 60 * 60 * 0.00277778);

    let loganID = "424325226332028929";

    let kaylaID = "382253023709364224";


    if(!db.get(`user.${message.author.id}`)) {
        message.channel.send("you didn't create an economy account yet :frowning: (you can make one by typing `" + `${prefix}start` + "`)")



    } else {

        if ((message.author.id!==loganID) && (message.author.id !== kaylaID)) {

            message.channel.send(":( sorry, only the best couple in the WORLD (kayla and logan) can use this command")


        } else {
            let authorInv = db.get(`user.${message.author.id}.inv`)

            let filter = n => n.author.id === message.author.id;
            message.channel.send("how many coins do you want to spawn, **" + message.author.username + "**?")
            .then(() => {


                //filter
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                })
                .then(message => {
                    message = message.first()

                    let numb = message.content;

                    //begin checks here
                    if ((isNaN(numb)) || (!isInteger(numb))){

                        message.channel.send("we all mess up sometimes, it's okay :smiling_face_with_3_hearts: just type a whole number next time")

                    
                    
                    
                    } else if (numb <0) {
                            message.channel.send("you can't spawn negative coins :scream_cat:")

                           
                        
                    } else if (numb == 0) {
                        message.channel.send("why are you trying to spawn nothing :neutral_face:")

                        
                        
                        
                        
                        
                    } else if (numb >= 100000000) {
                         message.channel.send("surely you don't need that much :cowboy: keep it under `100,000,000` please");
                            


                        
                    } else {
                        message.channel.send("**" + message.author.username + "**, `" + numb + "` coins have been deposited in your balance :thumbsup:");
                        db.add(`user.${message.author.id}.balance`, numb)



                    }

                    
                })
                .catch(collected => {
                    message.channel.send(`DAMN you take too long`)
                })

            })









        }




    }














}

}

});




bot.login(botconfig.token); 
