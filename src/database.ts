import { Database, Item } from './types.ts';
import { v4 as uuid } from 'uuid';

export class DatabaseMethods {
  static db: Database = {};

  static createItem = (item: Omit<Item, 'id'>): Item => {
    const id = this.uuidv4();
    const newItem = { id, ...item };
    this.db[id] = newItem;
    return newItem;
  };

  static getItem = (id: string): Item | undefined => this.db[id];

  static getAllItems = (): Item[] => Object.values(this.db);

  static updateItem = (id: string, updates: Partial<Item>): Item | undefined => {
    if (!this.db[id]) return undefined;
    this.db[id] = { ...this.db[id], ...updates };
    return this.db[id];
  };

  static deleteItem = (id: string): boolean => {
    if (!this.db[id]) return false;
    delete this.db[id];
    return true;
  };

  static uuidv4(): string {
    return uuid();
  }
}
