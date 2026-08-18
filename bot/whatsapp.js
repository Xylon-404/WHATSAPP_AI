'use strict';

const fs = require('fs');
const pino = require('pino');
const { pushLog } = require('../utils/logger');
const { registerMessageHandler } = require('./messages');
const { AUTH_DIR } = require('../config/config');

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// ── Shared connection state (read by the HTTP API) ──
const state = {
    connected: false,
    starting: false,
    socket: null,
    phoneNumber: null,
    pairingCode: null,
    reconnectAttempts: 0,
};

function getState() {
    return {
        connected: state.connected,
        starting: state.starting,
        phoneNumber: state.phoneNumber,
        pairingCode: state.pairingCode,
    };
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
async function startWhatsAppBot(phone) {
    const {
        default: makeWASocket,
        useMultiFileAuthState,
        delay,
        fetchLatestBaileysVersion,
        DisconnectReason,
    } = require('@whiskeysockets/baileys');
    const { Boom } = require('@hapi/boom');

    if (phone) state.phoneNumber = phone;
    state.starting = true;
    state.pairingCode = null;

    fs.mkdirSync(AUTH_DIR, { recursive: true });
    const { state: authState, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    let version;
    try {
        const res = await fetchLatestBaileysVersion();
        version = res.version;
        pushLog(`📦 Baileys version: ${version.join('.')}`);
    } catch {
        version = [2, 3000, 1020576855]; // safe fallback version
        pushLog('⚠️ Could not fetch Baileys version, using fallback.');
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
    const sock = makeWASocket({
        version,
        auth: authState,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        connectTimeoutMs: 60_000,
        defaultQueryTimeoutMs: 30_000,
        keepAliveIntervalMs: 25_000,
        markOnlineOnConnect: true,
    });
    state.socket = sock;

    if (!sock.authState.creds.registered) {
        if (!state.phoneNumber) {
            pushLog('⚠️ No phone number set. Enter your number on the terminal page.');
            state.starting = false;
            return;
        }
        pushLog('🔑 Requesting pairing code for ' + state.phoneNumber + '...');
        await delay(3000);
        try {
            state.pairingCode = await sock.requestPairingCode(state.phoneNumber);
            pushLog('✅ Pairing code ready: ' + state.pairingCode);
        } catch (err) {
            pushLog('❌ Pairing error: ' + err.message);
            state.starting = false;
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            state.connected = true;
            state.starting = false;
            state.pairingCode = null;
            state.reconnectAttempts = 0;
            pushLog('🎊 DARK NET AI is ONLINE on WhatsApp!');
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
        if (connection === 'close') {
            state.connected = false;
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const loggedOut = code === DisconnectReason.loggedOut;

            if (loggedOut) {
                pushLog('🚪 Logged out from WhatsApp. Please reset and re-pair.');
                state.starting = false;
                return;
            }

            state.reconnectAttempts++;
            const wait = Math.min(3000 * state.reconnectAttempts, 30000); // max 30s backoff
            pushLog(
                `🔄 Disconnected (code ${code}). Reconnecting in ${wait / 1000}s… (attempt ${state.reconnectAttempts})`
            );
            state.starting = true;
            setTimeout(() => {
                startWhatsAppBot(null).catch((e) => {
                    pushLog('❌ Reconnect failed: ' + e.message);
                    state.starting = false;
                });
            }, wait);
        }
    });

    registerMessageHandler(sock);
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
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
function resetSession() {
    if (state.socket) {
        try {
            state.socket.end();
        } catch (_) {}
        state.socket = null;
    }
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    state.connected = false;
    state.starting = false;
    state.pairingCode = null;
    state.phoneNumber = null;
    state.reconnectAttempts = 0;
    pushLog('🧹 WhatsApp session reset.');
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
 * Whether a previous auth session exists on disk.
 */
function hasExistingSession() {
    return fs.existsSync(AUTH_DIR) && fs.readdirSync(AUTH_DIR).length > 0;
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
 * Close the socket cleanly (used on process shutdown).
 */
function shutdown() {
    if (state.socket) {
        try {
            state.socket.end();
        } catch (_) {}
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
module.exports = { startWhatsAppBot, resetSession, getState, hasExistingSession, shutdown };
