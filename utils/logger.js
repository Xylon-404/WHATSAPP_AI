'use strict';

const MAX_LOGS = 200;
let logs = ['🚀 DARK NET AI starting up...'];


// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404
// xylon-404


function pushLog(msg) {
    const ts = new Date().toLocaleTimeString('bn-BD');
    logs.push(`[${ts}] ${msg}`);
    if (logs.length > MAX_LOGS) logs = logs.slice(-MAX_LOGS);
    console.log(msg);
    return logs[logs.length - 1];
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


function getLogs(count = MAX_LOGS) {
    return logs.slice(-count);
}

module.exports = { pushLog, getLogs };
