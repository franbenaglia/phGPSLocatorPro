import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Observable, from, bindCallback, of } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class GeolocService {

  constructor(private platform: Platform) {

  }

  getCurrentPosition(): Observable<any> {

    if (!Capacitor.isNativePlatform()) {
      return from(this.getPositionFromNavigator());
    } else {
      return from(this.currentPositionNative());
    }
  }

  private currentPositionNative = async () => {
    return await Geolocation.getCurrentPosition();
  };

  private getPositionFromNavigator = () => {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

  public checkPermissions(): Observable<any> {

    if (this.platform.is('hybrid')) {
      return from(Geolocation.checkPermissions());
    } else {
      return of('web');
    }

  }

}
