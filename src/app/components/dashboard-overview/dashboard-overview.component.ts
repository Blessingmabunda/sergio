import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { Dashboard, DashboardFilter } from '../../models/dashboard.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatGridListModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss'
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  dashboards: Dashboard[] = [];
  filteredDashboards: Dashboard[] = [];
  categories: string[] = [];
  currentUser: User | null = null;
  isLoading = true;
  
  searchTerm = '';
  selectedCategory = '';
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboards();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboards(): void {
    this.isLoading = true;
    this.dashboardService.getDashboards().subscribe({
      next: (dashboards) => {
        this.dashboards = dashboards;
        this.filteredDashboards = dashboards;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboards:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.dashboardService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  applyFilters(): void {
    const filter: DashboardFilter = {
      searchTerm: this.searchTerm || undefined,
      category: this.selectedCategory || undefined,
      isActive: true
    };

    this.dashboardService.getDashboards(filter).subscribe({
      next: (dashboards) => {
        this.filteredDashboards = dashboards;
      }
    });
  }

  viewDashboard(dashboard: Dashboard): void {
    this.router.navigate(['/dashboard', dashboard.id]);
  }

  getLastUpdatedText(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Updated ${Math.ceil(diffDays / 30)} months ago`;
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Sales': '#4CAF50',
      'Finance': '#2196F3',
      'Analytics': '#FF9800',
      'Operations': '#1f7fc3',
      'Marketing': '#F44336'
    };
    return colors[category] || '#757575';
  }

  canExport(dashboard: Dashboard): boolean {
    if (!this.currentUser) return false;
    const permission = dashboard.permissions.find(p => p.role === this.currentUser!.role);
    return permission?.canExport || false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
