var WebSocketClient = require('websocket').client;
const { Webhook } = require('discord-webhook-node');
require("dotenv").config();
const axios = require('axios');

var token = process.env.TOKEN
var url = `wss://chatsocket.classplusapp.com/socket.io/?token=${token}&EIO=3&transport=websocket`

hooks = {
    "6030a0c119b61b3f24ba6ec1": "https://discord.com/api/webhooks/1076847111934586982/",
    "63e6302b47b6f4001265c238": "https://discord.com/api/webhooks/1076847111934586982/",

    "63f4769fc0249b0012b14397": "https://discord.com/api/webhooks/1077568891724767365/",
    "621488162ee7500012f543e5": "https://discord.com/api/webhooks/1085937491061772410/",

    "61128d5786481be493cbef3e": "https://discord.com/api/webhooks/1078357836414865583/",

    "623f188fab4e5f0013e01b5c": "https://discord.com/api/webhooks/1078996170019438642/",
    "641d6489df9dcc001264f8e1": "https://discord.com/api/webhooks/1078996170019438642/",

    "62cbe23398a1ba001241c820": "https://discord.com/api/webhooks/1078997172692975646/",

    "63217ca5ff2e7f001355c453": "https://discord.com/api/webhooks/1078997061644595260/",

    "62fe1be398439700131cd21d": "https://discord.com/api/webhooks/1078997687174709329/",

    "64117cae673d720012d224cc": "https://discord.com/api/webhooks/1085552680010788954/",
    "6231805c9286c70013eaee07": "https://discord.com/api/webhooks/1085552680010788954/",

    "609e22c8f02dd3da395038f4": "https://discord.com/api/webhooks/1093407567121760338/",
    "6422b09b9821e2001149b78e": "https://discord.com/api/webhooks/1093407567121760338/",
}
// dm, ts24;23, pyq, engg-maths, cn, cd, dbms, c-prog, dsa

ws = {
    "6030a0c119b61b3f24ba6ec1": "120363036591281492",
    "63e6302b47b6f4001265c238": "120363036591281492",

    "63f4769fc0249b0012b14397": "120363057727789283",
    "621488162ee7500012f543e5": "120363092429653575",

    "61128d5786481be493cbef3e": "120363054862809927",

    "623f188fab4e5f0013e01b5c": "120363060079132388",
    "641d6489df9dcc001264f8e1": "120363060079132388",

    "62cbe23398a1ba001241c820": "120363062104940744",

    "63217ca5ff2e7f001355c453": "120363043570109595",

    "62fe1be398439700131cd21d": "120363063210130340",

    "64117cae673d720012d224cc": "120363071744672018",
    "6231805c9286c70013eaee07": "120363071744672018",

    "609e22c8f02dd3da395038f4": "120363115843729894",
    "6422b09b9821e2001149b78e": "120363115843729894",
}
// dm, ts24;23, pyq, engg-maths, cn, cd, dbms, c-prog, dsa

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    // Sentry.captureMessage("Connection Established.")
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
        // Sentry.captureException(error)
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
        // Sentry.captureMessage("Connection Closed.")
    });
    connection.on('message', function(message) {

        if (message.type === 'utf8') {
            if (message.utf8Data.startsWith('42["message"')) {
                var data = JSON.parse(message.utf8Data.slice(13, -1));
                // console.log(data['messageDetails']);
                if (data['messageDetails']['_conversationId'] in hooks) {
                    sendMessage(data['messageDetails']);
                    sendWs(data['messageDetails']);
                }
            }
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            // var number = Math.round(Math.random() * 0xFFFFFF);
            var number = 2;
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 23000);
        }
    }
    sendNumber();
});

function sendWs(message) {
    if (message['messageAttachmentType'] === '') {
        var pp = JSON.stringify({
            "id": ws[message['_conversationId']],
            "text": `${message['userName']}:\n\n${message['messageText']}`,
            "media": 'False'
        })
        axios.post(process.env.IP, pp, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    } else {
        if(message['messageText'] === '') {
            var pp = JSON.stringify({
                "id": ws[message['_conversationId']],
                "media_text": `${message['userName']}:`,
                "media_url": message['messageAttachmentUrl'],
                "media": 'True'
            })
            axios.post(process.env.IP, pp, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
        } else {
            var pp = JSON.stringify({
                "id": ws[message['_conversationId']],
                "media_text": `${message['userName']}:\n\n${message['messageText']}`,
                "media_url": message['messageAttachmentUrl'],
                "media": 'True'
            })
            axios.post(process.env.IP, pp, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
        }
}}

function sendMessage(message) {
    var hook = new Webhook(hooks[message['_conversationId']]);
    hook.setUsername(message['userName']);
    hook.setAvatar(message['userImageUrl']);
    if (message['messageAttachmentType'] === '') {
        hook.send(message['messageText']);
    } else {
        if(message['messageText'] === '') {
            hook.send(message['messageAttachmentUrl']);
        } else {
            hook.send(message['messageAttachmentUrl']);
            hook.send(message['messageText']);
        }
    }
}

client.connect(url, 'echo-protocol');