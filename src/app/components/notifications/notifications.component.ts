import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationType, NotificationSettings, ActivityLog } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTabsModule, MatButtonModule, MatIconModule, 
           MatBadgeModule, MatChipsModule, MatTableModule, MatPaginatorModule, MatSortModule,
           MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatInputModule,
           MatProgressSpinnerModule, MatToolbarModule, MatMenuModule, MatDividerModule, 
           MatListModule, MatSlideToggleModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  activityLogs$: Observable<ActivityLog[]>;
  settings$: Observable<NotificationSettings>;
  filteredActivityLogs: ActivityLog[] = [];
  
  selectedTab = 0;
  isLoading = false;
  
  // Filters
  notificationFilter = 'all'; // all, unread, read
  notificationTypeFilter = 'all'; // all, info, success, warning, error
  activityDateRange = {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    end: new Date()
  };
  
  // Notification types for filtering
  notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: NotificationType.INFO, label: 'Info' },
    { value: NotificationType.SUCCESS, label: 'Success' },
    { value: NotificationType.WARNING, label: 'Warning' },
    { value: NotificationType.ERROR, label: 'Error' }
  ];

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.notifications$ = this.notificationService.getNotifications();
    this.unreadCount$ = this.notificationService.getUnreadCount();
    this.activityLogs$ = this.notificationService.getActivityLogs();
    this.settings$ = this.notificationService.getNotificationSettings();
  }

  ngOnInit(): void {
    // Subscribe to activity logs to populate filtered array
    this.activityLogs$.pipe(takeUntil(this.destroy$)).subscribe(logs => {
      this.filteredActivityLogs = logs || [];
    });
    
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Simulate loading delay
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  // Notification methods
  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.snackBar.open('Notification marked as read', 'Close', {
            duration: 2000
          });
        });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackBar.open('All notifications marked as read', 'Close', {
          duration: 2000
        });
      });
  }

  deleteNotification(notification: Notification): void {
    this.notificationService.deleteNotification(notification.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackBar.open('Notification deleted', 'Close', {
          duration: 2000
        });
      });
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.INFO:
        return 'info';
      case NotificationType.SUCCESS:
        return 'check_circle';
      case NotificationType.WARNING:
        return 'warning';
      case NotificationType.ERROR:
        return 'error';
      default:
        return 'notifications';
    }
  }

  getNotificationColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.INFO:
        return 'primary';
      case NotificationType.SUCCESS:
        return 'accent';
      case NotificationType.WARNING:
        return 'warn';
      case NotificationType.ERROR:
        return 'warn';
      default:
        return 'primary';
    }
  }

  getActionColor(action: string): string {
    switch (action.toLowerCase()) {
      case 'dashboard viewed':
      case 'user login':
        return 'primary';
      case 'data exported':
      case 'dashboard updated':
        return 'accent';
      case 'data refresh':
        return 'primary';
      default:
        return '';
    }
  }

  // Activity log methods
  refreshActivityLogs(): void {
    this.isLoading = true;
    
    // Simulate refresh
    setTimeout(() => {
      this.isLoading = false;
      this.snackBar.open('Activity logs refreshed', 'Close', {
        duration: 2000
      });
    }, 1000);
  }

  exportActivityLogs(): void {
    this.notificationService.generateActivityReport(
      this.activityDateRange.start,
      this.activityDateRange.end,
      'csv'
    ).pipe(takeUntil(this.destroy$))
    .subscribe(csvData => {
      this.downloadFile(csvData, 'activity-logs.csv', 'text/csv');
      this.snackBar.open('Activity logs exported', 'Close', {
        duration: 2000
      });
    });
  }

  exportNotifications(): void {
    this.notificationService.exportNotifications('csv')
      .pipe(takeUntil(this.destroy$))
      .subscribe(csvData => {
        this.downloadFile(csvData, 'notifications.csv', 'text/csv');
        this.snackBar.open('Notifications exported', 'Close', {
          duration: 2000
        });
      });
  }

  // Settings methods
  updateSettings(settings: NotificationSettings): void {
    this.notificationService.updateNotificationSettings(settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackBar.open('Settings updated', 'Close', {
          duration: 2000
        });
      });
  }

  // Filter methods
  getFilteredNotifications(): Observable<Notification[]> {
    return new Observable(observer => {
      this.notifications$.pipe(takeUntil(this.destroy$)).subscribe(notifications => {
        let filtered = notifications;

        // Apply read/unread filter
        if (this.notificationFilter === 'unread') {
          filtered = filtered.filter(n => !n.isRead);
        } else if (this.notificationFilter === 'read') {
          filtered = filtered.filter(n => n.isRead);
        }

        // Apply type filter
        if (this.notificationTypeFilter !== 'all') {
          filtered = filtered.filter(n => n.type === this.notificationTypeFilter);
        }

        observer.next(filtered);
      });
    });
  }

  getFilteredActivityLogs(): Observable<ActivityLog[]> {
    return new Observable(observer => {
      this.activityLogs$.pipe(takeUntil(this.destroy$)).subscribe(activityLogs => {
        if (!activityLogs) {
          observer.next([]);
          return;
        }
        
        let filtered = activityLogs;
        
        if (this.activityDateRange.start && this.activityDateRange.end) {
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= this.activityDateRange.start && logDate <= this.activityDateRange.end;
          });
        }
        
        observer.next(filtered);
      });
    });
  }

  // Utility methods
  private downloadFile(data: string, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    if (index === 1) { // Activity logs tab
      this.refreshActivityLogs();
    }
  }
}
