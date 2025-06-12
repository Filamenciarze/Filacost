import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {Router, RouterLink} from '@angular/router';
import {ListModelsService} from '../../services/list-models/list-models.service';
import {finalize} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DeleteModelDialogComponent} from '../../components/delete-model-dialog/delete-model-dialog.component';
import {BaseModel3D} from '../../interfaces/BaseModel3D';
import {PageableModel3D} from '../../interfaces/PageableModel3D';

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
    NgForOf,
    NgIf
  ]
})
export class ListModelsComponent implements OnInit {

  models: any = {} as PageableModel3D; //PageableModel3D
  currentPage: number = 1;
  totalPages: number = 1;

  _snackBar = inject(MatSnackBar);
  _dialog = inject(MatDialog);

  constructor(
    private listModelsService: ListModelsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadModels();
  }

  loadModels(): void {
    this.listModelsService.listModels(this.currentPage).subscribe(response => {
      this.models = response;
      this.totalPages = Math.ceil(response.count / response.results.length);
    });
  }

  deleteModel(model: BaseModel3D): void {
    let dialogRef = this._dialog.open(DeleteModelDialogComponent, {
      data: {id: model.print_id, filename: model.filename_display}
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this._snackBar.open("Model has been removed");
        this.models.results = this.models.results.filter((m: BaseModel3D): boolean => m.print_id !== model.print_id);
      }
    })
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadModels();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadModels();
    }
  }
}
