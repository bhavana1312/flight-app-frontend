import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  successMessage = signal('');
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.successMessage.set('');
    this.errorMessage.set('');

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        this.successMessage.set('Login successful');

        const role = res.roles?.[0];

        setTimeout(() => {
          if (role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin'], { replaceUrl: true });
          } else {
            this.router.navigate(['/profile'], { replaceUrl: true });
          }
        }, 600);
      },
      error: (err) => {
        let msg = 'Invalid credentials';

        if (typeof err.error === 'string') {
          try {
            const parsed = JSON.parse(err.error);
            msg = parsed.message || msg;
          } catch {
            msg = err.error;
          }
        } else if (err.error?.message) {
          msg = err.error.message;
        }

        this.errorMessage.set(msg);
      },
    });
  }
}
