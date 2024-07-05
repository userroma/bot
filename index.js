const TelegramApi = require('node-telegram-bot-api')
const readline = require("node:readline");
const token = '7052389702:AAGSRCPIQswdd2RUOztunx-z3FRm77zScXY';
const {gameOptions, againOptions} = require('./options')
const bot = new TelegramApi(token, {polling: true})
const sequelize = require('./db')
const UserModel = require('./models')
const chats = {}

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадай число ${randomNumber}`, gameOptions)
}



bot.setMyCommands([
    {command : '/start', description : 'hi'},
    {command : '/info', description : 'info'},
    {command : '/game', description : 'game'},
])



const start = async () => {


    try{
        await sequelize.authenticate()
        await sequelize.sync()

    }catch(e){
        console.log('Нет подключения', e)
    }

    bot.on('message',  async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try{
            if( text === '/start'){
                await UserModel.create({chatId});
                return bot.sendSticker(chatId, 'https://user-images.githubusercontent.com/14011726/94132137-7d4fc100-fe7c-11ea-8512-69f90cb65e48.gif');
            }
            if( text === '/game' ){
                return startGame(chatId)
            }
            if ( text === '/info' ){
                const user = await UserModel.findOne({chatId})
                return await bot.sendMessage(chatId, `Правильных ${user.right} Неправильных ${user.wrong}`);
            }

        }catch(e){
            return bot.sendMessage(chatId, 'Произошла ошибка')
        }


        //return bot.sendMessage(chatId, 'Dont')

    })

    bot.on('callback_query',  async msg => {
        const data = msg.data;
        const chatId= msg.message.chat.id;
        const user = await UserModel.findOne({chatId})

        if ( data === '/again' ){
            return startGame(chatId)
        }

        if( data == chats[chatId] ){
            user.right += 1;
            await bot.sendMessage(chatId, 'Угадал' , againOptions);
        }else{
            user.wrong += 1;
            await bot.sendMessage(chatId, `Не угадал ${chats[chatId]}` , againOptions);
        }
        await user.save()
    })

}


start()
