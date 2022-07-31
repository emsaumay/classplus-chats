
var WebSocketClient = require('websocket').client;
const { Webhook } = require('discord-webhook-node');

var token = "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpZCI6NDg2NjI2MTEsIm9yZ0lkIjo0MzkyLCJvcmdDb2RlIjpudWxsLCJvcmdOYW1lIjpudWxsLCJuYW1lIjoiU2F1bWF5IEx1bmF3YXQiLCJlbWFpbCI6Im1haWxAc2F1bWF5LmRldiIsIm1vYmlsZSI6IjkxNjI2NDc0MjMzNCIsInR5cGUiOjEsImlzRGl5IjpmYWxzZSwiaWF0IjoxNjU5MjU1ODM3LCJleHAiOjE2NTk4NjA2Mzd9.S33_5_Nxmdlw1B2JQkOYiDzzP_n4HMFiGcYycNZkapnOrkTHxdUmOs8sRbwnJVsh";
var url = `wss://chatsocket.classplusapp.com/socket.io/?token=${token}&EIO=3&transport=websocket`

hooks = {
    "62aadf03326a930012ecd86b": "https://discord.com/api/webhooks/1000436257802948699/kkRTPBxI_ntHzoNVMnkWsjB8oj0fNYCF0BnjyYGGayQOi62W5_Z2362JUy-fpR-KXqdv",
    "62cbe23398a1ba001241c820": "https://discord.com/api/webhooks/1000447754344091708/-jv2XY2C_648p7RSJdghww89kDB5gbBTBHJUGzzfSragbsbtaPNI7atrdTXkX2-Hwege",
    "621488162ee7500012f543e5": "https://discord.com/api/webhooks/1000473926574538773/GSFxylpGzAWSgqASaQJTv5M85xM84_HVPCr23-pTOdJtzNrehmo7gj3Uym6JN6gwubeM",
}
// cso, cn, test-series-2023,

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            if (message.utf8Data.startsWith('42["message"')) {
                var data = JSON.parse(message.utf8Data.slice(13, -1));
                console.log(data['messageDetails']);
                if (data['messageDetails']['_conversationId'] in hooks) {
                    sendMessage(data['messageDetails']);
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