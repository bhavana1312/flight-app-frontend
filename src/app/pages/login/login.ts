import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Validators } from '@angular/forms';
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
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        this.successMessage = 'Login successful';
        const role = res.roles[0];

        setTimeout(() => {
          if (role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin'], { replaceUrl: true });
          } else {
            this.router.navigate(['/booking'], { replaceUrl: true });
          }
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err?.error || 'Invalid Credentials';
      },
    });
  }
}
