import { FullFilm } from '../model/FullFilm';
import { RecFilm } from '../model/RecFilm';
// use in film-info.component to wrap up the answer from server
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
  overview: string;
  recommendations: Array<RecFilm>;
  recoms_count: number;
  similars_count: number;
  recoms_pages_count: number;
  similar_pages_count: number;
  id: number;

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
      this.overview = jsonObj['overview'];
      this.recoms_count = jsonObj['recommendations']['total_results'];
      this.similars_count = jsonObj['similar']['total_results'];
      this.recoms_pages_count = jsonObj['recommendations']['total_pages'];
      this.similar_pages_count = jsonObj['similar']['total_pages'];
      this.id = jsonObj['id'];

      this.recommendations = new Array(0);
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
      this.overview = '';
      this.recoms_count = 0;
      this.similars_count = 0;
      this.recoms_pages_count = 0;
      this.similar_pages_count = 0;
      this.recommendations = new Array(0);
      this.id = -1;
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

  getRecomsCount() {
    return this.recoms_count;
  }
  getSimilarsCount() {
    return this.similars_count;
  }
  getSimilarPagesCount() {
    return this.similar_pages_count;
  }
  getRecomsPagesCount() {
    return this.recoms_pages_count;
  }

  addObjToRecoms(obj: Object): boolean {
    // don't add if film(obj) from Server has the same id as any already recommended
    for (let i = 0; i < this.recommendations.length; i++) {
      if (this.recommendations[i]) {
        if (this.recommendations[i].id === obj['id']) {
          return false;
        }
      }
    }
    // create new recommended film with data from object
    let recomFilm: RecFilm = {
      id: obj['id'],
      title: obj['title'],
      poster_path: 'https://image.tmdb.org/t/p/w92' + obj['poster_path'],
    };

    let l_1 = this.recommendations.length;
    // push this film to array
    let l_2 = this.recommendations.push(recomFilm);
    if (l_2 > l_1) return true;
    else return false;
  }
}
