import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { IndexeddbService } from './indexeddb.service';
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Coordinate } from '../model/coordinate';
import { UserPhoto } from '../model/userPhoto';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private native: boolean = false;

  constructor(private sqlite: SqliteService, private indexeddb: IndexeddbService) {
    this.init();
  }

  async init() {
    this.native = Capacitor.isNativePlatform();
    if (this.native) {
      await this.sqlite.init();
    } else {
      await this.indexeddb.openDb();
    }
  }


  getPositions(): Observable<Coordinate[]> {
    if (!this.native) {
      return this.indexeddb.getPositions();
    } else {
      return this.sqlite.getPositions();
    }
  }

  getPhotos(): Observable<UserPhoto[]> {
    if (!this.native) {
      return this.indexeddb.getPhotos();
    } else {
      return this.sqlite.getPhotos();
    }
  }

  async addNewPosition(c: Coordinate) {
    if (!this.native) {
      return await this.indexeddb.addNewPosition(c);
    } else {
      return await this.sqlite.addNewPosition(c);
    }
  }


  async updatePosition(c: Coordinate) {
    if (!this.native) {
      return await this.indexeddb.updatePosition(c);
    } else {
      return await this.sqlite.updatePosition(c);
    }
  }

  async deletePosition(c: Coordinate) {
    if (!this.native) {
      return await this.indexeddb.deletePosition(c);
    } else {
      return await this.sqlite.deletePosition(c);
    }
  }

  async deletePhoto(up: UserPhoto) {
    if (!this.native) {
      return await this.indexeddb.deletePhoto(up);
    } else {
      return await this.sqlite.deletePhoto(up);
    }
  }

  async addPhoto(up: UserPhoto) {
    if (!this.native) {
      return await this.indexeddb.addPhoto(up);
    } else {
      return await this.sqlite.addPhoto(up);
    }
  }

}
