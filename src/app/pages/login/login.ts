import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (res) => {
        console.log('Login success', res);
        alert('Login successful');
      },
      error: (err) => {
        console.error(err);
        alert('Invalid username or password');
      },
    });
  }
}
