import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatChip} from '@angular/material/chips';
import {DecimalPipe, NgIf} from '@angular/common';
import {UploadModelService} from '../../services/upload-model/upload-model.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {finalize} from 'rxjs';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload-model',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    MatChip,
    NgIf,
    MatButton,
    DecimalPipe,
    ReactiveFormsModule,
    MatError,
    MatProgressBar,
  ],
  templateUrl: './upload-model.component.html',
  standalone: true,
  styleUrl: './upload-model.component.scss'
})
export class UploadModelComponent {
  uploadForm: FormGroup;

  file: File | null = null;
  fileName: string = '';
  isLoading: boolean = false;
  uploadProgress = 0;



  constructor(
    private fb: FormBuilder,
    private uploadModelService: UploadModelService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      filenameDisplay: ['', Validators.required],
      printFill: [0.15, Validators.required],
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      console.log(this.file);
      this.uploadForm.patchValue({ file: input.files[0] });
      this.uploadForm.patchValue({ filenameDisplay: input.files[0].name });
      this.fileName = this.file.name;
    }
  }

  removeFile(): void {
    this.file = null;
    this.fileName = '';
  }

  onSubmit(): void {
    if(this.uploadForm.valid) {
      this.isLoading = true
      this.uploadModelService.sendModel(
        this.uploadForm.value.file,
        this.uploadForm.value.filenameDisplay,
        this.uploadForm.value.printFill,
      )
        .pipe(finalize(() => {
          this.isLoading=false;
          this.router.navigateByUrl('/models');
        }))
        .subscribe({
          next: (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                if (event.total) {
                  this.uploadProgress = Math.round(100 * event.loaded / event.total);
                }
                break;
              case HttpEventType.Response:
                console.log('Upload completed successfully!', event.body);
                // Tu możesz dodać np. snackbar z sukcesem
                break;
            }
          }
        })
    }
  }
}
