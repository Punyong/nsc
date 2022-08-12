const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"]});
const prefix = '.';
const { MessageEmbed } = require('discord.js');

const fs = require('fs')
var xpPath = `./storage.json`;
var xpRead = fs.readFileSync(xpPath);
var xpFile = JSON.parse(xpRead);
var log = "./log.txt";

const { inlineCode, codeBlock, hyperlink } = require('@discordjs/builders');
const jsString = 'const value = true;';
const inline = inlineCode(jsString);
const codeblock = codeBlock(jsString);

require('dotenv').config()

client.once('ready', () => {
    console.log('pog');
});

var d = new Date();
console.log(d.toLocaleTimeString());

client.on('messageCreate', message =>{
  
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'info'){
        message.channel.send(codeBlock("NSC manager by Axel et Damien\n\n.info  : montre ce message\n.rules : affiche le lien du règlement\n.lb    : affiche un classement des mots\n\nInfos salons :\n\nno-sense-chat   : salon principal\nnsc-info        : annonces en rapport au nsc\nnsc-lb          : classement du nsc mis à jour le dimanche\nréclamation-nsc : demandes de suppression de messages et autres requêtes\npolls           : votes pour décider des mots polémiques\nlogs            : fil d'activité du NSC et alertes doublons"));
        
    }
    
    if(command === 'rules'){
        const rules = new MessageEmbed()
        .setTitle('Règlement')
        .setURL('https://cdn.discordapp.com/attachments/694686820247535759/706869255295205439/Reglement_no_sense_chat.pdf')
        message.channel.send({ embeds: [rules]})    
    
    }

    if(command === 'lb'){
        const items = [
            {name: (xpFile['296007985736450059'].Name), value: Number(xpFile['296007985736450059'].xpp)},
            {name: (xpFile['295550531907354624'].Name), value: Number(xpFile['295550531907354624'].xpp)},
            {name: (xpFile['498872017383194624'].Name), value: Number(xpFile['498872017383194624'].xpp)},
            {name: (xpFile['694108010871783495'].Name), value: Number(xpFile['694108010871783495'].xpp)},
            {name: (xpFile['657126752476200981'].Name), value: Number(xpFile['657126752476200981'].xpp)},
            {name: (xpFile['400704659532152842'].Name), value: Number(xpFile['400704659532152842'].xpp)},
            {name: (xpFile['287976670084726785'].Name), value: Number(xpFile['287976670084726785'].xpp)},
            {name: (xpFile['528278073368379402'].Name), value: Number(xpFile['528278073368379402'].xpp)},
            ]
        
            items.sort(function(a, b){return a.value - b.value})
            message.channel.send(codeBlock('Classement :\n' + '#1 - ' + items[7]['name'] + ' : ' + items[7]['value'] + '\n#2 - ' + items[6]['name'] + ' : ' + items[6]['value'] + '\n#3 - ' + items[5]['name'] + ' : ' + items[5]['value'] + '\n#4 - ' + items[4]['name'] + ' : ' + items[4]['value'] + '\n#5 - ' + items[3]['name'] + ' : ' + items[3]['value'] + '\n#6 - ' + items[2]['name'] + ' : ' + items[2]['value'] + '\n#7 - ' + items[1]['name'] + ' : ' + items[1]['value'] + '\n#8 - ' + items[0]['name'] + ' : ' + items[0]['value'] + '\n'))
    
    }

    if(command === 'filesync'){
        if(message.author.id === '296007985736450059'){
        fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2));
        message.channel.send('synced files to updated values');
        console.log('files were forcefully synced!');
        } else {
        message.channel.send("OULA ! cette commande est DANGEREUSE et peut TOUT CASSER, va voir Axel pour qu'il regarde ça.")
        }
    
    }

    if(command === 'set'){
        if(message.author.id === '296007985736450059' || message.author.id === '295550531907354624'){
            if (!args.length) {
			return message.channel.send(`Syntaxe : userID valeur, ${message.author}!`);}

            if(args[0] === '296007985736450059' || args[0] === '295550531907354624' || args[0] === '498872017383194624' || args[0] === '694108010871783495' || args[0] === '657126752476200981' || args[0] === '400704659532152842' || args[0] === '287976670084726785' || args[0] === '528278073368379402'){
                xpFile[args[0]] = {xpp: Number(args[1]), Name: xpFile[args[0]].Name};}
                fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2));

        } else message.channel.send("tu essaies de faire quoi au juste ?")
    }
    
    if(message.channel.name === 'no-sense-chat' && !message.author.bot){
        var userId = message.author.id
        if (!xpFile[userId]) {
                xpFile[userId] = {xpp: 1, Name: ''};
                fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2));
            } else {
                var xppVar = Number(xpFile[userId].xpp) + 1
                xpFile[userId] = {xpp: xppVar, Name: xpFile[userId].Name};
                fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2));

        }
     }
   
    if(message.channel.name === 'no-sense-chat' && !message.author.bot){
        let mlog = message.content.toLocaleLowerCase()
        message.channel.send('Un utilisateur vient de soumettre un mot.\nUn autre mot pourra être soumis après la suppression de ce message (60s).')
        .then(msg => {
        setTimeout(() => msg.delete(), 60000)
    
        })
    
        fs.readFile(log, function (err, data) {
        if (err) throw err;
        if(data.includes(mlog)){
        client.channels.cache.get('988165549609594931').send(":warning: Doublon potentiel sur " + message.content + " " + "<@&" + 988463484025053184n + ">")
        }
    
        });
    
        var d = new Date();
        client.channels.cache.get('988165549609594931').send(":white_check_mark: " + message.content + ' envoyé par ' + message.author.username + ' le ' + d.toLocaleString());
        fs.writeFile(log, mlog + '\n', { flag: 'a+' }, function (err) {
        if (err) return console.log(err);
    
        });

    }

});

client.on("messageDelete", (message) => {
    if(message.channel.name === 'no-sense-chat' && !message.author.bot) {
    client.channels.cache.get('988165549609594931').send(":question: Soumission suivante supprimée : " + message.content)
    }
    });

client.login(process.env.TOKEN);