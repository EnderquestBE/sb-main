import { createWriteStream, WriteStream, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { format } from "node:util";
import { join } from "node:path";

/* LOGS PATH */
const LOG_DIRECTORY = './logs';

if (!existsSync(LOG_DIRECTORY)) {
    mkdirSync(LOG_DIRECTORY, { recursive: true });
}

const getFormattedDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const latestLogPath = join(LOG_DIRECTORY, 'latest.log');
const datedLogPath = join(LOG_DIRECTORY, `${getFormattedDate()}.log`);

const latestLogStream: WriteStream = createWriteStream(latestLogPath, { flags: 'w' });
const datedLogStream: WriteStream = createWriteStream(datedLogPath, { flags: 'a' });

// Original functionality

const log = console.log;
const warn = console.warn;
const error = console.error;

// Helper functions

const stripAnsiCodes = (str: string): string => {
    return str.replace(/\x1B\[[0-9;]*m/g, '');
};

const getLogMessage = (...args: any[]): string => {
    const message = stripAnsiCodes(format(...args));
    return `${message}\n`;
};

const writeToStreams = (message: string) => {
    latestLogStream.write(message);
    datedLogStream.write(message);
};

// Override existing console methods.

console.log = function (...args: any[]) {
    writeToStreams(getLogMessage(...args));
    log.apply(console, args);
};

console.warn = function (...args: any[]) {
    writeToStreams(getLogMessage(...args));
    warn.apply(console, args);
};

console.error = function (...args: any[]) {
    writeToStreams(getLogMessage(...args));
    error.apply(console, args);
};

// Error and crash handling
const handleFatalError = (errorType: string, err: Error, origin?: string) => {
    const errorMessage = getLogMessage(
        `FATAL ${errorType}: ${origin || ''}`,
        err.stack || err
    );

    console.error(errorMessage)

    try {
        writeFileSync(latestLogPath, errorMessage, { flag: 'a' });
        writeFileSync(datedLogPath, errorMessage, { flag: 'a' });
    } catch (writeErr) {
        error('Failed to write fatal error to log file:', writeErr);
    }
    process.exit(1);
};

process.on('uncaughtException', (err, origin) => {
    handleFatalError('UNCAUGHT EXCEPTION', err, origin);
});

process.on('unhandledRejection', (reason, promise) => {
    const err = reason instanceof Error ? reason : new Error(`Unhandled Rejection: ${reason}`);
    handleFatalError('UNHANDLED REJECTION', err, `at promise: ${promise}`);
});


process.on('beforeExit', () => {
    latestLogStream.end();
    datedLogStream.end();
});

export { };
