
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/public-gallery/public-gallery.component').then(m => m.PublicGalleryComponent),
    pathMatch: 'full',
  },
  {
    path: 'p/:slug',
    loadComponent: () => import('./components/image-detail/image-detail.component').then(m => m.ImageDetailComponent),
  },
  {
    path: 'server-internal-access',
    loadComponent: () => import('./components/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
