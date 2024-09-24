import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Coordinate } from '../model/coordinate';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public coordinates: Coordinate[] = [];

  private COORDINATES_STORAGE: string = 'coordinates';

  public async addNewPosition(coordinate: Coordinate) {

    this.coordinates.push(coordinate);

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }

  public async updatePosition(coordinate: Coordinate, coors: Coordinate[]) {

    let coordinatesChanged = coors.map(c => (c.lat === coordinate.lat && c.lng === coordinate.lng) ? coordinate : c);

    this.coordinates.length = 0;
    this.coordinates.push(...coordinatesChanged);

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }

  public async getPositions() {

    return await Preferences.get({
      key: this.COORDINATES_STORAGE
    });

  }

  public async deletePosition(coordinate: Coordinate, coors: Coordinate[]) {

    let cs = coors.filter(c => !(c.lat === coordinate.lat && c.lng == coordinate.lng));
    this.coordinates.length = 0;
    this.coordinates.push(...cs);

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }

  public async deleteAllPositions() {

    this.coordinates.length = 0;

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }


}
