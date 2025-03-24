/*
 * Abstract class that can be used to eventually implement other database drivers
 * since SQLite wouldn't be great in a production environment.
 */
export abstract class Database {
  query<T>(query: string, params?: any[]): Promise<T[]> {
    throw new Error("Database.query must be implementerd");
  }
  get<T>(query: string, params?: any[]): Promise<T[]> {
    throw new Error("Database.get must be implementerd");
  }
}
