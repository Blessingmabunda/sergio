import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  dashboard: boolean;
  reports: boolean;
  analytics: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  passwordExpiry: number;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  cookies: boolean;
  profileVisibility: 'public' | 'private' | 'team';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatChipsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  isSaving = false;

  // Forms
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Settings
  notificationSettings: NotificationSettings = {
    email: true,
    push: true,
    sms: false,
    dashboard: true,
    reports: true,
    analytics: false
  };

  securitySettings: SecuritySettings = {
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordExpiry: 90
  };

  appearanceSettings: AppearanceSettings = {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD'
  };

  privacySettings: PrivacySettings = {
    dataSharing: false,
    analytics: true,
    cookies: true,
    profileVisibility: 'team'
  };

  // Options
  languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
  ];

  timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' }
  ];

  currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' },
    { value: 'CNY', label: 'Chinese Yuan (¥)' }
  ];

  sessionTimeouts = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' }
  ];

  passwordExpiries = [
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' },
    { value: 180, label: '6 months' },
    { value: 365, label: '1 year' },
    { value: 0, label: 'Never' }
  ];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      jobTitle: [''],
      department: [''],
      bio: ['', [Validators.maxLength(500)]]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadSettings();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: '',
        jobTitle: '',
        department: this.currentUser.company || '',
        bio: ''
      });
    }
    
    this.isLoading = false;
  }

  loadSettings(): void {
    // In a real app, these would be loaded from a service
    // For now, we'll use the default values
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSaving = false;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isSaving = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSaving = false;
        this.passwordForm.reset();
        this.snackBar.open('Password changed successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, 1000);
    }
  }

  saveNotificationSettings(): void {
    this.isSaving = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Notification settings saved', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 500);
  }

  saveSecuritySettings(): void {
    this.isSaving = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Security settings saved', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 500);
  }

  saveAppearanceSettings(): void {
    this.isSaving = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Appearance settings saved', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 500);
  }

  savePrivacySettings(): void {
    this.isSaving = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Privacy settings saved', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 500);
  }

  exportData(): void {
    this.snackBar.open('Data export initiated. You will receive an email when ready.', 'Close', {
      duration: 5000,
      panelClass: ['info-snackbar']
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.snackBar.open('Account deletion request submitted. Please check your email for confirmation.', 'Close', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.notificationSettings = {
        email: true,
        push: true,
        sms: false,
        dashboard: true,
        reports: true,
        analytics: false
      };

      this.securitySettings = {
        twoFactorAuth: false,
        sessionTimeout: 30,
        loginNotifications: true,
        passwordExpiry: 90
      };

      this.appearanceSettings = {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/dd/yyyy',
        currency: 'USD'
      };

      this.privacySettings = {
        dataSharing: false,
        analytics: true,
        cookies: true,
        profileVisibility: 'team'
      };

      this.snackBar.open('Settings reset to defaults', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }
}