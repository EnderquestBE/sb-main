import { Collection, DeleteResult, Document, Filter, OptionalUnlessRequiredId, UpdateFilter } from "mongodb";

/**
 * Handles collections for different data types, like player or island.
 */
abstract class CollectionManager<T extends Document> {
  protected collection: Collection<T>;
  public readonly key: string;

  constructor(collection: Collection<T>, key: string) {
    this.collection = collection;
    this.key = key;
  }

  /**
   * Retrieves document using identifier.
   * @param identifier Identifier to fetch.
   */
  public async get(identifier: string): Promise<T | null> {
    const query = { [this.key]: identifier };
    return this.collection.findOne(query as Filter<T>) as Promise<T | null>;
  }

  /**
   * Creates new document in collection.
   * @param data Document data to insert.
   */
  public async create(data: T) {
    return this.collection.insertOne(data as OptionalUnlessRequiredId<T>);
  }

  /**
   * Set/update document data.
   * @param identifier  Identifier to set.
   * @param data Data to set to.
   */
  public async update(identifier: string, data: Partial<T>) {
    const filter = { [this.key]: identifier };
    const updateDoc = { $set: data };
    return this.collection.updateOne(filter as Filter<T>, updateDoc);
  }

  /**
 * Updates a single value of data.
 * @param identifier Identifier to update.
 * @param updateDoc Update operation to push.
 */

  public async updateOne(identifier: string, updateDoc: UpdateFilter<T>) {
    const filter = { [this.key]: identifier };
    return this.collection.updateOne(filter as Filter<T>, updateDoc);
  }

  /**
   * Delete a document using identifier.
   * @param identifier Identifier to delete.
   */
  public async delete(identifier: string) {
    const filter = { [this.key]: identifier };
    return this.collection.deleteOne(filter as Filter<T>);
  }

  /**
 * Deletes all documents from the collection.
 */
  public async clear(): Promise<DeleteResult> {
    return this.collection.deleteMany({} as Filter<T>);
  }
}

export { CollectionManager }