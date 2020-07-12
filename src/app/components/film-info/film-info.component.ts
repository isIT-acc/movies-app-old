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
  img_url: string = 'https://image.tmdb.org/t/p/w300';
  bg_img_url: string = 'https://image.tmdb.org/t/p/w1280';

  btn_state: any = {
    filmInFavList: false,
    text: 'Add film', //remove film
    icon_name: 'add', //or remove
  };

  full_film: FullFilm;
  genres: string = '';
  // rating_string:

  constructor(
    private filmsService: FilmsService,
    private route: ActivatedRoute // route: ActivatedRoute // private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cur_id = this.route.snapshot.params['id'];
    this.filmsService.getFilm(this.cur_id).subscribe((film) => {
      this.img_url += film['poster_path'];
      this.setStrOfGenres(film['genres']);
      this.bg_img_url += film['backdrop_path'];

      this.full_film = film as FullFilm;
    });
  }
  setStrOfGenres(arr: Object[]) {
    arr.forEach((genre) => {
      if (this.genres == '') this.genres = genre['name'];
      else this.genres = this.genres + ', ' + genre['name'];
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
  onClick(evt) {
    this.changeBtnState();
    console.log(evt);
  }
}
