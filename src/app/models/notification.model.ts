export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  isRead: boolean;
  userId: string;
  dashboardId?: string;
  actionUrl?: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DASHBOARD_UPDATE = 'dashboard_update'
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  dashboardUpdates: boolean;
  systemAlerts: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  dashboardId?: string;
  dashboardName?: string;
  metadata?: { [key: string]: any };
}