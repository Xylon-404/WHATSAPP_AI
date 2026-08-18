'use strict';

const { BOT_NAME, DEV_NAME, DEV_CONTACT_URL, DEV_TELEGRAM, OPENROUTER_MODEL } = require('../config/config');
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
/**
 * Text shown for the /info (or /about) command.
 */
function getAdminInfo() {
    return [
        `🤖 *${BOT_NAME}*`,
        '',
        `👨‍💻 তৈরি করেছেন: ${DEV_NAME}`,
        `🔗 যোগাযোগ: ${DEV_CONTACT_URL}`,
        `📩 Telegram: ${DEV_TELEGRAM}`,
        `🧠 Model: ${OPENROUTER_MODEL}`,
        '',
        'যেকোনো প্রশ্ন করুন — সাথে সাথে উত্তর পাবেন।',
        '/help লিখে সব কমান্ড দেখুন।',
    ].join('\n');
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
/**
 * Text shown for the /help command.
 */
function getHelpText() {
    return [
        `💡 *${BOT_NAME} — কমান্ড তালিকা*`,
        '',
        '• যেকোনো প্রশ্ন → সাথে সাথে AI উত্তর দেবে',
        '• /image <বর্ণনা> → ছবি তৈরি করবে',
        '• একটা গাড়ির ছবি বানাও → ছবি তৈরি করবে',
        '• draw a cat → ইংরেজিতেও কাজ করবে',
        '• /info → বট সম্পর্কে তথ্য',
        '• /help → এই মেনু',
    ].join('\n');
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
module.exports = { getAdminInfo, getHelpText };
