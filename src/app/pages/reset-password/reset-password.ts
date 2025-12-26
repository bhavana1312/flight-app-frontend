import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  success = signal('');
  error = signal('');
  token = '';

  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  passwordsDontMatch() {
    const p = this.form.value.password;
    const c = this.form.value.confirmPassword;
    return !!p && !!c && p !== c;
  }

  submit() {
    if (this.form.invalid || this.passwordsDontMatch() || !this.token) return;

    this.auth.resetPassword(this.token, this.form.value.password!).subscribe({
      next: () => {
        this.success.set('Password updated successfully');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => this.error.set('Invalid or expired link'),
    });
  }
}
