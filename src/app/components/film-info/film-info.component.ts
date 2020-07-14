import { Component, OnInit } from '@angular/core';
import { FilmsService } from '../../services/films.service';
import { ActivatedRoute, Router } from '@angular/Router';
import { FilmInfo } from '../../classes/film-info';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { FavoriteFilmItem } from '../../classes/favorite-film-item';
import { AppFlashMessagesService } from '../../services/app-flash-messages.service';
@Component({
  selector: 'app-film-info',
  templateUrl: './film-info.component.html',
  styleUrls: ['./film-info.component.scss'],
})
// component of information about film
export class FilmInfoComponent implements OnInit {
  film_info: FilmInfo; //for showing in template
  film_id: string; // string representation of current film_id
  // state of button to add or remove film to/from favorites
  btn_state: any = {
    favorite: false,
    text: 'Add to favorites', //remove film
    icon_name: 'add', //or remove
  };

  constructor(
    private appFlashMessageService: AppFlashMessagesService,
    private filmsService: FilmsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private localStorageService: LocalStorageService
  ) {
    this.film_info = new FilmInfo();
  }

  ngOnInit(): void {
    // it is used for routing to the same html with other id (to film from recommendations)
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    // get id from route after init this page to get info from server about this film
    this.film_id = this.route.snapshot.params['id'];
    // get this film info with recommendations and similar info
    this.filmsService
      .getFilmWithAppendParam(this.film_id, 'recommendations,similar')
      .subscribe((film) => {
        this.film_info = new FilmInfo(film);
        // set btn state depends on this film in local storage or not
        this.setBtnState(
          this.localStorageService.isFavorite(
            new FavoriteFilmItem(null, this.film_info)
          )
        );

        //
        this.addRandomFilmToStorage(7);
      });
  }
  // recursive method
  addRandomFilmToStorage(times: number) {
    if (times === 0) return;
    // get random number of page from count of recommended films pages
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
  // btn has two state add or remove
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
  // add or remove film to localstorage and change btn state on screen
  addOrRemoveFavorite() {
    if (this.btn_state.favorite) {
      //remove
      this.localStorageService.removeFavoriteFilm(
        new FavoriteFilmItem(null, this.film_info)
      );
      this.appFlashMessageService.showRemoveMessage();
    } else {
      // add
      this.localStorageService.addFavoriteFilm(
        new FavoriteFilmItem(null, this.film_info)
      );
      this.appFlashMessageService.showAddMessage();
    }
    this.changeBtnState();
  }

  // go to recommended film
  onRecFilmClick(id: number) {
    this.film_id = id.toString();
    this.location.replaceState(`/films/info/${this.film_id}`);
    this.router.navigateByUrl(`/films/info/${this.film_id}`);
  }
}
