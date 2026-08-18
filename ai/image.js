'use strict';

const axios = require('axios');
const { pushLog } = require('../utils/logger');
const {
    IMAGE_BASE_URL,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    IMAGE_FETCH_ATTEMPTS,
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
 * Build a Pollinations image URL for the given prompt.
 * @param {string} prompt
 */
function imageUrlFor(prompt) {
    const encoded = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1_000_000);
    return `${IMAGE_BASE_URL}${encoded}?width=${IMAGE_WIDTH}&height=${IMAGE_HEIGHT}&nologo=true&seed=${seed}`;
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
 * Fetch a generated image as a Buffer, retrying with backoff on failure.
 * @param {string} prompt
 * @param {number} attempts
 * @returns {Promise<Buffer>}
 */
async function fetchImageBuffer(prompt, attempts = IMAGE_FETCH_ATTEMPTS) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
        const url = imageUrlFor(prompt);
        try {
            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 90_000,
                headers: { 'User-Agent': 'DARK-NET-AI/2.0' },
            });
            if (res.data && res.data.byteLength > 1000) return Buffer.from(res.data);
            throw new Error('empty image response');
        } catch (e) {
            lastErr = e;
            const status = e.response?.status;
            const wait = status === 429 ? 5000 + i * 3000 : 2500 + i * 2000;
            pushLog(
                `⚠️ Image attempt ${i + 1}/${attempts} (${status || e.code || e.message}). Retry in ${wait}ms`
            );
            await new Promise((r) => setTimeout(r, wait));
        }
    }
    throw lastErr || new Error('image generation failed after all attempts');
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
module.exports = { imageUrlFor, fetchImageBuffer };
