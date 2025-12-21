import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  changePassword() {
    this.successMsg = '';
    this.errorMsg = '';

    const pwd = this.passwordData.newPassword;

    if (pwd.length < 12) {
      this.errorMsg = 'Password must be at least 12 characters long';
      return;
    }

    if (!/[A-Z]/.test(pwd)) {
      this.errorMsg = 'Password must contain at least one uppercase letter';
      return;
    }

    if (!/[a-z]/.test(pwd)) {
      this.errorMsg = 'Password must contain at least one lowercase letter';
      return;
    }

    if (!/[0-9]/.test(pwd)) {
      this.errorMsg = 'Password must contain at least one number';
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]/.test(pwd)) {
      this.errorMsg = 'Password must contain at least one special character';
      return;
    }

    if (pwd !== this.passwordData.confirmPassword) {
      this.errorMsg = 'New password and confirm password do not match';
      return;
    }

    this.successMsg = 'Password changed successfully';
    this.resetForm();
  }

  resetForm() {
    this.passwordData = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }
}
