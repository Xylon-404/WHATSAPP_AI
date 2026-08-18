'use strict';

const { pushLog } = require('../utils/logger');
const { askAI } = require('../ai/ai');
const { fetchImageBuffer } = require('../ai/image');
const { getAdminInfo, getHelpText } = require('../ai/admininfo');
const { resolveCommand } = require('./commands');
const { DEV_NAME, DEV_TELEGRAM } = require('../config/config');

const SEEN_LIMIT = 500;
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
function registerMessageHandler(sock) {
    const seenMsgs = new Set();
    const busyChats = new Set();

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg?.message || msg.key.fromMe) return;

        const text =
            msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!text.trim()) return;

        const msgId = msg.key.id;
        if (seenMsgs.has(msgId)) return;
        seenMsgs.add(msgId);
        if (seenMsgs.size > SEEN_LIMIT) seenMsgs.clear();

        const jid = msg.key.remoteJid;
        if (busyChats.has(jid)) {
            pushLog(`⏭️ Skipped (busy): ${text.substring(0, 24)}`);
            return;
        }
        busyChats.add(jid);
        pushLog(`📩 WA: ${text.substring(0, 40)}`);

        let typingTimer = null;
        const startTyping = async () => {
            try {
                await sock.sendPresenceUpdate('available', jid);
                await sock.sendPresenceUpdate('composing', jid);
            } catch (_) {}
            typingTimer = setInterval(() => {
                sock.sendPresenceUpdate('composing', jid).catch(() => {});
            }, 8000);
        };
        const stopTyping = async () => {
            if (typingTimer) {
                clearInterval(typingTimer);
                typingTimer = null;
            }
            try {
                await sock.sendPresenceUpdate('paused', jid);
            } catch (_) {}
        };

        try {
            try {
                await sock.readMessages([msg.key]);
            } catch (_) {}
            await startTyping();

            const command = resolveCommand(text);

            if (command.type === 'image') {
                await handleImageCommand(sock, jid, command.prompt, stopTyping);
            } else if (command.type === 'info') {
                await stopTyping();
                await sock.sendMessage(jid, { text: getAdminInfo() });
                pushLog('📤 Info sent.');
            } else if (command.type === 'help') {
                await stopTyping();
                await sock.sendMessage(jid, { text: getHelpText() });
                pushLog('📤 Help sent.');
            } else {
                const reply = await askAI(command.text);
                await stopTyping();
                await sock.sendMessage(jid, { text: reply });
                pushLog('📤 Reply sent.');
            }
        } catch (e) {
            await stopTyping();
            pushLog('⚠️ Handler error: ' + e.message);
        } finally {
            busyChats.delete(jid);
        }
    });
}
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
async function handleImageCommand(sock, jid, prompt, stopTyping) {
    pushLog('🎨 Generating image: ' + prompt.substring(0, 30));
    try {
        const buffer = await fetchImageBuffer(prompt);
        await stopTyping();
        await sock.sendMessage(jid, {
            image: buffer,
            caption: `🎨 "${prompt}"\n\n— DARK NET AI\n👨‍💻 Dev: 『 ${DEV_NAME} 』 ${DEV_TELEGRAM}`,
        });
        pushLog('🖼️ Image sent.');
    } catch (imgErr) {
        pushLog('❌ Image error: ' + (imgErr.response?.status || imgErr.message));
        await stopTyping();
        await sock.sendMessage(jid, {
            text: '⚠️ ছবি তৈরি করতে সার্ভার এখন একটু ব্যস্ত (rate-limit)। ৩০ সেকেন্ড পরে আবার চেষ্টা করুন।',
        });
    }
}
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
module.exports = { registerMessageHandler };
