import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Film } from '../model/Film';
import { FilmsService } from './films.service';
import { catchError, finalize, map } from 'rxjs/operators';

export class FilmsDataSource implements DataSource<Film> {
  private filmsSubject = new BehaviorSubject<Film[]>([]);
  private filmsCountSubject = new BehaviorSubject<number>(1000);

  length = this.filmsCountSubject.asObservable();

  constructor(private filmsService: FilmsService) {}

  addGenresToFilmsArr(films: Film[], genres) {
    genres['genres'].forEach((genre) => {
      films.forEach((film, j) => {
        if (
          film['genre_ids'].forEach((id, index) => {
            if (id === genre['id']) {
              // remove id that was changed
              // film['genre_ids'].splice(index, 1);

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
  }

  loadFilms(numOfPage: number, firstIndex: number, secondIndex: number) {
    //one page contains 20 films, (secondIndex-firstIndex):number of films to show now

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
          this.filmsSubject.next(films_from_server);
        });
      });
  }

  loadFilmsAndTheirCount(
    numOfPage: number,
    firstIndex: number,
    secondIndex: number
  ) {
    //one page contains 20 films, (secondIndex-firstIndex):number of films to show now

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
          this.filmsSubject.next(films_from_server); //we throw this to behavior subject
        });
        this.filmsCountSubject.next(page_of_films['total_results']);
      });
  }

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
        this.filmsSubject.next(films_from_server); //we throw this to behavior subject
        console.log(films_from_server);
      });
      this.filmsCountSubject.next(page_of_films['total_results']);
    });
  }
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
          this.filmsSubject.next(films_from_server); //we throw this to behavior subject
          console.log(films_from_server);
        });
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
  }
}
