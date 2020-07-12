import { FullFilm } from '../model/FullFilm';
export class FilmInfo implements FullFilm {
  title: string;
  tagline: string;
  genres: string;
  runtime: string;
  original_language: string;
  release_date: string;
  status: string;
  budget: string;
  vote_average: number;
  vote_count: string;
  img_url: string;
  production_companies: Array<string>;
  production_countries: string;

  bg_img_url: string;
  constructor(jsonObj?: Object) {
    if (jsonObj) {
      this.setStrOfGenres(jsonObj['genres']);
      this.setStrOfCompanies(jsonObj);
      this.setStrOfCountries(jsonObj);
      this.title = jsonObj['title'];
      this.tagline = jsonObj['title'];
      this.runtime = jsonObj['runtime'];
      this.original_language = jsonObj['original_language'];
      this.release_date = jsonObj['release_date'];
      this.status = jsonObj['status'];
      this.budget = jsonObj['budget'];
      this.vote_average = jsonObj['vote_average'];
      this.vote_count = jsonObj['vote_count'];
      this.img_url = 'https://image.tmdb.org/t/p/w300' + jsonObj['poster_path'];
      this.bg_img_url =
        'https://image.tmdb.org/t/p/w1280' + jsonObj['backdrop_path'];
    } else {
      this.runtime = '';
      this.original_language = '';
      this.release_date = '';
      this.status = '';
      this.budget = '';
      this.vote_average = 0;
      this.vote_count = '';
      this.title = '';
      this.tagline = '';
      this.genres = '';
      this.production_companies = null;
      this.production_countries = '';
      this.img_url = 'https://image.tmdb.org/t/p/w300';
      this.bg_img_url = 'https://image.tmdb.org/t/p/w1280';
    }
  }

  setStrOfGenres(arr: Object[]) {
    this.genres = '';
    arr.forEach((genre) => {
      if (this.genres === '') this.genres = genre['name'];
      else this.genres = this.genres + ', ' + genre['name'];
    });
  }

  setStrOfCompanies(jsonObj: Object) {
    this.production_companies = new Array(
      jsonObj['production_companies'].length
    );
    jsonObj['production_companies'].forEach((company, index) => {
      if (company['origin_country'] !== '')
        this.production_companies[index] =
          company['name'] + '(' + company['origin_country'] + ')';
      else {
        this.production_companies[index] = company['name'];
      }
    });
  }
  setStrOfCountries(jsonObj: Object) {
    this.production_countries === '';
    jsonObj['production_countries'].forEach((country) => {
      if (this.production_countries === '')
        this.production_countries = country['iso_3166_1'];
      else {
        this.production_countries =
          this.production_countries + ', ' + country['iso_3166_1'];
      }
    });
  }
}
