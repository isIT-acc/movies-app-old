import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FilmsService } from '../../services/films.service';
import { FilmsDataSource } from '../../services/films.datasource';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  paginatorOptions = {
    length: 1000,
    pageSize: 20,
    pageSizeOptions: [5, 7, 10, 20],
  };

  dataSource: FilmsDataSource;

  displayedColumns: string[] = ['original_title', 'genre_names'];

  constructor(private filmsService: FilmsService) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    // init dataSource by my realisation of DataSource<Film>, mat-table component is subscribing to the connect
    this.dataSource = new FilmsDataSource(this.filmsService);
    this.dataSource.length.subscribe((cur_length) => {
      this.paginatorOptions.length = cur_length;
    });
    this.dataSource.loadFilmsAndTheirCount(1, 0, 20);
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((evt) => {
      console.log(evt);

      // down logic work correctly only if pageSize<=20 and pageSize is divider of 20 without rest
      if (evt.pageSize <= 20) {
        this.dataSource.loadFilms(
          Math.trunc((evt.pageIndex * evt.pageSize) / 20) + 1,
          (evt.pageIndex * evt.pageSize) % 20,
          ((evt.pageIndex * evt.pageSize) % 20) + evt.pageSize
        );
      }
    });
  }

  // onRowClicked(row) {
  //   // row contains object(movie)
  //   console.log(row);
  // }
  // handlePage(e: any) {
  //   console.log(e);
  // }
}
