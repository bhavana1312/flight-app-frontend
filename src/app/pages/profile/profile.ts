import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  successMsg = '';
  errorMsg = '';

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService) {}

  changePassword() {
    this.successMsg = '';
    this.errorMsg = '';

    const pwd = this.passwordData.newPassword;

    if (pwd.length < 12) {
      this.errorMsg = 'Password must be at least 12 characters long';
      return;
    }

    if (
      !/[A-Z]/.test(pwd) ||
      !/[a-z]/.test(pwd) ||
      !/[0-9]/.test(pwd) ||
      !/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]/.test(pwd)
    ) {
      this.errorMsg =
        'Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character';
      return;
    }

    if (pwd !== this.passwordData.confirmPassword) {
      this.errorMsg = 'New password and confirm password do not match';
      return;
    }

    this.authService
      .changePassword(this.passwordData.oldPassword, this.passwordData.newPassword)
      .subscribe({
        next: () => {
          this.successMsg = 'Password changed successfully';
          this.resetForm();
        },
        error: (err) => {
          this.errorMsg = err?.error?.message || 'Failed to change password';
        },
      });
  }

  resetForm() {
    this.passwordData = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }
}
