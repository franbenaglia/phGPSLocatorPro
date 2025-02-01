import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IonGrid, IonRow, IonInput, IonButton, IonCard, IonCardHeader, IonIcon, IonCardContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { Coordinate } from 'src/app/model/coordinate';

@Component({
  selector: 'app-photo-content',
  templateUrl: './photo-content.component.html',
  styleUrls: ['./photo-content.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonIcon, IonCardHeader, IonCard, IonButton, IonInput, IonRow, IonGrid,]
})
export class PhotoContentComponent implements OnInit {

  @Input() coordinate: Coordinate;
  @Output() dismissPopOverPicEvent = new EventEmitter<Boolean>;

  image: any;

  constructor() {
    addIcons({ closeCircle });
  }

  ngOnInit() {

    if (!Capacitor.isNativePlatform()) {
      this.image = this.coordinate.photo.base64Data;
    } else {
      this.image = Capacitor.convertFileSrc(this.coordinate.photo.filepath);
    }
  }

  close() {
    this.dismissPopOverPicEvent.emit(true);
  }

}
