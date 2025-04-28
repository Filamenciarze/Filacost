import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    MatButton,
    MatCard,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(AppSettingsService.STRONG_PASSWORD_REGEX)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(9)]],
    })
  }


  register() {

  }

}
