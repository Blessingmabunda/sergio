import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Notification, NotificationType, NotificationSettings, ActivityLog } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private activityLogsSubject = new BehaviorSubject<ActivityLog[]>([]);
  private settingsSubject = new BehaviorSubject<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    dashboardUpdates: true,
    systemAlerts: true
  });

  // Mock data for demonstration
  private mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Dashboard Updated',
      message: 'Sales Dashboard has been updated with new data',
      type: NotificationType.INFO,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      dashboardId: 'sales-dashboard',
      userId: 'user1'
    },
    {
      id: '2',
      title: 'Data Export Complete',
      message: 'Your requested data export for Q4 Analytics is ready for download',
      type: NotificationType.SUCCESS,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: false,
      dashboardId: 'analytics-dashboard',
      userId: 'user1'
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
      type: NotificationType.WARNING,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: true,
      userId: 'user1'
    },
    {
      id: '4',
      title: 'Data Sync Error',
      message: 'Failed to sync data from external source. Please check connection.',
      type: NotificationType.ERROR,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isRead: true,
      dashboardId: 'external-data-dashboard',
      userId: 'user1'
    }
  ];

  private mockActivityLogs: ActivityLog[] = [
    {
      id: '1',
      action: 'Dashboard Viewed',
      description: 'User viewed Sales Dashboard',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      userId: 'user1',
      userName: 'John Doe',
      dashboardId: 'sales-dashboard',
      dashboardName: 'Sales Dashboard',
      metadata: { viewDuration: '5 minutes' }
    },
    {
      id: '2',
      action: 'Data Exported',
      description: 'User exported Q4 Analytics data as CSV',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      userId: 'user1',
      userName: 'John Doe',
      dashboardId: 'analytics-dashboard',
      dashboardName: 'Q4 Analytics',
      metadata: { format: 'CSV', size: '2.5MB' }
    },
    {
      id: '3',
      action: 'Dashboard Updated',
      description: 'System automatically updated dashboard with new data',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      userId: 'system',
      userName: 'System',
      dashboardId: 'sales-dashboard',
      dashboardName: 'Sales Dashboard',
      metadata: { recordsUpdated: 1250, source: 'API' }
    },
    {
      id: '4',
      action: 'User Login',
      description: 'User successfully logged into the system',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
      userId: 'user1',
      userName: 'John Doe',
      metadata: { ipAddress: '192.168.1.100', browser: 'Chrome' }
    },
    {
      id: '5',
      action: 'Data Refresh',
      description: 'Manual data refresh triggered for Marketing Dashboard',
      timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
      userId: 'user2',
      userName: 'Jane Smith',
      dashboardId: 'marketing-dashboard',
      dashboardName: 'Marketing Dashboard',
      metadata: { refreshType: 'manual', duration: '45 seconds' }
    }
  ];

  constructor() {
    this.loadNotifications();
    this.loadActivityLogs();
    this.startNotificationPolling();
  }

  // Notifications
  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.pipe(
      map(notifications => notifications.filter(n => !n.isRead))
    );
  }

  getUnreadCount(): Observable<number> {
    return this.getUnreadNotifications().pipe(
      map(notifications => notifications.length)
    );
  }

  markAsRead(notificationId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.isRead = true;
      this.notificationsSubject.next([...notifications]);
      return of(true);
    }
    
    return of(false);
  }

  markAllAsRead(): Observable<boolean> {
    const notifications = this.notificationsSubject.value.map(n => ({
      ...n,
      isRead: true
    }));
    
    this.notificationsSubject.next(notifications);
    return of(true);
  }

  deleteNotification(notificationId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(notifications);
    return of(true);
  }

  createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Observable<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    const notifications = [newNotification, ...this.notificationsSubject.value];
    this.notificationsSubject.next(notifications);
    
    return of(newNotification);
  }

  // Activity Logs
  getActivityLogs(): Observable<ActivityLog[]> {
    return this.activityLogsSubject.asObservable();
  }

  getActivityLogsByDateRange(startDate: Date, endDate: Date): Observable<ActivityLog[]> {
    return this.activityLogsSubject.pipe(
      map(logs => logs.filter(log => 
        log.timestamp >= startDate && log.timestamp <= endDate
      ))
    );
  }

  getActivityLogsByUser(userId: string): Observable<ActivityLog[]> {
    return this.activityLogsSubject.pipe(
      map(logs => logs.filter(log => log.userId === userId))
    );
  }

  getActivityLogsByDashboard(dashboardId: string): Observable<ActivityLog[]> {
    return this.activityLogsSubject.pipe(
      map(logs => logs.filter(log => log.dashboardId === dashboardId))
    );
  }

  logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Observable<ActivityLog> {
    const newActivity: ActivityLog = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    const logs = [newActivity, ...this.activityLogsSubject.value];
    this.activityLogsSubject.next(logs);
    
    return of(newActivity);
  }

  // Settings
  getNotificationSettings(): Observable<NotificationSettings> {
    return this.settingsSubject.asObservable();
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    this.settingsSubject.next(settings);
    return of(settings);
  }

  // Reports
  generateActivityReport(startDate: Date, endDate: Date, format: 'csv' | 'pdf' = 'csv'): Observable<string> {
    return this.getActivityLogsByDateRange(startDate, endDate).pipe(
      map(logs => {
        if (format === 'csv') {
          return this.generateCSVReport(logs);
        } else {
          return this.generatePDFReport(logs);
        }
      })
    );
  }

  exportNotifications(format: 'csv' | 'json' = 'csv'): Observable<string> {
    return this.getNotifications().pipe(
      map(notifications => {
        if (format === 'csv') {
          return this.generateNotificationsCSV(notifications);
        } else {
          return JSON.stringify(notifications, null, 2);
        }
      })
    );
  }

  // Private methods
  private loadNotifications(): void {
    this.notificationsSubject.next(this.mockNotifications);
  }

  private loadActivityLogs(): void {
    this.activityLogsSubject.next(this.mockActivityLogs);
  }

  private startNotificationPolling(): void {
    // Simulate real-time notifications every 30 seconds
    timer(30000, 30000).pipe(
      switchMap(() => this.checkForNewNotifications())
    ).subscribe();
  }

  private checkForNewNotifications(): Observable<Notification[]> {
    // Simulate checking for new notifications
    const shouldAddNotification = Math.random() > 0.8; // 20% chance
    
    if (shouldAddNotification) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'New Data Available',
        message: 'Fresh data has been loaded into your dashboards',
        type: NotificationType.INFO,
        timestamp: new Date(),
        isRead: false,
        userId: 'user1'
      };
      
      const notifications = [newNotification, ...this.notificationsSubject.value];
      this.notificationsSubject.next(notifications);
    }
    
    return this.getNotifications();
  }

  private generateCSVReport(logs: ActivityLog[]): string {
    const headers = ['Timestamp', 'Action', 'User', 'Dashboard', 'Description'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.action,
      log.userName,
      log.dashboardName || 'N/A',
      log.description
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private generatePDFReport(logs: ActivityLog[]): string {
    // In a real application, you would use a PDF library like jsPDF
    return `PDF Report generated for ${logs.length} activity logs`;
  }

  private generateNotificationsCSV(notifications: Notification[]): string {
    const headers = ['Timestamp', 'Title', 'Message', 'Type', 'Read Status'];
    const rows = notifications.map(notification => [
      notification.timestamp.toISOString(),
      notification.title,
      notification.message,
      notification.type,
      notification.isRead ? 'Read' : 'Unread'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
