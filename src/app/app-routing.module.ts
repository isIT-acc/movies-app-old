import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/Router';

import { FilmInfoComponent } from './components/film-info/film-info.component';
import { MainComponent } from './components/main/main.component';

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
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
