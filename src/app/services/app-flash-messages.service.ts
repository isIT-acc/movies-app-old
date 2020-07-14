import { Injectable } from '@angular/core';

import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable({
  providedIn: 'root',
})
export class AppFlashMessagesService {
  constructor(private flashMessageService: FlashMessagesService) {}

  showAddMessage() {
    this.flashMessageService.show('Film is added to favorites', {
      cssClass: 'added',
      timeout: 2000,
    });
  }
  showRemoveMessage() {
    this.flashMessageService.show('Film is removed from favorites', {
      cssClass: 'removed',
      timeout: 2000,
    });
  }
}
