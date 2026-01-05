import { MongoClient, Db, Collection } from 'mongodb';
import { Logger, LoggerColors } from '@serenityjs/logger';
import { GlobalServerData, IslandData, PlayerData, PremiumData, VendorData } from '../../Types/types';
import { CONNECTION_STRING, DATABASE_NAME } from '../../config';

class DatabaseService {

  private client: MongoClient;
  private db!: Db;

  private _players!: Collection<PlayerData>;
  private _premium!: Collection<PremiumData>;
  private _islands!: Collection<IslandData>;
  private _vendors!: Collection<VendorData>;
  private _global!: Collection<GlobalServerData>;

  public logger = new Logger("Database Service", LoggerColors.Yellow)

  public isInitialized: boolean = false;

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
      this._premium = this.db.collection<PremiumData>('premium');
      this._islands = this.db.collection<IslandData>('islands');
      this._vendors = this.db.collection<VendorData>('vendors');
      this._global = this.db.collection<GlobalServerData>('global');

      this.logger.success("Database connection has been established.")
      this.isInitialized = true;
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

  public get premium(): Collection<PremiumData> {
    return this._premium;
  }

  public get islands(): Collection<IslandData> {
    return this._islands;
  }

  public get vendors(): Collection<VendorData> {
    return this._vendors;
  }

  public get global(): Collection<GlobalServerData> {
    return this._global;
  }
}

export { DatabaseService }