import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonInput, IonButton, IonToast } from '@ionic/angular/standalone';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
  standalone: true,
  imports: [IonToast, IonButton, IonInput, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConfigurationPage implements OnInit {


  constructor(private categoryService: CategoryService) { }

  category: string;

  isToastOpen = false;

  ngOnInit() {
  }

  categoryHandler() {
    if (this.category) {
      this.categoryService.categoryExist(this.category).subscribe(e => {
        if (!e) {
          this.categoryService.addCategory(this.category);
          this.setOpen(true);
        } else {
          this.setOpen(false)
        }
        this.category = '';
      }
      );
    }

  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
