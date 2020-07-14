import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
// it's used for working with server
export class FilmsService {
  req_params: Object = {
    // my own api key
    api_key: '3eb71cd42f58980962014e01b5dfda44',
    lang: 'en-US',
  };

  urlPopularFilms: string = 'https://api.themoviedb.org/3/movie/popular'; //url to popular fims
  urlGenres: string = 'https://api.themoviedb.org/3/genre/movie/list';
  urlFilm: string = 'https://api.themoviedb.org/3/movie/';
  urlSearchFilm: string = 'https://api.themoviedb.org/3/search/movie'; //url to fims for searching

  constructor(private http: HttpClient) {}

  //get page of popular films
  getPageOfFilms(numOfPage: number): Observable<Object> {
    return this.http.get(this.urlPopularFilms, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang'])
        .set('page', `${numOfPage}`),
    });
  }
  // get list of genres(Object{genre_id:genre_name})
  getGenres(): Observable<Object> {
    return this.http.get(this.urlGenres, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang']),
    });
  }
  //add to url of get /append_to_response and return answer of two queries after once get in one
  //if append_to_response=string,string
  // return answer of three queries after once get in one
  getFilmWithAppendParam(id: string, append_to_response?: string) {
    return this.http.get(this.urlFilm + `${id}`, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang'])
        .set('append_to_response', append_to_response),
    });
  }
  // get recommendations to movie with certain id
  getFilmRecs(id: string, pageNum: number) {
    return this.http.get(this.urlFilm + `${id}` + '/recommendations', {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang'])
        .set('page', `${pageNum}`),
    });
  }
  // get similars to movie with certain id
  getFilmSimilars(id: string, pageNum: number) {
    return this.http.get(this.urlFilm + `${id}` + '/similar', {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang'])
        .set('page', `${pageNum}`),
    });
  }
  // search film by title
  searchFilms(title: string, numOfPage?: number) {
    return this.http.get(this.urlSearchFilm, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang'])
        .set('query', title)
        .set('page', `${numOfPage}`),
    });
  }
}
