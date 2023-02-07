const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require('node-telegram-bot-api');

//Initialize environment variables
require('dotenv').config();

//Initializing OpenAI Api
const configuration = new Configuration({

    apiKey: process.env.API_KEY_GPT,

});
const gpt = new OpenAIApi(configuration);

//Initializing the TelegramBot Api
const bot = new TelegramBot(process.env.API_KEY_BOT, {polling: true});


bot.on('message', async msg => {

    if(msg.text === '/start') {

        await bot.sendMessage(msg.chat.id, `Hello, ${msg.from.first_name}!\n\nThis bot is designed to generate query responses using the Da Vinci 3 model.\n\nJust send your request as a message and wait for a response!`);
        await bot.sendSticker(msg.chat.id, process.env.WELCOME_STICKER_HREF)

    }
    else {

        let waitMessage;

        await bot.sendMessage(msg.chat.id, '👀 Please wait...').then(result => {

            waitMessage = result;

        });

        const completion = await gpt.createCompletion({

            model: "text-davinci-003",
            prompt: msg.text,
            max_tokens: 4000,

        });

        await bot.sendMessage(msg.chat.id, completion.data.choices[0].text);
        await bot.deleteMessage(waitMessage.chat.id, waitMessage.message_id);

    }

})

bot.on("polling_error", (err) => console.log(err));