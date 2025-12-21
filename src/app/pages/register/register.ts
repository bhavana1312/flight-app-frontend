import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;

  successMessage = signal('');
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.successMessage.set('');
    this.errorMessage.set('');

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
      next: () => {
        this.successMessage.set('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        let msg = 'Registration failed';

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
