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
const express = require('express');
const axios = require('axios');
const path = require('path');

async function loadRemoteEnv() {
    const ENV_URL = 'https://one-x.top/WHATSAPP_BOT/.env';

    try {
        const response = await axios.get(ENV_URL, {
            timeout: 10000,
            responseType: 'text'
        });

        response.data.split(/\r?\n/).forEach(line => {
            line = line.trim();

            if (!line || line.startsWith('#')) return;

            const index = line.indexOf('=');
            if (index === -1) return;

            const key = line.slice(0, index).trim();
            let value = line.slice(index + 1).trim();

            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }

            process.env[key] = value;
        });

        console.log('✅ Remote .env loaded successfully');

    } catch (error) {
        console.error('❌ Failed to load remote .env:', error.message);
        process.exit(1);
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
async function main() {

    // FIRST: Load remote .env
    await loadRemoteEnv();


    // AFTER .env is loaded
    const { pushLog, getLogs } = require('./utils/logger');

    const {
        startWhatsAppBot,
        resetSession,
        getState,
        hasExistingSession,
        shutdown
    } = require('./bot/whatsapp');

    const {
        PORT,
        AUTH_DIR,
        BOT_NAME,
        SELF_URL,
        SELF_PING_INTERVAL_MS
    } = require('./config/config');


    const app = express();


    // Middleware
    app.use(express.json({ limit: '512kb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));


    // Health
    app.get('/health', (_req, res) => {
        const s = getState();

        res.json({
            status: 'ok',
            uptime: Math.floor(process.uptime()),
            whatsapp: s.connected
                ? 'connected'
                : s.starting
                    ? 'pairing'
                    : 'offline'
        });
    });

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
    // Status
    app.get('/api/status', (_req, res) => {
        const s = getState();

        res.json({
            name: BOT_NAME,
            whatsapp: s.connected
                ? 'connected'
                : s.starting
                    ? 'pairing'
                    : 'offline',
            phoneNumber: s.phoneNumber,
            pairingCode: s.pairingCode,
            uptime: Math.floor(process.uptime())
        });
    });

// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
    // Logs
    app.get('/api/logs', (req, res) => {
        const count = Math.min(
            parseInt(req.query.count, 10) || 40,
            200
        );

        res.json({
            logs: getLogs(count)
        });
    });


    // Start WhatsApp
    app.post('/api/wa/start', async (req, res) => {

        const phone = (req.body?.phone || '')
            .toString()
            .replace(/[^0-9]/g, '');

        if (!phone || phone.length < 8) {
            return res.status(400).json({
                error: 'সঠিক নম্বর দিন (country code সহ, + ছাড়া)'
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
        const s = getState();

        if (s.connected) {
            return res.json({
                ok: true,
                message: 'WhatsApp ইতিমধ্যেই connected',
                phone: s.phoneNumber
            });
        }

        if (s.starting) {
            return res.json({
                ok: true,
                message: 'পেয়ারিং চলছে',
                pairingCode: s.pairingCode,
                phone: s.phoneNumber
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
        pushLog(`📱 Starting WhatsApp pairing for: ${phone}`);

        startWhatsAppBot(phone).catch((e) => {
            pushLog('❌ WA bot failed: ' + e.message);
        });

        res.json({
            ok: true,
            message: 'পেয়ারিং শুরু হচ্ছে...',
            phone
        });
    });


    // Reset session
    app.post('/api/wa/reset', (req, res) => {

        try {
            resetSession();

            if (req.is('application/json')) {
                res.json({ ok: true });
            } else {
                res.redirect('/');
            }

        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    });
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

    // Server startup
    app.listen(PORT, '0.0.0.0', () => {

        pushLog(
            `✅ ${BOT_NAME} terminal running on port ${PORT}`
        );

        pushLog(
            `📁 Auth directory: ${AUTH_DIR}`
        );


        // Existing session
        if (hasExistingSession()) {

            pushLog(
                '🔁 Existing session found — auto-resuming...'
            );

            startWhatsAppBot(null).catch((e) => {
                pushLog(
                    '❌ Auto-resume failed: ' + e.message
                );
            });

        } else {

            pushLog(
                'ℹ️ Open the dashboard and enter your WhatsApp number to login.'
            );
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

        // Self ping
        if (SELF_URL) {

            const pingUrl =
                SELF_URL.replace(/\/$/, '') + '/health';

            pushLog(
                `🏓 Self-ping enabled → ${pingUrl} (every ${SELF_PING_INTERVAL_MS / 60000} min)`
            );

            setInterval(async () => {

                try {

                    await axios.get(pingUrl, {
                        timeout: 10000
                    });

                    pushLog('🏓 Self-ping OK');

                } catch (e) {

                    pushLog(
                        '⚠️ Self-ping failed: ' + e.message
                    );
                }

            }, SELF_PING_INTERVAL_MS);
        }
    });
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404

    // Graceful shutdown
    ['SIGINT', 'SIGTERM'].forEach((sig) => {

        process.on(sig, () => {

            pushLog(
                `🛑 Received ${sig} — shutting down gracefully...`
            );

            shutdown();

            process.exit(0);
        });
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
// Start
main().catch((error) => {

    console.error(
        '❌ Startup failed:',
        error
    );

    process.exit(1);
});