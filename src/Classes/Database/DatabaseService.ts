import { MongoClient, Db, Collection } from 'mongodb';
import { Logger, LoggerColors } from '@serenityjs/logger';
import { CONNECTION_STRING, DATABASE_NAME } from '../../Configuration/Database/database';
import { IslandData, PlayerData } from '../../Types/types';

class DatabaseService {

  private client: MongoClient;
  private db!: Db;

  private _players!: Collection<PlayerData>;
  private _islands!: Collection<IslandData>;

  public logger = new Logger("Database Service", LoggerColors.Yellow)

  constructor() {
    this.client = new MongoClient(CONNECTION_STRING);
  }

  /**
   * Connects to the MongoDB server and initializes all the collections.
   * @param name Database name.
   */
  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(DATABASE_NAME);

      this._players = this.db.collection<PlayerData>('players');
      this._islands = this.db.collection<IslandData>('islands');

      this.logger.success("Database connection has been established.")
    } catch (error) {
      this.logger.error("Failed to connect to database.")
      throw error;
    }
  }

  /**
   * Closes the connection to the database.
   */
  public async disconnect(): Promise<void> {
    await this.client.close();
    this.logger.info("Database connection has been severed.")
  }

  public get players(): Collection<PlayerData> {
    return this._players;
  }

  public get islands(): Collection<IslandData> {
    return this._islands;
  }
}

export { DatabaseService }