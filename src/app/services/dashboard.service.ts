import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Dashboard, DashboardFilter, DashboardData, ChartData, TableData, MetricData } from '../models/dashboard.model';
import { AuthService } from './auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardsSubject = new BehaviorSubject<Dashboard[]>([]);
  public dashboards$ = this.dashboardsSubject.asObservable();

  private mockDashboards: Dashboard[] = [
    {
      id: '1',
      title: 'Sales Analytics',
      description: 'Comprehensive sales performance metrics and trends',
      preview: 'assets/previews/sales-dashboard.svg',
      company: 'TechCorp',
      category: 'Sales',
      lastUpdated: new Date('2024-01-15'),
      isActive: true,
      permissions: [
        { role: 'admin', canView: true, canEdit: true, canExport: true },
        { role: 'user', canView: true, canEdit: false, canExport: true },
        { role: 'data_manager', canView: true, canEdit: true, canExport: true }
      ]
    },
    {
      id: '2',
      title: 'Financial Overview',
      description: 'Real-time financial data and budget tracking',
      preview: 'assets/previews/financial-dashboard.svg',
      company: 'TechCorp',
      category: 'Finance',
      lastUpdated: new Date('2024-01-14'),
      isActive: true,
      permissions: [
        { role: 'admin', canView: true, canEdit: true, canExport: true },
        { role: 'user', canView: false, canEdit: false, canExport: false },
        { role: 'data_manager', canView: true, canEdit: false, canExport: true }
      ]
    },
    {
      id: '3',
      title: 'Customer Insights',
      description: 'Customer behavior analysis and satisfaction metrics',
      preview: 'assets/previews/customer-dashboard.svg',
      company: 'DataCorp',
      category: 'Analytics',
      lastUpdated: new Date('2024-01-13'),
      isActive: true,
      permissions: [
        { role: 'admin', canView: true, canEdit: true, canExport: true },
        { role: 'user', canView: true, canEdit: false, canExport: false },
        { role: 'data_manager', canView: true, canEdit: true, canExport: true }
      ]
    },
    {
      id: '4',
      title: 'Operations Dashboard',
      description: 'Operational efficiency and performance monitoring',
      preview: 'assets/previews/operations-dashboard.svg',
      company: 'TechCorp',
      category: 'Operations',
      lastUpdated: new Date('2024-01-12'),
      isActive: true,
      permissions: [
        { role: 'admin', canView: true, canEdit: true, canExport: true },
        { role: 'user', canView: true, canEdit: false, canExport: true },
        { role: 'data_manager', canView: true, canEdit: true, canExport: true }
      ]
    },
    {
      id: '5',
      title: 'Marketing Performance',
      description: 'Campaign effectiveness and ROI analysis',
      preview: 'assets/previews/marketing-dashboard.svg',
      company: 'DataCorp',
      category: 'Marketing',
      lastUpdated: new Date('2024-01-11'),
      isActive: true,
      permissions: [
        { role: 'admin', canView: true, canEdit: true, canExport: true },
        { role: 'user', canView: true, canEdit: false, canExport: false },
        { role: 'data_manager', canView: true, canEdit: true, canExport: true }
      ]
    }
  ];

  constructor(private authService: AuthService) {
    this.loadDashboards();
  }

  getDashboards(filter?: DashboardFilter): Observable<Dashboard[]> {
    return this.dashboards$.pipe(
      map(dashboards => this.filterDashboards(dashboards, filter)),
      delay(500) // Simulate API delay
    );
  }

  getDashboardById(id: string): Observable<Dashboard | undefined> {
    return this.dashboards$.pipe(
      map(dashboards => dashboards.find(d => d.id === id)),
      delay(300)
    );
  }

  getDashboardData(id: string): Observable<DashboardData> {
    // Mock dashboard data
    const mockData: DashboardData = {
      charts: this.generateMockChartData(),
      tables: this.generateMockTableData(),
      metrics: this.generateMockMetricData(),
      lastRefresh: new Date()
    };

    return of(mockData).pipe(delay(800));
  }

  refreshDashboard(id: string): Observable<DashboardData> {
    // Simulate data refresh
    return this.getDashboardData(id);
  }

  exportDashboard(id: string, format: 'pdf' | 'excel' | 'csv'): Observable<Blob> {
    // Mock export functionality
    const mockData = `Dashboard Export - ${id}\nFormat: ${format}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([mockData], { type: 'text/plain' });
    return of(blob).pipe(delay(1000));
  }

  getCategories(): Observable<string[]> {
    return this.dashboards$.pipe(
      map(dashboards => [...new Set(dashboards.map(d => d.category))])
    );
  }

  private loadDashboards(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.dashboardsSubject.next([]);
      return;
    }

    // Filter dashboards based on user permissions and company access
    const filteredDashboards = this.mockDashboards.filter(dashboard => {
      // Check company access
      if (!this.authService.canAccessCompany(dashboard.company)) {
        return false;
      }

      // Check role permissions
      const permission = dashboard.permissions.find(p => p.role === user.role);
      return permission?.canView || false;
    });

    this.dashboardsSubject.next(filteredDashboards);
  }

  private filterDashboards(dashboards: Dashboard[], filter?: DashboardFilter): Dashboard[] {
    if (!filter) return dashboards;

    return dashboards.filter(dashboard => {
      if (filter.category && dashboard.category !== filter.category) return false;
      if (filter.company && dashboard.company !== filter.company) return false;
      if (filter.isActive !== undefined && dashboard.isActive !== filter.isActive) return false;
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return dashboard.title.toLowerCase().includes(searchLower) ||
               dashboard.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  private generateMockChartData(): ChartData[] {
    return [
      {
        id: 'sales-trend',
        type: 'line',
        title: 'Sales Trend',
        data: [
          { label: 'Jan', value: 12000 },
          { label: 'Feb', value: 15000 },
          { label: 'Mar', value: 18000 },
          { label: 'Apr', value: 16000 },
          { label: 'May', value: 22000 },
          { label: 'Jun', value: 25000 }
        ]
      },
      {
        id: 'revenue-breakdown',
        type: 'pie',
        title: 'Revenue Breakdown',
        data: [
          { label: 'Product A', value: 35 },
          { label: 'Product B', value: 25 },
          { label: 'Product C', value: 20 },
          { label: 'Product D', value: 20 }
        ]
      }
    ];
  }

  private generateMockTableData(): TableData[] {
    return [
      {
        id: 'top-products',
        title: 'Top Products',
        headers: ['Product', 'Sales', 'Revenue', 'Growth'],
        rows: [
          ['Product A', '1,250', '$125,000', '+15%'],
          ['Product B', '980', '$98,000', '+8%'],
          ['Product C', '750', '$75,000', '-2%'],
          ['Product D', '650', '$65,000', '+12%']
        ]
      }
    ];
  }

  private generateMockMetricData(): MetricData[] {
    return [
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        value: '$1,250,000',
        trend: 'up',
        percentage: 15.2
      },
      {
        id: 'active-customers',
        title: 'Active Customers',
        value: 2847,
        trend: 'up',
        percentage: 8.5
      },
      {
        id: 'conversion-rate',
        title: 'Conversion Rate',
        value: '3.2%',
        trend: 'down',
        percentage: -1.2
      },
      {
        id: 'avg-order-value',
        title: 'Avg Order Value',
        value: '$89.50',
        trend: 'stable',
        percentage: 0.1
      }
    ];
  }
}
