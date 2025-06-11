import {Component, OnInit} from '@angular/core';
import {DatePipe, DecimalPipe, NgForOf} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {RouterLink} from '@angular/router';
import {ListModelsService} from '../../services/list-models/list-models.service';
import {PageableModel3D} from '../../interfaces/ExtendedModel3D';
import {BaseModel3D} from '../../interfaces/BaseModel3D';

@Component({
  selector: 'app-list-models',
  templateUrl: './list-models.component.html',
  styleUrl: './list-models.component.scss',
  standalone: true,
  imports: [
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    RouterLink,
    DatePipe,
    DecimalPipe,
    NgForOf
  ]
})
export class ListModelsComponent implements OnInit {

  models!: PageableModel3D;
  pagedModels!: BaseModel3D[];

  currentPage = 1;
  pageSize = 6; // ilość modeli na stronę
  totalPages = 1;

  constructor(
    private listModelsService: ListModelsService,
  ) {
  }

  ngOnInit() {
    this.loadModels();

    this.totalPages = Math.ceil(this.models.count / this.pageSize);
    this.updatePagedModels();
  }

  loadModels() {
    this.listModelsService.listModels().subscribe({
      next: data => {
        this.models = data;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  updatePagedModels() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedModels = this.models.results.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedModels();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedModels();
    }
  }
}
