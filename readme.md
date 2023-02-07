# GPT-bot for Telegram

Chat bot that uses OpenAI Api to generate responses to user requests.

## Install

The installation requires NodeJS and its package manager.

Use this to download all the libraries you need:

```javascript.
npm install
```

The following libraries are used:

* *node-telegram-bot-api - Used to work with the Telegram API.*

* *openai - Used to work with the OpenAI API.*

* *dotenv - Used to set environment variables (api keys for telegram bots and connections to openai api).*

* *nodemon - Used for easy development.*

### Environment variables

Key|Value
:-----------:|:--------------------------------------------: 
API_KEY_BOT|The key to connect to the Telegram API and work with the bot. (can be obtained by contacting @BotFather on Telegram)
API_KEY_GPT|The key to connect to the OpenAI API and work with the generation of responses to the request. (you can get it in your personal account on the OpenAI website)
WELCOME_STICKER_HREF|A link to the sticker that is sent to the user after the bot starts