import { Component, OnInit } from '@angular/core';
import { FilmsService } from '../../services/films.service';
import { ActivatedRoute, Router } from '@angular/Router';
import { FilmInfo } from '../../classes/film-info';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { FavoriteFilmItem } from '../../classes/favorite-film-item';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-film-info',
  templateUrl: './film-info.component.html',
  styleUrls: ['./film-info.component.scss'],
})
export class FilmInfoComponent implements OnInit {
  film_info: FilmInfo;
  film_id: string;

  btn_state: any = {
    favorite: false,
    text: 'Add to favorites', //remove film
    icon_name: 'add', //or remove
  };

  constructor(
    private flashMessageService: FlashMessagesService,
    private filmsService: FilmsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private localStorageService: LocalStorageService
  ) {
    this.film_info = new FilmInfo();
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.film_id = this.route.snapshot.params['id'];

    this.filmsService
      .getFilmWithAppendParam(this.film_id, 'recommendations,similar')
      .subscribe((film) => {
        console.log(film);
        this.film_info = new FilmInfo(film);

        this.setBtnState(
          this.localStorageService.isFavorite(
            new FavoriteFilmItem(null, this.film_info)
          )
        );

        //get random page of recommendation films for current film
        this.addRandomFilmToStorage(7);
      });
  }

  addRandomFilmToStorage(times: number) {
    if (times === 0) return;
    this.filmsService
      .getFilmRecs(
        this.film_id,
        this.getRandomNumOfPage(this.film_info.getRecomsPagesCount())
      )
      .subscribe((obj) => {
        //get random film from recommendations page and set its values to FilmInfo object
        this.film_info.addObjToRecoms(
          obj['results'][this.getRandomNumOfFilmForArr(obj['results'].length)]
        );
        this.addRandomFilmToStorage(--times);
      });
  }
  setBtnState(favorite: boolean) {
    if (favorite) {
      this.btn_state.favorite = true;
      this.btn_state.text = 'Remove from favorites'; //remove film
      this.btn_state.icon_name = 'remove'; //or remove
    } else {
      this.btn_state.favorite = false;
      this.btn_state.text = 'Add to favorites'; //remove film
      this.btn_state.icon_name = 'add'; //or remove
    }
  }
  changeBtnState() {
    if (this.btn_state.favorite) {
      this.btn_state.favorite = false;
      this.btn_state.text = 'Add to favorites '; //remove film
      this.btn_state.icon_name = 'add'; //or remove
    } else {
      this.btn_state.favorite = true;
      this.btn_state.text = 'Remove from favorites'; //remove film
      this.btn_state.icon_name = 'remove'; //or remove
    }
  }
  // getRandomNumOfFilm from 1 to num of films
  getRandomNumOfFilm(filmsNum: number): number {
    return Math.floor(Math.random() * filmsNum) + 1;
  }
  // getRandomNumOfFilm from 0 to num of films-1(return value is index of Array)
  getRandomNumOfFilmForArr(filmsNum: number): number {
    return Math.floor(Math.random() * filmsNum);
  }
  //from 1 to num of pages
  getRandomNumOfPage(pagesNum: number): number {
    return Math.floor(Math.random() * pagesNum) + 1;
  }

  addOrRemoveFavorite() {
    if (this.btn_state.favorite) {
      //remove
      this.localStorageService.removeFavoriteFilm(
        new FavoriteFilmItem(null, this.film_info)
      );
      this.showRemoveFlash();
    } else {
      // add
      this.localStorageService.addFavoriteFilm(
        new FavoriteFilmItem(null, this.film_info)
      );
      this.showAddFlash();
    }
    this.changeBtnState();
  }
  onRecFilmClick(id: number) {
    this.film_id = id.toString();
    this.location.replaceState(`/films/info/${this.film_id}`);
    this.router.navigateByUrl(`/films/info/${this.film_id}`);
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
