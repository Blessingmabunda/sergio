import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardOverviewComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard/:id', 
    component: DashboardViewComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'notifications', 
    component: NotificationsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'analytics', 
    component: AnalyticsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'reports', 
    component: ReportsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'settings', 
    component: SettingsComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
