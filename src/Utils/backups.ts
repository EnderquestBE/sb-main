import { appendFileSync, mkdirSync } from "node:fs";
import { access, copyFile, mkdir, readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { ServerTaskHandler } from "../Handlers";
import { Logger, LoggerColors } from "@serenityjs/logger";

/* BACKUPS SETTINGS */
const WORLDS_DIR = resolve('./worlds');
const SOURCE_PATH = resolve(WORLDS_DIR, "default", "players");

const BACKUPS_DIR = resolve('./backups');
const LOG_FILE = resolve(BACKUPS_DIR, 'backups.log');

const BACKUP_INTERVAL_MINUTES = 30;
const RETENTION_DAYS = 7;

// Logger
const BackupLogger = new Logger("Backup Utility", LoggerColors.White);

// Initialize backups folder.
try {
    mkdirSync(BACKUPS_DIR, { recursive: true });
} catch (error) {
    BackupLogger.error("FATAL: Could not create backups directory.", error);
    process.exit(1);
}

// Helper functions.
function logMessage(message: string, level: 'info' | 'error' = 'info') {
    if (level === 'error') {
        BackupLogger.error(message);
    } else {
        BackupLogger.info(message);
    }

    appendFileSync(LOG_FILE, message + '\n');
}

async function copyDir(src: string, dest: string) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await copyFile(srcPath, destPath);
        }
    }
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Delete old backups.
async function cleanupOldBackups(): Promise<void> {
    logMessage(`[INFO] Checking for backups older than ${RETENTION_DAYS} days.`);
    try {
        try {
            await access(BACKUPS_DIR);
        } catch {
            logMessage(`[ERROR] Backups directory does not exist yet, no directories to clean.`);
            return;
        }

        const entries = await readdir(BACKUPS_DIR, { withFileTypes: true });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let deletedCount = 0;

        for (const entry of entries) {
            if (entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name)) {
                const backupDate = new Date(`${entry.name}T00:00:00`);
                const diffTime = today.getTime() - backupDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays >= RETENTION_DAYS) {
                    const dirToDelete = join(BACKUPS_DIR, entry.name);
                    logMessage(`[INFO] Deleting old backup directory: ${dirToDelete}`);
                    await rm(dirToDelete, { recursive: true, force: true });
                    deletedCount++;
                }
            }
        }
        logMessage(`[INFO] Cleanup complete. Deleted ${deletedCount} old backup directories.`);
    } catch (error) {
        logMessage(`[ERROR] Error during cleanup process: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
}

// Create backup.
async function createBackup(): Promise<void> {
    logMessage(`[INFO] Starting new backup process for player data...`);
    try {
        try {
            await access(SOURCE_PATH);
        } catch {
            logMessage(`[ERROR] Source directory not found at '${SOURCE_PATH}'. Aborting backup.`);
            return;
        }
        const now = new Date();
        const dateFolder = formatDate(now);
        const destDir = join(BACKUPS_DIR, dateFolder);
        const finalBackupPath = join(destDir, new Date().toISOString().replace(/[:.]/g, '-'));

        await copyDir(SOURCE_PATH, finalBackupPath);

        logMessage(`[SUCCESS] World backed up successfully to '${finalBackupPath}'.`);

    } catch (error) {
        logMessage(`[ERROR] Failed to create backup. ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
}

async function startBackupsTask() {
    await cleanupOldBackups();
    ServerTaskHandler.queueIntervalTask(createBackup, BACKUP_INTERVAL_MINUTES * 60 * 1000);
    logMessage(`Backup task started, scheduled for every ${BACKUP_INTERVAL_MINUTES} minutes.`);
}

startBackupsTask();