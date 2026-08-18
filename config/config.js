'use strict';

const path = require('path');

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

const PORT = process.env.PORT || 3000;
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

// Render persistent disk / local storage
// চাইলে remote .env থেকে AUTH_DIR সেট করতে পারবে।
const AUTH_DIR =
    process.env.AUTH_DIR ||
    path.join(__dirname, '..', 'auth_info');


// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

const BOT_NAME = 'DARK NET AI';

const DEV_NAME = 'ABDULLHA';

const DEV_CONTACT_URL =
    'https://collegemate.xyz/';

const DEV_TELEGRAM =
    't.me/PRO_CODE_X';

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

const OPENROUTER_API_URL =
    'https://openrouter.ai/api/v1/chat/completions';


const OPENROUTER_API_KEY =
    process.env.OPENROUTER_API_KEY || '';


const OPENROUTER_MODEL =
    process.env.OPENROUTER_MODEL ||
    'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';


const OPENROUTER_SITE_URL =
    process.env.OPENROUTER_SITE_URL || '';

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

const SYSTEM_PROMPT = `তুমি হলে "${BOT_NAME}" — একজন বন্ধু এবং সাহায্যকারী।

তোমাকে তৈরী করছে ${DEV_NAME} - একজন python programmer.

${DEV_NAME} contact link : ${DEV_CONTACT_URL}

তোমার ব্যক্তিত্ব:
- তুমি ব্যবহারকারীর একজন বিশ্বস্ত বন্ধু এবং সব সময় সাহায্যের জন্য প্রস্তুত।
- তুমি যেকোনো প্রশ্নের সঠিক ও বিস্তারিত উত্তর দিতে পারো — পড়াশোনা, কোডিং, রান্না, ভ্রমণ, স্বাস্থ্য, বিনোদন, প্রযুক্তি, যা কিছু হোক।
- কেউ সাহায্য চাইলে তুমি বন্ধুর মতো কথা বলো — উষ্ণ, ধৈর্যশীল ও আন্তরিকভাবে।
- তুমি বাংলা, English বা যেকোনো ভাষায় উত্তর দিতে পারো — যেই ভাষায় ব্যবহারকারী লেখে তুমিও সেই ভাষায় উত্তর দিও।

ছবি তৈরি (Image Generation):
- যদি ব্যবহারকারী কোনো ছবি তৈরি করতে বলে (যেমনঃ "ছবি বানাও", "image বানাও", "draw", "generate image"), তুমি তাদের /image কমান্ডের কথা বলো।
- উদাহরণঃ "/image একটা সূর্যাস্তের ছবি" — এভাবে লিখলেই আমি ছবি তৈরি করে দেব।

সর্বদা সংক্ষিপ্ত, পরিষ্কার ও সহায়ক উত্তর দাও। মিথ্যা তথ্য দিও না — না জানলে সরাসরি বলে দাও.`;

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

// Free image generation
// No API key required.

const IMAGE_BASE_URL =
    'https://image.pollinations.ai/prompt/';

const IMAGE_WIDTH = 1024;

const IMAGE_HEIGHT = 1024;

const IMAGE_FETCH_ATTEMPTS = 4;


// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

// Render external URL অথবা remote .env থেকে SELF_URL

const SELF_URL =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.SELF_URL ||
    '';


const SELF_PING_INTERVAL_MS =
    13 * 60 * 1000;

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

module.exports = {

    // Server
    PORT,

    // WhatsApp
    AUTH_DIR,

    // Bot identity
    BOT_NAME,
    DEV_NAME,
    DEV_CONTACT_URL,
    DEV_TELEGRAM,

    // OpenRouter
    OPENROUTER_API_URL,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    OPENROUTER_SITE_URL,
    SYSTEM_PROMPT,

    // Image generation
    IMAGE_BASE_URL,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    IMAGE_FETCH_ATTEMPTS,

    // Self ping
    SELF_URL,
    SELF_PING_INTERVAL_MS
};