import asyncio
from telegram import Bot
from telegram.error import TelegramError
BOT_TOKEN = '6993686742:AAFXrIb8CGZqMCAu_B3C2k8A9EEsNHB5U00'
async def send_message(chat_id, text):
    try:
        bot = Bot(token=BOT_TOKEN)
        await bot.send_message(chat_id=chat_id, text=text)
        print("Message sent successfully")
    except TelegramError as e:
        print(f"Failed to send message: {e}")
USER_ID = '5587470125'
MESSAGE = 'Hello, World!'
try:
    asyncio.run(send_message(USER_ID, MESSAGE))
except Exception as e:
    print(f"An error occurred: {e}")
