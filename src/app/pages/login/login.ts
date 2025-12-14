import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (res) => {
        console.log('Login success', res);
        alert('Login successful');
        const role = res.roles[0];
        console.log(role);

        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin'], { replaceUrl: true });
        } else {
          this.router.navigate(['/booking'], { replaceUrl: true });
        }
      },
      error: (err) => {
        const msg = err?.error || 'Invalid Username or Password';
        alert(msg);
      },
    });
  }
}
