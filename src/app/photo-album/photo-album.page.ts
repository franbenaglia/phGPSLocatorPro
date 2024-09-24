import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonImg, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { PhotoService } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto } from '../model/userPhoto';
import { addIcons } from 'ionicons';
import { chevronForwardCircle } from 'ionicons/icons';
import { PhotoAlbumContainerComponent } from "../components/photo-album-container/photo-album-container.component";
import { IndexeddbService } from '../services/indexeddb.service';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.page.html',
  styleUrls: ['./photo-album.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonButtons, IonImg, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PhotoAlbumContainerComponent]
})
export class PhotoAlbumPage implements OnInit {

  constructor(private idbService: IndexeddbService, public photoService: PhotoService, private actionSheetController: ActionSheetController) {

    addIcons({ chevronForwardCircle });

  }

  async ngOnInit() {
    this.photoService.loadSaved();
    //TODO CALL ONLY IF coordinateCategorized IS EMPTY. AND CALL coordinateCategorized DIRECTLY
    //FROM TEMPLATE. UPDATE coordinateCategorized THROUGH SPECIALIZED METHOD EACH TIME ADD A NEW
    //MARK
    this.photoService.loadSavedCategorizedFromMarks();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.idbService.deletePhoto(photo);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }


}