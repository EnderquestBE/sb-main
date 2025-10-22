interface ModerationRecordEntry {
    /** The type of moderation action. */
    type: "warning" | "ban" | "unban";
    /** The date of the moderation action. */
    date: string;
    /** The reason for the moderation action. */
    reason: string;
    /** The moderator who performed the action. */
    moderator: string;
}

export { ModerationRecordEntry };