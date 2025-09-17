export interface Dashboard {
  id: string;
  title: string;
  description: string;
  preview: string;
  company: string;
  category: string;
  lastUpdated: Date;
  isActive: boolean;
  permissions: DashboardPermission[];
  data?: DashboardData;
}

export interface DashboardData {
  charts: ChartData[];
  tables: TableData[];
  metrics: MetricData[];
  lastRefresh: Date;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  title: string;
  data: any[];
  options?: any;
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: any[][];
}

export interface MetricData {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
}

export interface DashboardPermission {
  role: string;
  canView: boolean;
  canEdit: boolean;
  canExport: boolean;
}

export interface DashboardFilter {
  category?: string;
  company?: string;
  searchTerm?: string;
  isActive?: boolean;
}