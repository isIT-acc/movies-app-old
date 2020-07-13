import { Component, OnInit } from '@angular/core';
import { FavoriteFilmItem } from '../../classes/favorite-film-item';
import { LocalStorageService } from '../../services/local-storage.service';
import { FavoriteFilm } from 'src/app/model/FavoriteFilm';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  dataSource: Array<FavoriteFilmItem>;
  displayedColumns: Array<string> = ['title', 'genres_names', 'remove'];
  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.dataSource = this.localStorageService.getAllFavoriteFilms();
  }

  clickOnCloseIcon(film: FavoriteFilm) {
    this.localStorageService.removeFavoriteFilm(film);
    this.dataSource = this.localStorageService.getAllFavoriteFilms();
  }
}
