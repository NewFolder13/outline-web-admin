import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/access-keys/access-keys.routes').then(({routes}) => routes)
  }
];
