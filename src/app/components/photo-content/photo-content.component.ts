import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

    //this.image = this.coordinate.photo;
    this.image = this.coordinate.photo.base64Data;

  }

  close() {
    this.dismissPopOverPicEvent.emit(true);
  }

}
