# telegram video to audio bot

a telegram bot that converts video files to mp3 audio using the apyhub api. built with node.js, telegraf, and mongodb.

---

## features

- converts video to mp3 audio (mp4, mov, avi, mkv, webm, 3gp)
- inline bot support
- start image shown as spoiler
- mongodb logging of all conversions
- user registration and stats tracking
- clean error handling

---

## requirements

- node.js v18 or higher
- mongodb (local or atlas)
- telegram bot token (from @botfather)
- apyhub api key (from apyhub.com)

---

## setup

### 1. clone the repo

```
git clone https://github.com/your-username/telegram-video-to-audio-bot.git
cd telegram-video-to-audio-bot
```

### 2. install dependencies

```
npm install
```

### 3. configure environment variables

copy the example env file and fill in your values:

```
cp .env.example .env
```

edit `.env`:

```
BOT_TOKEN=your_telegram_bot_token
BOT_USERNAME=your_bot_username
MONGODB_URI=mongodb://localhost:27017/telegram-audio-bot
APYHUB_API_KEY=your_apyhub_api_key
START_IMAGE_URL=https://your-start-image-url.jpg
```

### 4. run the bot

```
npm start
```

or in development mode with auto-reload:

```
npm run dev
```

---

## apyhub api key

1. go to https://apyhub.com
2. create an account or log in
3. go to dashboard and copy your api token
4. paste it into `APYHUB_API_KEY` in your `.env` file

---

## telegram bot setup

1. open @botfather on telegram
2. send `/newbot` and follow instructions
3. copy the bot token into `BOT_TOKEN`
4. enable inline mode: send `/setinline` to @botfather and select your bot
5. set a start image url in `START_IMAGE_URL`

---

## project structure

```
telegram-video-to-audio-bot/
  bot.js                         main entry point
  package.json
  .env.example
  .gitignore
  config/
    database.js                  mongodb connection
  models/
    User.js                      user schema
    Conversion.js                conversion log schema
  src/
    handlers/
      startHandler.js            /start command with spoiler image
      helpHandler.js             /help command
      conversionHandler.js       video file handler
      inlineHandler.js           inline query handler
    services/
      apyhubService.js           apyhub api integration
  modules/
    logger.js                    logging utility
    downloader.js                file download utility
    formatter.js                 file name and size utilities
```

---

## mongodb collections

**users**
- telegramId, username, firstName, lastName
- totalConversions, joinedAt, lastActiveAt

**conversions**
- userId (ref), telegramId
- originalFileName, originalSize
- outputUrl, status (pending/processing/done/failed)
- errorMessage, createdAt, completedAt

---

## inline mode

users can type `@yourbotusername` in any telegram chat to share information about the bot without opening it directly.

---

## license

mit
