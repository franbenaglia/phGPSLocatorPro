import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonHeader, IonButtons, IonMenuButton, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp } from 'ionicons/icons';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonMenuButton, IonButtons, IonHeader, RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Map', url: '/folder/map', icon: 'paper-plane' },
    { title: 'Photo shoot', url: '/folder/photo', icon: 'paper-plane' },
    { title: 'Configuration', url: '/folder/configuration', icon: 'paper-plane' },
    { title: 'Import', url: '/folder/import', icon: 'paper-plane' },
    { title: 'Export', url: '/folder/export', icon: 'paper-plane' },
    { title: 'Photo-album', url: '/folder/photo-album', icon: 'paper-plane' },
    //{ title: 'Category', url: '/folder/category', icon: 'paper-plane' },

  ];
  constructor() {
    addIcons({ paperPlaneOutline, paperPlaneSharp });
  }
  async ngOnInit() {
    await SplashScreen.show({
      showDuration: 5000,
      autoHide: true,
    });
  }
}
