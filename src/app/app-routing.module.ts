import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/Router';

import { FilmInfoComponent } from './components/film-info/film-info.component';
import { MainComponent } from './components/main/main.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { config } from 'process';

const routes: Routes = [
  {
    path: 'films',
    component: MainComponent,
  },
  {
    path: '',
    redirectTo: '/films',
    pathMatch: 'full',
  },
  {
    path: 'films/info/:id',
    component: FilmInfoComponent,
  },
  {
    path: 'films/favorites',
    component: FavoritesComponent,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
})
export class AppRoutingModule {}
