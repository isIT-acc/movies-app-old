import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FilmsService } from '../../services/films.service';
import { FilmsDataSource } from '../../services/films.datasource';
import { FavoriteFilmItem } from '../../classes/favorite-film-item';
import { LocalStorageService } from '../../services/local-storage.service';
import { AppFlashMessagesService } from '../../services/app-flash-messages.service';

import { Film } from '../../model/Film';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  searchString: string = '';

  paginatorOptions = {
    length: 1000,
    pageSize: 20,
    pageSizeOptions: [5, 10, 20],
  };

  dataSource: FilmsDataSource;

  displayedColumns: string[] = ['title', 'genre_names', 'favorites'];

  constructor(
    private appFlashMessageService: AppFlashMessagesService,
    private filmsService: FilmsService,
    private localStorageService: LocalStorageService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    // init dataSource by my realisation of DataSource<Film>, mat-table component is subscribing to the connect
    this.dataSource = new FilmsDataSource(
      this.filmsService,
      this.localStorageService
    );
    this.dataSource.length.subscribe((cur_length) => {
      this.paginatorOptions.length = cur_length;
    });
    this.dataSource.loadFilmsAndTheirCount(1, 0, 20);
  }

  // get number of page to load from server depends on paginator new state
  getNumOfPage(paginatorEvt: any) {
    // down logic work correctly only if pageSize<=20 and pageSize is divider of 20 without rest
    return (
      Math.trunc((paginatorEvt.pageIndex * paginatorEvt.pageSize) / 20) + 1
    );
  }
  // get index of first film to show on template depends on paginator new state
  getFirstIndex(paginatorEvt: any) {
    // down logic work correctly only if pageSize<=20 and pageSize is divider of 20 without rest
    return (paginatorEvt.pageIndex * paginatorEvt.pageSize) % 20;
  }
  // get index of last film to show on template depends on paginator new state
  getSecondIndex(paginatorEvt: any) {
    // down logic work correctly only if pageSize<=20 and pageSize is divider of 20 without rest
    return (
      ((paginatorEvt.pageIndex * paginatorEvt.pageSize) % 20) +
      paginatorEvt.pageSize
    );
  }
  ////
  ngAfterViewInit() {
    // subscribe to paginator events on template
    this.paginator.page.subscribe((evt) => {
      //case for stream without search, we just load one page of popular films from server
      if (this.searchString === '')
        this.dataSource.loadFilms(
          this.getNumOfPage(evt),
          this.getFirstIndex(evt),
          this.getSecondIndex(evt)
        );
      //case for stream with characters in search field, we load page of searched film by title
      else {
        this.dataSource.searchFilms(
          this.changeSpacesToPluses(),
          this.getNumOfPage(evt),
          this.getFirstIndex(evt),
          this.getSecondIndex(evt)
        );
      }
    });
  }
  // we change all spaces to pluses because thi is the query argument styling for searching movie on server
  changeSpacesToPluses(): string {
    return this.searchString.replace(/\s/g, '+');
  }
  // handler of search film input changes after key up on a keyboard
  onKey(evt) {
    if (evt.target.value === '') {
      this.onCloseSearchButton();
    }
    //when search first time show first page always
    this.paginator.pageIndex = 0;
    this.dataSource.searchFilmsAndTheirCount(
      this.changeSpacesToPluses(),
      0,
      this.paginatorOptions.pageSize
    );
  }
  // if close button is pressed, then get popular films from server
  onCloseSearchButton() {
    this.searchString = '';
    this.dataSource.loadFilmsAndTheirCount(
      1,
      0,
      this.paginatorOptions.pageSize
    );
  }
  // add or remove favorite film from localstorage
  clickOnIcon(film: Film) {
    if (!film.favorite) {
      this.localStorageService.addFavoriteFilm(new FavoriteFilmItem(film));
      film.favorite = true;
      this.appFlashMessageService.showAddMessage();
    } else {
      this.localStorageService.removeFavoriteFilm(new FavoriteFilmItem(film));
      film.favorite = false;
      this.appFlashMessageService.showRemoveMessage();
    }
  }
}
