import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Film } from '../model/Film';
import { FilmsService } from './films.service';
import { catchError, finalize, map } from 'rxjs/operators';

import { LocalStorageService } from './local-storage.service';

import { FavoriteFilmItem } from '../classes/favorite-film-item';

export class FilmsDataSource implements DataSource<Film> {
  private filmsSubject = new BehaviorSubject<Film[]>([]);
  private filmsCountSubject = new BehaviorSubject<number>(1000);

  length = this.filmsCountSubject.asObservable();

  constructor(
    private filmsService: FilmsService,
    private localStorageService: LocalStorageService
  ) {}
  // we should change genre ids in answer from server to genres names for each film
  addGenresToFilmsArr(films: Film[], genres) {
    genres['genres'].forEach((genre) => {
      films.forEach((film, j) => {
        if (
          film['genre_ids'].forEach((id, index) => {
            if (id === genre['id']) {
              if (film.genre_names) {
                film.genre_names = film.genre_names + ',' + genre['name'];
              } else {
                film.genre_names = genre['name'];
              }
            }
          })
        ) {
        }
      });
    });
  }
  //we have localStorage with favorite films ids and we should add to each film from server favorite flag(true or false) before its showing
  findAndCheckFavorites(films: Film[]) {
    films.forEach((film) => {
      if (this.localStorageService.isFavorite(new FavoriteFilmItem(film)))
        film.favorite = true;
      else film.favorite = false;
    });
  }
  //one page contains 20 films, (secondIndex-firstIndex):number of films to show now
  loadFilms(numOfPage: number, firstIndex: number, secondIndex: number) {
    this.filmsService
      .getPageOfFilms(numOfPage) //make req to api with filmsService
      //server returns Observable with array of films
      .subscribe((page_of_films) => {
        let films_from_server = page_of_films['results'].slice(
          firstIndex,
          secondIndex
        );
        // get list of genres
        this.filmsService.getGenres().subscribe((listOfGenres) => {
          this.addGenresToFilmsArr(films_from_server, listOfGenres);
          this.findAndCheckFavorites(films_from_server);
          this.filmsSubject.next(films_from_server);
        });
      });
  }
  //one page contains 20 films, (secondIndex-firstIndex):number of films to show now
  loadFilmsAndTheirCount(
    numOfPage: number,
    firstIndex: number,
    secondIndex: number
  ) {
    this.filmsService
      .getPageOfFilms(numOfPage) //make req to api with filmsService
      //server returns Observable with array of films
      .subscribe((page_of_films) => {
        let films_from_server = page_of_films['results'].slice(
          firstIndex,
          secondIndex
        );
        // get list of genres
        this.filmsService.getGenres().subscribe((listOfGenres) => {
          this.addGenresToFilmsArr(films_from_server, listOfGenres);
          this.findAndCheckFavorites(films_from_server);
          this.filmsSubject.next(films_from_server); //we throw this to behavior subject
        });
        this.filmsCountSubject.next(page_of_films['total_results']);
      });
  }
  // title of film is for searching
  //one page contains 20 films, (secondIndex-firstIndex):number of films to show now
  searchFilmsAndTheirCount(
    title: string,
    firstIndex: number,
    secondIndex: number
  ) {
    this.filmsService.searchFilms(title).subscribe((page_of_films) => {
      let films_from_server = page_of_films['results'].slice(
        firstIndex,
        secondIndex
      );
      // get list of genres
      this.filmsService.getGenres().subscribe((listOfGenres) => {
        this.addGenresToFilmsArr(films_from_server, listOfGenres);
        this.findAndCheckFavorites(films_from_server);
        this.filmsSubject.next(films_from_server); //we throw this to behavior subject
      });
      this.filmsCountSubject.next(page_of_films['total_results']);
    });
  }
  // title of film is for searching
  //one page contains 20 films, (secondIndex-firstIndex):number of films to show now
  searchFilms(
    title: string,
    numOfPage: number,
    firstIndex: number,
    secondIndex: number
  ) {
    this.filmsService
      .searchFilms(title, numOfPage)
      .subscribe((page_of_films) => {
        let films_from_server = page_of_films['results'].slice(
          firstIndex,
          secondIndex
        );
        // get list of genres
        this.filmsService.getGenres().subscribe((listOfGenres) => {
          this.addGenresToFilmsArr(films_from_server, listOfGenres);
          this.findAndCheckFavorites(films_from_server);
          this.filmsSubject.next(films_from_server); //we throw this to behavior subject
        });
      });
  }
  // abstract method of DataSource<Film> connect table and datasource (in template) once
  connect(collectionViewer: CollectionViewer): Observable<Film[]> {
    return this.filmsSubject.asObservable();
  }
  //abstract method of DataSource<Film>, disconnect table and datasource (in template) once
  disconnect(collectionViewer: CollectionViewer): void {
    this.filmsSubject.complete();
  }
}
