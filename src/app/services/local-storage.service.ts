import { Injectable } from '@angular/core';
import { Film } from '../model/Film';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {
    if (localStorage.getItem('films') === null)
      localStorage.setItem('films', JSON.stringify(new Array<number>()));
  }
  addFilm(filmId: number) {
    let arr = this.getAllFilms();
    arr.push(filmId);
    localStorage.setItem('films', JSON.stringify(arr));
  }
  getAllFilms(): Array<number> {
    return JSON.parse(localStorage.getItem('films'));
  }
  removeFilm(filmId: number) {
    let films = this.getAllFilms();
    for (let i = 0; i < films.length; i++) {
      if (films[i] === filmId) {
        films.splice(i, 1);
        localStorage.setItem('films', JSON.stringify(films));
        return;
      }
    }
  }
  isFavorite(filmId: number): boolean {
    let films = this.getAllFilms();
    for (let i = 0; i < films.length; i++) {
      if (films[i] === filmId) {
        return true;
      }
    }
    return false;
  }
}
