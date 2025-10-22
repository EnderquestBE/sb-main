import dotenv from 'dotenv';

// Load environment variables.
dotenv.config();

// Parse environment variables.
const CONNECTION_STRING = process.env.CONNECTION_STRING!;
const DATABASE_NAME = process.env.DATABASE_NAME!;

const BOT_TOKEN = process.env.BOT_TOKEN!;

const isDevEnvironment = process.env.IS_DEV_ENVIRONMENT === 'true';

export { CONNECTION_STRING, DATABASE_NAME, BOT_TOKEN, isDevEnvironment };