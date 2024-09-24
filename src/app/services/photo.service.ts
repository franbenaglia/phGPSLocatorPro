import { Injectable, provideExperimentalZonelessChangeDetection } from '@angular/core';

import { Camera, CameraResultType, CameraSource, GalleryPhotos, GalleryPhoto, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { UserPhoto } from '../model/userPhoto';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Observable, from, of } from 'rxjs';
import { StorageService } from './storage.service';
import { Coordinate } from '../model/coordinate';
import { CategoryService } from './category.service';
import { IndexeddbService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private idbService: IndexeddbService, private categoryService: CategoryService, private platform: Platform, private storageService: StorageService) {
  }

  public photos: UserPhoto[] = [];
  public coordinates: Coordinate[] = [];
  public coordinateCategorized: CoordinateCategory[] = [];

  private PHOTO_STORAGE: string = 'photos';

  public async getUserPhoto(): Promise<UserPhoto> {

    return this.userPhoto();

  }

  public async getImage(): Promise<UserPhoto> {

    const capturedPhoto: GalleryPhotos = await Camera.pickImages({
      quality: 100
    });

    let photo: GalleryPhoto = capturedPhoto.photos[0];

    return this.savePicture(photo);

  }

  public async addNewToGallery() {
    /*
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 100
        });
    
        const savedImageFile = await this.savePicture(capturedPhoto);
    */

    const savedImageFile = await this.userPhoto();

    this.idbService.addPhoto(savedImageFile);
    /*
        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos),
        });
        */

  }

  private async userPhoto(): Promise<UserPhoto> {

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    return this.savePicture(capturedPhoto);

  }

  public async addImageToGallery() {

    const capturedPhoto: GalleryPhotos = await Camera.pickImages({
      quality: 100
    });

    let photo: GalleryPhoto = capturedPhoto.photos[0];

    const savedImageFile = await this.savePicture(photo);
    //this.photos.unshift(savedImageFile);

    this.idbService.addPhoto(savedImageFile);

    /*
        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos),
        });
    */
  }

  private async savePicture(photo: Photo | GalleryPhoto) {

    const base64Data = await this.readAsBase64(photo);

    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      //https://stackoverflow.com/questions/67039901/how-to-copy-a-private-folder-with-content-to-public-directory-in-android-q-and-h
      directory: Directory.Data //https://github.com/ionic-team/capacitor/discussions/4487
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        //base64Data: base64Data, TODO SEE THAT
      };
    }
    else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
        base64Data: base64Data,
      };
    }
  }

  public loadSaved() {

    this.idbService.getPhotos().subscribe(ps => {

      this.photos = ps;

      /*
      if (!this.platform.is('hybrid')) {

        for (let photo of this.photos) {

          const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
          });

          photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        }
      }
        */

    });
  }

  public async loadSavedFromMarks() {

    const { value } = await this.storageService.getPositions();
    let coordinates = (value ? JSON.parse(value) : []) as Coordinate[];
    this.coordinates = coordinates.filter(c => c.photo);
    if (!this.platform.is('hybrid')) {

      for (let c of this.coordinates) {

        const readFile = await Filesystem.readFile({
          path: c.photo.filepath,
          directory: Directory.Data
        });

        c.photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }


  public loadSavedCategorizedFromMarks() {

    this.coordinateCategorized.length = 0;

    this.idbService.getPositions().subscribe(p => {

      let coordinates = p;
      this.coordinates = coordinates.filter(c => c.photo);

      /*
      if (!this.platform.is('hybrid')) {

        for (let c of this.coordinates) {

          const readFile = await Filesystem.readFile({
            path: c.photo.filepath,
            directory: Directory.Data
          });

          c.photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        }
      }
        */

      let categories: string[] = [];
      this.categoryService.getCategories().subscribe(cs => {
        categories.push(...JSON.parse(cs.value));
        categories.forEach(c => {
          let t = this.coordinates.filter(co => co.category === c && co.photo);
          if (t.length > 0) {
            let cCat: CoordinateCategory = {
              category: c,
              coordinates: this.coordinates.filter(co => co.category === c)
            }
            this.coordinateCategorized.push(cCat);
          }
        });
      });

    });

  }

  private async readAsBase64(photo: Photo | GalleryPhoto) {

    if (this.platform.is('hybrid')) {

      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    }
    else {

      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async deletePicture(photo: UserPhoto, position: number) {

    this.photos.splice(position, 1);


    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    const filename = photo.filepath
      .substr(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  public checkPermissions(): Observable<any> {

    if (this.platform.is('hybrid')) {
      return from(Camera.checkPermissions());
    } else {
      return of('web');
    }

  }


}

class CoordinateCategory {
  coordinates: Coordinate[];
  category: string;
}