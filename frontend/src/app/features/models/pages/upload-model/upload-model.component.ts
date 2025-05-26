import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext} from '@angular/material/stepper';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatChip} from '@angular/material/chips';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-upload-model',
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    MatChip,
    NgIf,
    MatButton,
    MatStepperNext
  ],
  templateUrl: './upload-model.component.html',
  standalone: true,
  styleUrl: './upload-model.component.scss'
})
export class UploadModelComponent {
  fileForm: FormGroup;
  metaDataForm: FormGroup;
  file: File | null = null;
  fileName: string = '';

  constructor(
    private fb: FormBuilder,
  ) {
    this.fileForm = this.fb.group({
      file: [null, Validators.required],
    });
    this.metaDataForm = this.fb.group({})
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      console.log(this.file?.size);
      this.fileForm.patchValue({ file: input.files[0] });
      this.fileName = this.file.name;
    }
  }

  removeFile(): void {
    this.file = null;
    this.fileName = '';
  }
}
