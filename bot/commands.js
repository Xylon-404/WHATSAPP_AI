'use strict';

const { extractImagePrompt } = require('../utils/helpers');

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404


function resolveCommand(text) {
    const trimmed = text.trim();

    if (/^\/(info|about)\b/i.test(trimmed)) return { type: 'info' };
    if (/^\/help\b/i.test(trimmed)) return { type: 'help' };

    const imgPrompt = extractImagePrompt(trimmed);
    if (imgPrompt) return { type: 'image', prompt: imgPrompt };

    return { type: 'chat', text: trimmed };
}

module.exports = { resolveCommand };
