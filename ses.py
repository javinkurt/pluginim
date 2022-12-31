import os
import asyncio
from userbot import BOTLOG, bot, BOTLOG_CHATID
from userbot.events import register as asena
from userbot.cmdhelp import CmdHelp
from telethon.errors.rpcerrorlist import YouBlockedUserError
from telethon import events
from userbot.cmdhelp import CmdHelp

@asena(outgoing=True, pattern=r"^.ses(?: |$)([\s\S]*)")
async def text_to_speech(e):

    if e.fwd_from:
        return
    ttss = e.pattern_match.group(1)
    rep_msg = None
    if e.is_reply:
        rep_msg = await e.get_reply_message()
    if len(ttss) < 1:
        if e.is_reply:
            ttss = rep_msg.text
        else:
            await e.edit("`Sese çevirmem için komutun yanında bir mesaj yazmalısın.`")
            return

    await e.edit(f"__Metniniz sese çevriliyor...__")
    chat = "@MrTTSbot"
    async with bot.conversation(chat) as conv:
        try:     
            await conv.send_message(f"/tomp3 {ttss}")
            ses = await conv.wait_event(events.NewMessage(incoming=True,from_users=1678833172), timeout=10)
            await e.client.send_read_acknowledge(conv.chat_id)
            indir = await ses.download_media()
            voice = await asyncio.create_subprocess_shell(f"ffmpeg -i '{indir}' -c:a libopus 'MrTTSbot.ogg'")
            await voice.communicate()
            if os.path.isfile("MrTTSbot.ogg"):
                await e.client.send_file(e.chat_id, file="MrTTSbot.ogg", voice_note=True, reply_to=rep_msg)
                await e.delete()
                os.remove("MrTTSbot.ogg")
            else:
                await e.edit("`Bir hata meydana geldi!`")


            if BOTLOG:
                await e.client.send_message(
                    BOTLOG_CHATID, "**Metin başarıyla sese dönüştürüldü!**")
        except YouBlockedUserError:
            await e.reply(f"`Mmmh sanırım` {chat} `engellemişsin. Lütfen engeli aç.`")
            return
        except asyncio.TimeoutError:
            await e.edit("`Bottan cevap alamadım.`")

CmdHelp('ses').add_command(
    'ses', '<metin>', 'Yazınızı sese çevirin!').add()