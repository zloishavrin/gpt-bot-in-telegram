const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs/promises');
const { writeFileSync } = require("fs");

//Initialize environment variables
require('dotenv').config();

//Initializing OpenAI Api
const configuration = new Configuration({

    apiKey: process.env.API_KEY_GPT,

});
const gpt = new OpenAIApi(configuration);

//Initializing the TelegramBot Api
const bot = new TelegramBot(process.env.API_KEY_BOT, {polling: true});

let quantity = 0;

bot.on('message', async msg => {

    quantity = quantity + 1;
    console.log(`Запрос ${quantity}: ${msg.text}`);

    if(msg.text === '/start') {

        await bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`);
        await bot.sendMessage(msg.chat.id, `Этот бот использует текстовую модель GPT-Turbo 3.5 и Dall-E для генерации ответов на ваш запрос.`);
        await bot.sendMessage(msg.chat.id, `Бот может генерировать текст, код и изображения. Для того чтобы задать вопрос просто напишите боту.`);
        await bot.sendMessage(msg.chat.id, `Для генерации картинки по вашему запросу составьте запрос в следующем виде:`);
        await bot.sendMessage(msg.chat.id, `/img [Ваш Запрос]`);
        await bot.sendMessage(msg.chat.id, `Также попробуйте наш VPN сервис - https://play.google.com/store/apps/details?id=com.shaligulacartel.vpn_shaligula&hl=ru&gl=US`);
        await bot.sendSticker(msg.chat.id, process.env.WELCOME_STICKER_HREF)

        console.log(`Запрос ${quantity} завершен!`);

    }
    else if(msg.text.startsWith('/img')) {

        let waitMessage;

        await bot.sendMessage(msg.chat.id, '👀 Please wait...').then(result => {

            waitMessage = result;

        });

        promptText = msg.text.slice(5);

        try{

            const completion = await gpt.createImage({

                prompt: promptText,
                n: 1,
                size: "1024x1024",

            })

            await bot.sendPhoto(msg.chat.id, completion.data.data[0].url);
            await bot.deleteMessage(waitMessage.chat.id, waitMessage.message_id);

            console.log(`Запрос ${quantity}: Завершен!`);

        }
        catch(error) {

            await bot.sendMessage(msg.chat.id, 'Попробуйте другой запрос 😊');
            await bot.deleteMessage(waitMessage.chat.id, waitMessage.message_id);

            console.log(`Запрос ${quantity}: Не завершен!`);

        }

    }
    else {

        let waitMessage;

        await bot.sendMessage(msg.chat.id, '👀 Please wait...').then(result => {

            waitMessage = result;

        });

        try {

            const completion = await gpt.createChatCompletion({

                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: msg.text}],

            });

            await bot.sendMessage(msg.chat.id, completion.data.choices[0].message.content);
            await bot.deleteMessage(waitMessage.chat.id, waitMessage.message_id);

            console.log(`Запрос ${quantity}: Завершен!`);

        }
        catch(error) {

            await bot.sendMessage(msg.chat.id, 'Попробуйте другой запрос 😊');
            await bot.deleteMessage(waitMessage.chat.id, waitMessage.message_id);

            console.log(`Запрос ${quantity}: Не завершен!`);

        }

    }

})

bot.on("polling_error", (err) => console.log(err.data.error.message));