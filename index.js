const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const configuration = new Configuration({

    apiKey: process.env.API_KEY_GPT,

});
const gpt = new OpenAIApi(configuration);

const bot = new TelegramBot(process.env.API_KEY_BOT, {polling: true});


bot.on('message', (msg, match) => {

    let waitMessage;

    bot.sendMessage(msg.chat.id, '👀 Ожидайте...').then(result => {

        waitMessage = result;

    });

    async function send() {

        const completion = await gpt.createCompletion({
            model: "text-davinci-003",
            prompt: msg.text,
            max_tokens: 4000,
        });

        bot.sendMessage(msg.chat.id, completion.data.choices[0].text);
        bot.deleteMessage(waitMessage.chat.id, waitMessage.message_id);

    }

    send();

})

bot.on("polling_error", (err) => console.log(err));