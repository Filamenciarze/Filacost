import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

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
    NgIf,
    MatError
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(AppSettingsService.STRONG_PASSWORD_REGEX)]],
      confirmPassword: ['',[Validators.required, Validators.pattern(AppSettingsService.STRONG_PASSWORD_REGEX)]]
    }, {validators: this.passwordMatchValidator})
  }

  get email() {return this.registerForm.get('email');}
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword');}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if(password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({mismatch:true});
    }
    else {
      // Remove only mismatch error, not others
      if (confirmPassword?.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }


  register() {
    if(this.registerForm.valid) {
      this.authService.register(this.email?.value, this.password?.value).subscribe({
        next: () => {
          this.router.navigate(['login']).then(
            () => {
              this._snackBar.open("Account has been created", "Dismiss", {duration: 2000})
            }
          )
        },
        error: (error) => {
          console.log(error);
          this._snackBar.open(`Error: ${error.error.email}`, "Dismiss", {duration: 2000});
        }
      })
    }
  }

}
