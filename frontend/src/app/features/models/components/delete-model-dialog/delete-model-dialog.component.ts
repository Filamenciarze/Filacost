import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {ListModelsService} from '../../services/list-models/list-models.service';
import {BaseModel3D} from '../../interfaces/BaseModel3D';

@Component({
  selector: 'app-delete-model-dialog',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatDialogTitle,
    MatButton
  ],
  templateUrl: './delete-model-dialog.component.html',
  standalone: true,
  styleUrl: './delete-model-dialog.component.scss'
})
export class DeleteModelDialogComponent implements OnInit {

  constructor(
    private listModelService: ListModelsService,
    public dialogRef: MatDialogRef<DeleteModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }



  onYesClick() {
    console.log(this.data);
    this.listModelService.deleteModel(this.data.id).subscribe({
      next: result => {
        this.dialogRef.close(true);
      },
      error: err => {}
    });
    return true;
  }

  onNoClick() {
    return false;
  }

  ngOnInit(): void {
    console.log(this.data);
  }
}
