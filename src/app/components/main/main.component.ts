import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FilmsService } from '../../services/films.service';
import { FilmsDataSource } from '../../services/films.datasource';
import { FavoriteFilmItem } from '../../classes/favorite-film-item';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LocalStorageService } from '../../services/local-storage.service';

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
    private flashMessageService: FlashMessagesService,
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
  // down logic work correctly only if pageSize<=20 and pageSize is divider of 20 without rest
  getNumOfPage(paginatorEvt: any) {
    return (
      Math.trunc((paginatorEvt.pageIndex * paginatorEvt.pageSize) / 20) + 1
    );
  }
  // down logic work correctly only if pageSize<=20 and pageSize is divider of 20 without rest
  getFirstIndex(paginatorEvt: any) {
    return (paginatorEvt.pageIndex * paginatorEvt.pageSize) % 20;
  }
  // down logic work correctly only if pageSize<=20 and pageSize is divider of 20 without rest
  getSecondIndex(paginatorEvt: any) {
    return (
      ((paginatorEvt.pageIndex * paginatorEvt.pageSize) % 20) +
      paginatorEvt.pageSize
    );
  }
  ////
  ngAfterViewInit() {
    this.paginator.page.subscribe((evt) => {
      //case for stream without search
      if (this.searchString === '')
        this.dataSource.loadFilms(
          this.getNumOfPage(evt),
          this.getFirstIndex(evt),
          this.getSecondIndex(evt)
        );
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
  changeSpacesToPluses(): string {
    return this.searchString.replace(/\s/g, '+');
  }
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

  onCloseSearchButton() {
    this.searchString = '';
    this.dataSource.loadFilmsAndTheirCount(
      1,
      0,
      this.paginatorOptions.pageSize
    );
  }

  clickOnIcon(film: Film) {
    console.log(film);
    if (!film.favorite) {
      this.localStorageService.addFavoriteFilm(new FavoriteFilmItem(film));
      film.favorite = true;
      this.showAddFlash();
    } else {
      this.localStorageService.removeFavoriteFilm(new FavoriteFilmItem(film));
      film.favorite = false;
      this.showRemoveFlash();
    }
  }
  showAddFlash() {
    this.flashMessageService.show('Film is added to favorites', {
      cssClass: 'added',
      timeout: 2000,
    });
  }
  showRemoveFlash() {
    this.flashMessageService.show('Film is removed from favorites', {
      cssClass: 'removed',
      timeout: 2000,
    });
  }
}
