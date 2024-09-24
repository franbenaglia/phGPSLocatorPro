import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Coordinate } from '../model/coordinate';
import { openDB, IDBPDatabase } from '@tempfix/idb';
import { UserPhoto } from '../model/userPhoto';

const dbname = 'phGPSLocatorPro';
const version = 5;
const storenames = ['coordinates', 'photos'];

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {

  constructor() {
    this.openDb(storenames);
  }

  private dbOpen: IDBDatabase;
  private index: IDBIndex[];

  private dabOpen: IDBPDatabase;


  async openDb(storeNames: string[]) {

    let index = this.index;

    this.dabOpen = await openDB(dbname, version, {

      upgrade(db, oldVersion, newVersion, transaction, event) {

        if (newVersion) {
          for (let storeName of storeNames) {
            if (!db.objectStoreNames.contains(storeName)) {
              let store = db.createObjectStore(storeName, { autoIncrement: true });
              index[storeName] = store.createIndex(storeName + '_idx', storeName);
            }
          }
        }

      },
      blocked(currentVersion, blockedVersion, event) {
        console.log('Another connection of diferent version is open');
      },
      blocking(currentVersion, blockedVersion, event) {

      },
      terminated() {
        console.log('Abnormally terminates the connection');
      },
    });

  }

  async addElement(item: any, storeName: string) {//item: {id: storename:}

    let transaction = this.dabOpen.transaction(storeName, "readwrite");

    let objectStore = transaction.objectStore(storeName);

    let id = await objectStore.add(item);

    item.id = id;

    let req = this.updateElement(item, storeName);


    transaction.oncomplete = function () {
      console.log("Transaction completed");
    };

  }

  async updateElement(item: any, storeName: string) {
    await this.dabOpen.put(storeName, item, item.id)
  }


  async findAllElementsByCriterion(criterion: any | null, storeName: string): Promise<any[]> {

    return await this.dabOpen.getAll(storeName);


  }

  async findAllElements(storeName: string): Promise<any[]> {
    return this.findAllElementsByCriterion(null, storeName);
  }


  async findAllCursorElements(storeName: string) {

    const tx = this.dabOpen.transaction(storeName);

    for await (const cursor of tx.store) {
      let key = cursor.key;
      let value = cursor.value;
      console.log(key, value);
    }

  }


  getPositions(): Observable<Coordinate[]> {
    return from(this.findAllElements('coordinates'));
  }

  getPhotos(): Observable<UserPhoto[]> {
    return from(this.findAllElements('photos'));
  }

  addNewPosition(c: Coordinate) {
    this.addElement(c, 'coordinates');
  }

  addPhoto(up: UserPhoto) {
    this.addElement(up, 'photos');
  }

  updatePosition(c: Coordinate) {
    this.updateElement(c, 'coordinates');
  }

  updatePhoto(up: UserPhoto) {
    this.updateElement(up, 'photos');
  }

  async deletePosition(c: Coordinate) {
    await this.deleteElement(c, 'coordinates');
  }

  async deletePhoto(up: UserPhoto) {
    await this.deleteElement(up, 'photos');
  }

  async deleteElement(e: any, storage: string) {
    let key = e.id;
    await this.dabOpen.delete(storage, key);
  }

}