const venom = require('venom-bot');
const crypto = require('CryptoConsult')
const objCrypto = new crypto.cryptoConsult() /* Abre o Browser e carrega a pagina */

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    client.onMessage(async (message) => {
        if (message.body[0] == '!' && message.isGroupMsg === false) {
            try {
                let command = getCommand(message.body)
                command = isCommandValid(command)
                command(message.body, client, message)
            }
            catch (error) {
                console.log(error)
            }
        }
    });
}

function getMoeda(str) {
    return str.split(' ')[1]
}
function getCommand(str) {
    return str.split(' ')[0]
}
function isCommandValid(command) {
    command = command.toLowerCase()
    const keyCommandArray = Object.entries(commandList)
    for (let i = 0; i < keyCommandArray.length; i++) {
        if (command.indexOf(keyCommandArray[i][0].toLowerCase()) > -1) {
            return keyCommandArray[i][1]
        }
    }
    throw 'Comando nao cadastrado'
}
const commandList = {
    cryptoConsult: async (msg, client, message) => {
        objCrypto.moeda = getMoeda(msg)
        await objCrypto.consultCrypto((data, err) => {
            if (err) throw err
            else {
                client
                    .sendText(message.from,
                        'Moeda: ' + data.val_nome + '\n' +
                        'Código: ' + data.val_cod + '\n' +
                        'Preço (USD): ' + data.val_precoUSD + '\n' +
                        'Capitalização: ' + data.val_capitalizacao + '\n' +
                        'Vol. (24h): ' + data.val_vol24h + '\n' +
                        'Vol. Total: ' + data.val_volTotal + '\n' +
                        'Var. (24h): ' + data.val_var24h + '\n' +
                        'Var. (7d): ' + data.val_var7d)
                    .then((result) => {
                        console.log('Result: ', result);
                    })
                    .catch((erro) => {
                        console.error('Error when sending: ', erro);
                    });
            }
        })
    }
}


/* CRIAR TEXTO PARA MANDAR AO CONSULTAR MOEDA -----> cryptoConsult */