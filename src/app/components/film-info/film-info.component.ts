import { Component, OnInit } from '@angular/core';
import { FilmsService } from '../../services/films.service';
import { ActivatedRoute } from '@angular/Router';
import { FullFilm } from '../../model/FullFilm';
import { FilmInfo } from '../../classes/film-info';
@Component({
  selector: 'app-film-info',
  templateUrl: './film-info.component.html',
  styleUrls: ['./film-info.component.scss'],
})
export class FilmInfoComponent implements OnInit {
  film_info: FilmInfo;
  cur_id: string;

  btn_state: any = {
    filmInFavList: false,
    text: 'Add film', //remove film
    icon_name: 'add', //or remove
  };

  constructor(
    private filmsService: FilmsService,
    private route: ActivatedRoute
  ) {
    this.film_info = new FilmInfo();
  }

  ngOnInit(): void {
    this.cur_id = this.route.snapshot.params['id'];
    this.filmsService
      .getFilmWithAppendParam(this.cur_id, 'recommendations,similar')
      .subscribe((film) => {
        console.log(film);
        this.film_info = new FilmInfo(film);
        //get random page of recommendation films for current film
        this.addRandomFilmToStorage(7);
      });
  }

  addRandomFilmToStorage(times: number) {
    if (times === 0) return;
    this.filmsService
      .getFilmRecs(
        this.cur_id,
        this.getRandomPage(this.film_info.getRecomsPagesCount())
      )
      .subscribe((obj) => {
        //get random film from recommendations page and set its values to FilmInfo object
        this.film_info.addObjToRecoms(
          obj['results'][this.getRandomFilmForArr(obj['results'].length)]
        );
        this.addRandomFilmToStorage(--times);
      });
  }
  changeBtnState() {
    if (this.btn_state.filmInFavList) {
      this.btn_state.filmInFavList = false;
      this.btn_state.text = 'Add film'; //remove film
      this.btn_state.icon_name = 'add'; //or remove
    } else {
      this.btn_state.filmInFavList = true;
      this.btn_state.text = 'Remove film'; //remove film
      this.btn_state.icon_name = 'remove'; //or remove
    }
  }
  // getRandomFilm from 1 to num of films
  getRandomFilm(filmsNum: number): number {
    return Math.floor(Math.random() * filmsNum) + 1;
  }
  // getRandomFilm from 0 to num of films-1(return value is index of Array)
  getRandomFilmForArr(filmsNum: number): number {
    return Math.floor(Math.random() * filmsNum);
  }
  //from 1 to num of pages
  getRandomPage(pagesNum: number): number {
    return Math.floor(Math.random() * pagesNum) + 1;
  }
  getPageForFilm(filmNum: number) {
    return Math.floor(filmNum / 20) + 1;
  }
  onClick(evt) {
    this.changeBtnState();
    console.log(evt);
  }
}
