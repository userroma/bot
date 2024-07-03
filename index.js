
const TelegramApi = require('node-telegram-bot-api')
const readline = require("node:readline");
const token = '1251626956:AAFfBxaHv8ixjOoJTj6fU2ueRXZNEcVSo4M'
const {gameOptions, againOptions} = require('./options')
const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадай число ${randomNumber}`, gameOptions)
}



bot.setMyCommands([
    {command : '/start', description : 'hi'},
    {command : '/game', description : 'game'},
])



const start = () => {
    bot.on('message',  async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if( text === '/start'){
            return  bot.sendSticker(chatId, 'https://user-images.githubusercontent.com/14011726/94132137-7d4fc100-fe7c-11ea-8512-69f90cb65e48.gif');
        }
        if( text === '/game' ){
            return startGame(chatId)
        }

        //return bot.sendMessage(chatId, 'Dont')

    })

    bot.on('callback_query',  async msg => {
        const data = msg.data;
        const chatId= msg.message.chat.id;

        if ( data === '/again' ){
            return startGame(chatId)
        }

        if( data == chats[chatId] ){
            return await bot.sendMessage(chatId, 'Угадал' , againOptions);
        }else{
            return await bot.sendMessage(chatId, `Не угадал ${chats[chatId]}` , againOptions);
        }

    })

}


start()