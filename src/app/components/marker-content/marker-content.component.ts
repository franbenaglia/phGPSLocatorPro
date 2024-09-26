import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSelectOption, IonSelect, IonGrid, IonRow, IonLabel, IonInput, IonItem, IonButton, IonCard, IonCardContent, IonCardHeader, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { closeCircle, trashOutline, arrowUpOutline, cloudUploadOutline, imageOutline } from 'ionicons/icons';
import { from } from 'rxjs';
import { Coordinate } from 'src/app/model/coordinate';
import { UserPhoto } from 'src/app/model/userPhoto';
import { CategoryService } from 'src/app/services/category.service';
import { PhotoService } from 'src/app/services/photo.service';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-marker-content',
  templateUrl: './marker-content.component.html',
  styleUrls: ['./marker-content.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSelect, IonSelectOption, IonIcon, IonCardHeader, IonCardContent, IonCard, IonButton, IonItem, IonInput, IonLabel, IonRow, IonGrid, FormsModule, ReactiveFormsModule]
})
export class MarkerContentComponent implements OnInit {


  constructor(public categoryService: CategoryService, private router: Router, private photoService: PhotoService,
    private storageService: StorageService) {
    addIcons({ closeCircle, cloudUploadOutline, imageOutline, trashOutline, arrowUpOutline });
  }

  @Input() coordinate: Coordinate;
  @Output() dismissPopOverEvent = new EventEmitter<Boolean>;
  @Output() openPhotoContent = new EventEmitter<Boolean>;
  private image: UserPhoto;
  private category: string = 'General';
  categories: string[] = [];

  private urllocalserver: string = environment.localserver;

  ngOnInit() {
    this.load();
    this.getCategories();
  }

  public form = new FormGroup({
    "title": new FormControl("", Validators.required),
    "description": new FormControl("", Validators.required),
  });

  onSubmit() {

    let exist: any;
    let coordinates: Coordinate[];

    from(this.storageService.getPositions()).subscribe(ms => {

      coordinates = ms;

      if (coordinates) {
        exist = coordinates.find(c => c.lat === this.coordinate.lat && c.lng === this.coordinate.lng);
      }

      let title = this.form.controls['title'].value;
      let description = this.form.controls['description'].value;

      this.coordinate.description = description;
      this.coordinate.title = title;
      this.coordinate.photo = this.image;
      this.coordinate.date = new Date();
      this.coordinate.category = this.category;

      if (!exist) {
        this.storageService.addNewPosition(this.coordinate);
      } else {
        this.storageService.updatePosition(this.coordinate);
      }

      this.dismissPopOverEvent.emit(true);

    });

  }

  onChange($event) {
    this.category = $event.target.value;
  }

  load() {
    this.form.patchValue({
      title: this.coordinate!.title,
      description: this.coordinate!.description,
    });
  }

  async upLoadPhoto() {
    this.image = await this.photoService.getUserPhoto();
  }

  async upLoadImage() {
    this.image = await this.photoService.getImage();
  }


  showPhoto() {
    this.openPhotoContent.emit(true);
  }

  close() {
    this.dismissPopOverEvent.emit(true);
  }

  async delete() {
    await this.storageService.deletePosition(this.coordinate);
    //this.dismissPopOverEvent.emit(true);
    window.location.assign(this.urllocalserver);
  }

  notImage(): boolean {
    return !this.coordinate.photo;
  }

  getCategories(): void {

    this.categoryService.getCategories().subscribe(cs => {
      this.categories.push(...JSON.parse(cs.value))
    }
    );


  }


}