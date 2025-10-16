import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { Dashboard, DashboardData } from '../../models/dashboard.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dashboard: Dashboard | null = null;
  dashboardData: DashboardData | null = null;
  currentUser: User | null = null;
  isLoading = true;
  isRefreshing = false;
  availableDashboards: Dashboard[] = [];
  currentDashboardIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAvailableDashboards();
    
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const dashboardId = params['id'];
      if (dashboardId) {
        this.loadDashboard(dashboardId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAvailableDashboards(): void {
    this.dashboardService.getDashboards()
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboards => {
        this.availableDashboards = dashboards;
      });
  }

  private loadDashboard(dashboardId: string): void {
    this.isLoading = true;
    
    this.dashboardService.getDashboardById(dashboardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dashboard) => {
          this.dashboard = dashboard || null;
          this.currentDashboardIndex = this.availableDashboards.findIndex(d => d.id === dashboardId);
          this.loadDashboardData(dashboardId);
        },
        error: (error) => {
          console.error('Error loading dashboard:', error);
          this.snackBar.open('Error loading dashboard', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  private loadDashboardData(dashboardId: string): void {
    this.dashboardService.getDashboardData(dashboardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.isLoading = false;
          this.isRefreshing = false;
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.snackBar.open('Error loading dashboard data', 'Close', { duration: 3000 });
          this.isLoading = false;
          this.isRefreshing = false;
        }
      });
  }

  refreshData(): void {
    if (!this.dashboard) return;
    
    this.isRefreshing = true;
    this.snackBar.open('Refreshing dashboard data...', '', { duration: 2000 });
    this.loadDashboardData(this.dashboard.id);
  }

  exportData(): void {
    if (!this.dashboard || !this.dashboardData) return;

    this.dashboardService.exportDashboard(this.dashboard.id, 'csv')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Dashboard exported successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error exporting dashboard:', error);
          this.snackBar.open('Error exporting dashboard', 'Close', { duration: 3000 });
        }
      });
  }

  navigateToPrevious(): void {
    if (this.currentDashboardIndex > 0) {
      const prevDashboard = this.availableDashboards[this.currentDashboardIndex - 1];
      this.router.navigate(['/dashboard', prevDashboard.id]);
    }
  }

  navigateToNext(): void {
    if (this.currentDashboardIndex < this.availableDashboards.length - 1) {
      const nextDashboard = this.availableDashboards[this.currentDashboardIndex + 1];
      this.router.navigate(['/dashboard', nextDashboard.id]);
    }
  }

  navigateToOverview(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canNavigatePrevious(): boolean {
    return this.currentDashboardIndex > 0;
  }

  canNavigateNext(): boolean {
    return this.currentDashboardIndex < this.availableDashboards.length - 1;
  }

  canExport(): boolean {
    if (!this.dashboard?.permissions || !this.currentUser) return false;
    
    const userPermission = this.dashboard.permissions.find(p => p.role === this.currentUser!.role);
    return userPermission?.canExport || false;
  }

  getLastUpdatedText(): string {
    if (!this.dashboard?.lastUpdated) return 'Never';
    
    const now = new Date();
    const updated = new Date(this.dashboard.lastUpdated);
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return updated.toLocaleDateString();
  }

  getChartTypeIcon(type: string): string {
    switch (type) {
      case 'bar': return 'bar_chart';
      case 'line': return 'show_chart';
      case 'pie': return 'pie_chart';
      case 'area': return 'area_chart';
      default: return 'insert_chart';
    }
  }

  getMetricIcon(type: string): string {
    switch (type) {
      case 'revenue': return 'attach_money';
      case 'users': return 'people';
      case 'orders': return 'shopping_cart';
      case 'growth': return 'trending_up';
      default: return 'analytics';
    }
  }
}
