'use strict';

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404


function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
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

function extractImagePrompt(text) {
    const trimmed = text.trim();

    const cmdMatch = trimmed.match(/^\/(image|img|imagine)\s+(.+)/i);
    if (cmdMatch) return cmdMatch[2].trim();

    const patterns = [
        /^(?:একটা |একটি )?(.+?)(?:\s*-?এর)?\s*(?:ছবি|পিকচার|পিক)\s*(?:বানাও|তৈরি কর|দাও|দে|generate|বানা)/i,
        /^(?:draw|generate|make|create)\s+(?:an?\s+)?(?:image|picture|photo)\s+(?:of\s+)?(.+)/i,
        /^(?:ছবি|image|picture)\s*[:\-]\s*(.+)/i,
    ];

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

    for (const re of patterns) {
        const m = trimmed.match(re);
        if (m && m[1]) return m[1].trim();
    }

    return null;
}

module.exports = { escapeHtml, extractImagePrompt };
