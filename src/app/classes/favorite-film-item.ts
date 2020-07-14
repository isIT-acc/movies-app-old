import { FavoriteFilm } from '../model/FavoriteFilm';
import { Film } from '../model/Film';
import { FullFilm } from '../model/FullFilm';
// used by localStorageService to save the information about favorite film in localStorage
export class FavoriteFilmItem implements FavoriteFilm {
  id: number;
  title: string;
  genres_names: string;
  constructor(obj?: Film, obj1?: FullFilm) {
    if (obj) {
      this.id = obj.id;
      this.title = obj.title;
      this.genres_names = obj.genre_names;
    }
    if (obj1) {
      this.id = obj1.id;
      this.title = obj1.title;
      this.genres_names = obj1.genres;
    }
  }
}
