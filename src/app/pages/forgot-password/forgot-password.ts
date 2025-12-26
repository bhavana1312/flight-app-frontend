import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  success = signal('');
  error = signal('');

  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.success.set('');
    this.error.set('');

    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: () => this.success.set('If the email exists, a reset link has been sent'),
      error: () => this.error.set('Something went wrong'),
    });
  }
}
