import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { Coordinate } from '../model/coordinate';
import { UserPhoto } from '../model/userPhoto';
//https://github.com/capacitor-community/sqlite/blob/master/docs/API.md
//https://www.sqlite.org/autoinc.html
//https://www.sqlite.org/limits.html
@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  public isIOS: boolean;

  public dbName: string;

  constructor() {
  }

  async init() {
    this.initDatabase();
  }

  private async initDatabase() {

    const dbSetup = await Preferences.get({ key: 'first_setup' })

    if (!dbSetup.value) {
      this.setUpDatabase();
    } else {
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName })
    }

  }

  private async setUpDatabase() {

    const response = await fetch('assets/db.json');
    const json = await response.json();
    const jsonstring = JSON.stringify(json);
    const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

    if (isValid.result) {

      this.dbName = json.database;

      await CapacitorSQLite.importFromJson({ jsonstring });

      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName })

      await Preferences.set({ key: 'first_setup', value: '1' });
      await Preferences.set({ key: 'dbname', value: this.dbName });

    }

  }

  private async getDbName() {

    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' })
      if (dbname.value) {
        this.dbName = dbname.value
      }
    }
    return this.dbName;
  }

  async create(element: any, table: string): Promise<capSQLiteChanges> {

    let sql = 'INSERT INTO ' + table + ' VALUES(?)';

    const dbName = await this.getDbName();

    const jsonstring = JSON.stringify(element);

    return await CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            jsonstring
          ]
        }
      ]
    });
  }

  async read(table: string) {

    let sql = 'SELECT * FROM ' + table;

    const dbName = await this.getDbName();

    return await CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {

      let elements: any[] = [];

      for (let index = 0; index < response.values.length; index++) {
        const element = response.values[index];
        elements.push(element);
      }
      return elements;

    }).catch(err => Promise.reject(err))
  }

  getPositions(): Observable<Coordinate[]> {
    return from(this.read('coordinates'));
  }

  getPhotos(): Observable<UserPhoto[]> {
    return from(this.read('photos'));
  }

  addNewPosition(c: Coordinate) {
    this.create(c, 'coordinates');
  }

  async addPhoto(up: UserPhoto) {
    await this.create(up, 'photos');
  }

  async delete(element: any, storage: string): Promise<capSQLiteChanges> {

    let sql = 'DELETE FROM ' + storage + ' WHERE id=?';

    const dbName = await this.getDbName();

    return await CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            element.id
          ]
        }
      ]
    }).catch(err => Promise.reject(err))
  }

  async deletePhoto(up: UserPhoto) {
    await this.delete(up, 'photos');
  }

  async deletePosition(c: Coordinate) {
    await this.delete(c, 'coordinates');
  }

  async update(element: any, storage: string): Promise<capSQLiteChanges> {

    let sql = 'UPDATE ' + storage + ' SET ' + storage + '=? WHERE id=?';

    const dbName = await this.getDbName();

    return await CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            element,
            element.id
          ]
        }
      ]
    }).catch(err => Promise.reject(err))
  }

  async updatePosition(c: Coordinate) {
    await this.update(c, 'coordinates');
  }



}