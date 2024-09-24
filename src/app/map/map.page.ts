import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonSpinner, IonPopover, IonInput, IonToast } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Platform } from '../model/platform';
import { GeolocService } from '../services/geoloc.service';
import { Coordinate } from '../model/coordinate';
import { StorageService } from '../services/storage.service';
import { from } from 'rxjs';
import { PhotoContentComponent } from '../components/photo-content/photo-content.component';
import { MarkerContentComponent } from '../components/marker-content/marker-content.component';
import { IndexeddbService } from '../services/indexeddb.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonToast, MarkerContentComponent, PhotoContentComponent, IonInput, IonPopover, IonSpinner, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit {

  constructor(private idbService: IndexeddbService, private storage: StorageService, private geolocService: GeolocService) { }

  platform: Platform;
  positioncoords: string = '';

  isToastOpen: boolean = false;

  ngOnInit() {
    this.checkPermissions();
    this.position();
  }

  leafletMap: any;

  private lat: number;

  private lng: number;

  private zoom: number = 16;

  spin: boolean = true;

  coordinate: Coordinate;

  isPopoverOpen: boolean = false;

  isPopoverPicOpen: boolean = false;

  private iconMark = L.icon({
    iconUrl: 'assets/icon/marker.png',
    iconSize: [30, 40]
  });

  private iconCurrentPosition = L.icon({
    iconUrl: 'assets/icon/redmark.png',
    iconSize: [40, 50]
  });

  private position(): void {

    this.geolocService.getCurrentPosition().subscribe(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.loadLeafletMap();
    });
  }

  private loadLeafletMap(): void {

    this.spin = true;

    this.leafletMap = new L.Map('leafletMap');

    const self = this;

    this.leafletMap.on('load', function () {

      setTimeout(() => {

        self.leafletMap.invalidateSize();
        self.spin = false;

      }, 100);

    });

    this.leafletMap.setView([this.lat, this.lng], this.zoom);

    this.configMap();

    this.currentMarkerPosition();

    this.loadSavedMarkers();

    this.handlers();

  }

  popOverOnClick = () => {
    this.isPopoverOpen = !this.isPopoverOpen;

  }

  popOverPicOnClick = () => {
    this.isPopoverPicOpen = !this.isPopoverPicOpen;
  }

  private loadSavedMarkers(): void {

    const self = this;

    from(this.idbService.getPositions()).subscribe(ms => {

      let coordinates: Coordinate[] = ms;

      let i = 0;
      let len = coordinates.length;

      while (i < len) {
        let mark = L.marker([coordinates[i].lat, coordinates[i].lng], { icon: this.iconMark }).addTo(this.leafletMap);
        mark.addEventListener('click', (x) => {
          self.isPopoverOpen = !self.isPopoverOpen;
          self.coordinate = coordinates.find(c => c.lat === x.latlng.lat && c.lng === x.latlng.lng);
        });
        i++
      }

    }
    );
  }

  private currentMarkerPosition(): void {

    let marker = L.marker([this.lat, this.lng], { icon: this.iconCurrentPosition }).addTo(this.leafletMap)
    let coordinate: Coordinate = new Coordinate();
    coordinate.lat = this.lat;
    coordinate.lng = this.lng;
    marker.addEventListener('click', () => {
      this.isPopoverOpen = !this.isPopoverOpen;
      this.coordinate = coordinate;
    });
  }

  private handlers(): void {

    const self = this;

    function onMapDoubleClick(e) {
      let mark = L.marker([e.latlng.lat, e.latlng.lng], { icon: self.iconMark }).addTo(self.leafletMap);
      let coordinate: Coordinate = new Coordinate();
      coordinate.lat = e.latlng.lat;
      coordinate.lng = e.latlng.lng;
      mark.addEventListener('click', () => {
        self.isPopoverOpen = !self.isPopoverOpen;
        self.coordinate = coordinate;
      });
    }

    this.leafletMap.on('dblclick', onMapDoubleClick);

  }

  private configMap(): void {

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

      attribution: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

    }).addTo(this.leafletMap);

    let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    let osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });

    let baseMaps = {
      'OpenStreetMap': osm,
      'OpenStreetMap.HOT': osmHOT,
      Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS'
      }),

      Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS'
      }),

      'Topography, then places': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS,OSM-Overlay-WMS'
      }),

      'Places, then topography': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS,TOPO-WMS'
      })
    };

    let layerControl = L.control.layers(baseMaps).addTo(this.leafletMap);

    //baseMaps.Topography.addTo(this.leafletMap);

  }


  openPhotoContent($event: Boolean) {
    this.popOverPicOnClick();
    //this.popOverOnClick();
  }

  closePopOver($event: Boolean) {
    this.popOverOnClick();
  }


  closePopOverPic($event: Boolean) {
    this.popOverPicOnClick();
  }


  private checkPermissions(): void {

    this.geolocService.checkPermissions().subscribe(status => {
      console.log(status);
      if (status !== 'web' && (status.location !== 'granted' || status.coarseLocation !== 'granted')) {
        this.setOpen(true);
      }
    });

  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
