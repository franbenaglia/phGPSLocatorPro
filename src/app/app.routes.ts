import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/map',
    pathMatch: 'full',
  },
  {
    path: 'folder/map',
    loadComponent: () => import('./map/map.page').then(m => m.MapPage)
  },
  {
    path: 'folder/configuration',
    loadComponent: () => import('./configuration/configuration.page').then(m => m.ConfigurationPage)
  },
  {
    path: 'folder/import',
    loadComponent: () => import('./import/import.page').then(m => m.ImportPage)
  },
  {
    path: 'folder/export',
    loadComponent: () => import('./export/export.page').then(m => m.ExportPage)
  },
  {
    path: 'folder/photo-album',
    loadComponent: () => import('./photo-album/photo-album.page').then(m => m.PhotoAlbumPage)
  },
  {
    path: 'folder/category',
    loadComponent: () => import('./category/category.page').then(m => m.CategoryPage)
  },
  {
    path: 'folder/photo',
    loadComponent: () => import('./photo/photo.page').then( m => m.PhotoPage)
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },

];
