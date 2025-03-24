import { Database as SqliteDatabase } from "sqlite3";
import { Database } from "./database";
import logger from "../utils/logger";

export default class Sqlite extends Database {
  private db: SqliteDatabase;

  constructor(dbPath: string) {
    super();
    this.db = new SqliteDatabase(dbPath, (err) => {
      if (err) {
        throw new Error("Failed to open database at path " + dbPath);
      }
      logger.log("Successfully connected to SQLite database at path " + dbPath);
    });
  }

  async query<T>(query: string, params?: any[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.db.all(query, params ?? [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve((rows as T[]) ?? null);
        }
      });
    });
  }

  async get<T>(query: string, params?: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.db.get(query, params ?? [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }
}
