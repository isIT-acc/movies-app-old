import { Component, OnInit } from '@angular/core';
import { FavoriteFilmItem } from '../../classes/favorite-film-item';
import { LocalStorageService } from '../../services/local-storage.service';
import { FavoriteFilm } from 'src/app/model/FavoriteFilm';
import { AppFlashMessagesService } from '../../services/app-flash-messages.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
// component of favorite films
export class FavoritesComponent implements OnInit {
  dataSource: Array<FavoriteFilmItem>;
  displayedColumns: Array<string> = ['title', 'genres_names', 'remove'];
  constructor(
    private localStorageService: LocalStorageService,
    private appFlashMessageService: AppFlashMessagesService
  ) {}

  ngOnInit(): void {
    // show all favorite films
    this.dataSource = this.localStorageService.getAllFavoriteFilms();
  }
  // handler to remove the film from localStorage  and template
  clickOnCloseIcon(film: FavoriteFilm) {
    if (confirm('Are you sure you want to remove film!')) {
      this.localStorageService.removeFavoriteFilm(film);
      this.dataSource = this.localStorageService.getAllFavoriteFilms();
      this.appFlashMessageService.showRemoveMessage();
    }
  }
}
