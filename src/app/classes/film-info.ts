import { FullFilm } from '../model/FullFilm';
export class FilmInfo implements FullFilm {
  title: string;
  tagline: string;
  genres: string;
  runtime: string;
  original_language: string;
  production_countries: string;
  release_date: string;
  status: string;
  budget: string;
  vote_average: number;
  vote_count: string;
  constructor() {
    this.title = '';
    this.tagline = '';
    this.genres = '';
    this.runtime = '';
    this.original_language = '';
    this.production_countries = '';
    this.release_date = '';
    this.status = '';
    this.budget = '';
    this.vote_average = 0;
    this.vote_count = '';
  }
  setStrOfGenres(arr: Object[]) {
    arr.forEach((genre) => {
      if (this.genres == '') this.genres = genre['name'];
      else {
        this.genres.concat(', ');
      }
    });
  }
}
