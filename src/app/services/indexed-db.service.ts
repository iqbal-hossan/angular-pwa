import { Injectable } from '@angular/core';
import { DBSchema, openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db: IDBPDatabase<MyDB> | undefined;

  constructor() { 
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB<MyDB>('my-db', 1, {
      upgrade(db) {
        db.createObjectStore('user-store');
      }
    });
  };

  addEmp(emp_obj: any) {
    return this.db?.put('user-store', emp_obj, 'employee');
  }

  deleteUser(key: string) {
    return this.db?.delete('user-store', key)
  }
}


interface MyDB extends DBSchema {
  'user-store': {
    key: string;
    value: any;
  };
}