'use strict';

const axios = require('axios');
const { pushLog } = require('../utils/logger');
const {
    OPENROUTER_API_URL,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    OPENROUTER_SITE_URL,
    SYSTEM_PROMPT,
    BOT_NAME,
} = require('../config/config');
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
 * Ask the AI model a question and return its reply text.
 * Never throws — returns a user-facing Bangla error string on failure.
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
async function askAI(userMessage) {
    try {
        if (!OPENROUTER_API_KEY) {
            pushLog('❌ OPENROUTER_API_KEY is missing');
            return '⚠️ AI API key configure করা হয়নি।';
        }

        const res = await axios.post(
            OPENROUTER_API_URL,
            {
                model: OPENROUTER_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': OPENROUTER_SITE_URL,
                    'X-Title': BOT_NAME,
                },
                timeout: 60000,
            }
        );
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
        const reply = res.data?.choices?.[0]?.message?.content;
        if (reply && typeof reply === 'string') return reply.trim();

        pushLog('⚠️ OpenRouter returned no message');
        return '⚠️ কোনো AI উত্তর পাওয়া যায়নি।';
    } catch (err) {
        const status = err.response?.status;
        const apiError =
            err.response?.data?.error?.message || err.response?.data?.error || err.message;

        pushLog('❌ OpenRouter AI Error: ' + `${status ? status + ' - ' : ''}${apiError}`);
        return '⚠️ দুঃখিত, AI সার্ভারে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।';
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
module.exports = { askAI };
