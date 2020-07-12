import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  req_params: Object = {
    api_key: '3eb71cd42f58980962014e01b5dfda44',
    lang: 'en-US',
  };

  urlPopularFilms: string = 'https://api.themoviedb.org/3/movie/popular'; //url to popular fims
  urlGenres: string = 'https://api.themoviedb.org/3/genre/movie/list';
  urlFilm: string = 'https://api.themoviedb.org/3/movie/';
  urlSearchFilm: string = 'https://api.themoviedb.org/3/search/movie';

  constructor(private http: HttpClient) {}

  //get page of films
  getPageOfFilms(numOfPage: number): Observable<Object> {
    return this.http.get(this.urlPopularFilms, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang'])
        .set('page', `${numOfPage}`),
    });
  }

  getGenres(): Observable<Object> {
    return this.http.get(this.urlGenres, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang']),
    });
  }

  getFilm(id: string) {
    return this.http.get(this.urlFilm + `${id}`, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang']),
    });
  }

  searchFilms(title: string, numOfPage?: number) {
    console.log(title);
    return this.http.get(this.urlSearchFilm, {
      params: new HttpParams()
        .set('api_key', this.req_params['api_key'])
        .set('language', this.req_params['lang'])
        .set('query', title)
        .set('page', `${numOfPage}`),
    });
  }
}
