import { Injectable } from '@angular/core';
import { FavoriteFilm } from '../model/FavoriteFilm';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {
    if (localStorage.getItem('films') === null)
      localStorage.setItem('films', JSON.stringify(new Array<FavoriteFilm>()));
  }
  addFavoriteFilm(film: FavoriteFilm) {
    let arr = this.getAllFavoriteFilms();
    arr.push(film);
    localStorage.setItem('films', JSON.stringify(arr));
  }
  getAllFavoriteFilms(): Array<FavoriteFilm> {
    return JSON.parse(localStorage.getItem('films'));
  }
  removeFavoriteFilm(film: FavoriteFilm) {
    let films = this.getAllFavoriteFilms();
    for (let i = 0; i < films.length; i++) {
      if (films[i].id === film.id) {
        films.splice(i, 1);
        localStorage.setItem('films', JSON.stringify(films));
        return;
      }
    }
  }
  isFavorite(film: FavoriteFilm): boolean {
    let films = this.getAllFavoriteFilms();
    for (let i = 0; i < films.length; i++) {
      if (films[i].id === film.id) {
        return true;
      }
    }
    return false;
  }
}
