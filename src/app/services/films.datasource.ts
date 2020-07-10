import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Film } from '../model/Film';
import { FilmsService } from './films.service';
import { catchError, finalize, map } from 'rxjs/operators';

export class FilmsDataSource implements DataSource<Film> {
  private filmsSubject = new BehaviorSubject<Film[]>([]);
  private filmsCountSubject = new BehaviorSubject<number>(1000);

  length = this.filmsCountSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private filmsService: FilmsService) {}

  loadFilms(numOfPage: number, firstIndex: number, secondIndex: number) {
    //one page contains 20 films, (secondIndex-firstIndex):number of films to show now
    this.loadingSubject.next(true);

    this.filmsService
      .getPageOfFilms(numOfPage) //make req to api with filmsService
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ) //server returns Observable with array of films
      .subscribe((page_of_films) => {
        let films_from_server = page_of_films['results'].slice(
          firstIndex,
          secondIndex
        );

        // get list of genres
        this.filmsService.getGenres().subscribe((listOfGenres) => {
          console.log(listOfGenres);

          listOfGenres['genres'].forEach((genre) => {
            films_from_server.forEach((film, j) => {
              if (
                film['genre_ids'].forEach((id, index) => {
                  if (id === genre['id']) {
                    // remove id that was changed
                    film['genre_ids'].splice(index, 1);

                    // console.log(id, genre['id'], genre['name']);
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
          console.log(films_from_server);

          this.filmsSubject.next(
            // change array of genres-numbers to genres-strings

            films_from_server
          ); //we throw this to behavior subject
        });
      });
  }

  loadFilmsAndTheirCount(
    numOfPage: number,
    firstIndex: number,
    secondIndex: number
  ) {
    //one page contains 20 films, (secondIndex-firstIndex):number of films to show now
    this.loadingSubject.next(true);

    this.filmsService
      .getPageOfFilms(numOfPage) //make req to api with filmsService
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ) //server returns Observable with array of films
      .subscribe((page_of_films) => {
        let films_from_server = page_of_films['results'].slice(
          firstIndex,
          secondIndex
        );

        // get list of genres
        this.filmsService.getGenres().subscribe((listOfGenres) => {
          console.log(listOfGenres);

          listOfGenres['genres'].forEach((genre) => {
            films_from_server.forEach((film, j) => {
              if (
                film['genre_ids'].forEach((id, index) => {
                  if (id === genre['id']) {
                    // remove id that was changed
                    film['genre_ids'].splice(index, 1);

                    // console.log(id, genre['id'], genre['name']);
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
          console.log(films_from_server);

          this.filmsSubject.next(
            // change array of genres-numbers to genres-strings

            films_from_server
          ); //we throw this to behavior subject
        });
        this.filmsCountSubject.next(page_of_films['total_results']);
      });
  }
  // abstract method of DataSource<Film> connect table and data source once
  connect(collectionViewer: CollectionViewer): Observable<Film[]> {
    console.log('Connecting data source');
    return this.filmsSubject.asObservable();
  }
  //abstract method of DataSource<Film>, disconnect table and data source once
  disconnect(collectionViewer: CollectionViewer): void {
    this.filmsSubject.complete();
    this.loadingSubject.complete();
  }
}
