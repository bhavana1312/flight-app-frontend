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

  showOld = false;
  showNew = false;
  showConfirm = false;

  passwordStrength = 0;
  strengthLabel = 'Weak';

  passwordRules = {
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  };

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService) {}

  onPasswordInput() {
    const pwd = this.passwordData.newPassword;

    this.passwordRules.length = pwd.length >= 12;
    this.passwordRules.uppercase = /[A-Z]/.test(pwd);
    this.passwordRules.lowercase = /[a-z]/.test(pwd);
    this.passwordRules.digit = /[0-9]/.test(pwd);
    this.passwordRules.special = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]/.test(pwd);

    const passedRules = Object.values(this.passwordRules).filter((v) => v).length;
    this.passwordStrength = passedRules;

    if (passedRules <= 2) this.strengthLabel = 'Weak';
    else if (passedRules === 3 || passedRules === 4) this.strengthLabel = 'Medium';
    else this.strengthLabel = 'Strong';
  }

  changePassword() {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.passwordStrength < 5) {
      this.errorMsg = 'Password does not meet all requirements';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
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
    this.passwordStrength = 0;
    this.strengthLabel = 'Weak';
    Object.keys(this.passwordRules).forEach(
      (k) => (this.passwordRules[k as keyof typeof this.passwordRules] = false)
    );
  }
}
