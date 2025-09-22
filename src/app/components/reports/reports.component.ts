import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'performance' | 'user' | 'system';
  status: 'ready' | 'generating' | 'scheduled';
  lastGenerated: Date;
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  estimatedTime: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatInputModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isLoading = true;
  selectedTimeRange = '30d';
  
  reports: Report[] = [
    {
      id: '1',
      title: 'Monthly Financial Report',
      description: 'Comprehensive financial overview for the current month',
      type: 'financial',
      status: 'ready',
      lastGenerated: new Date('2024-01-15'),
      size: '2.4 MB',
      format: 'pdf'
    },
    {
      id: '2',
      title: 'User Activity Analysis',
      description: 'Detailed analysis of user engagement and behavior patterns',
      type: 'user',
      status: 'ready',
      lastGenerated: new Date('2024-01-14'),
      size: '1.8 MB',
      format: 'excel'
    },
    {
      id: '3',
      title: 'System Performance Report',
      description: 'System health and performance metrics overview',
      type: 'system',
      status: 'generating',
      lastGenerated: new Date('2024-01-13'),
      size: '3.1 MB',
      format: 'pdf'
    },
    {
      id: '4',
      title: 'Weekly Performance Summary',
      description: 'Key performance indicators and trends for the past week',
      type: 'performance',
      status: 'scheduled',
      lastGenerated: new Date('2024-01-12'),
      size: '1.2 MB',
      format: 'csv'
    }
  ];

  reportTemplates: ReportTemplate[] = [
    {
      id: 'financial-monthly',
      name: 'Monthly Financial Report',
      description: 'Complete financial overview with revenue, expenses, and profit analysis',
      category: 'Financial',
      icon: 'account_balance',
      estimatedTime: '5-10 minutes'
    },
    {
      id: 'user-engagement',
      name: 'User Engagement Report',
      description: 'User activity, retention, and engagement metrics',
      category: 'Analytics',
      icon: 'people',
      estimatedTime: '3-7 minutes'
    },
    {
      id: 'performance-kpi',
      name: 'KPI Performance Report',
      description: 'Key performance indicators and business metrics',
      category: 'Performance',
      icon: 'trending_up',
      estimatedTime: '4-8 minutes'
    },
    {
      id: 'system-health',
      name: 'System Health Report',
      description: 'Infrastructure performance and system reliability metrics',
      category: 'Technical',
      icon: 'computer',
      estimatedTime: '2-5 minutes'
    },
    {
      id: 'sales-analysis',
      name: 'Sales Analysis Report',
      description: 'Sales performance, trends, and forecasting',
      category: 'Sales',
      icon: 'shopping_cart',
      estimatedTime: '6-12 minutes'
    },
    {
      id: 'custom-report',
      name: 'Custom Report Builder',
      description: 'Build your own custom report with selected metrics',
      category: 'Custom',
      icon: 'build',
      estimatedTime: 'Variable'
    }
  ];

  timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  onTimeRangeChange(range: string): void {
    this.selectedTimeRange = range;
    // Implement time range filtering logic
    console.log('Time range changed to:', range);
  }

  downloadReport(report: Report): void {
    console.log('Downloading report:', report.title);
    // Implement download logic
  }

  generateReport(templateId: string): void {
    console.log('Generating report from template:', templateId);
    // Implement report generation logic
  }

  scheduleReport(report: Report): void {
    console.log('Scheduling report:', report.title);
    // Implement scheduling logic
  }

  deleteReport(report: Report): void {
    console.log('Deleting report:', report.title);
    // Implement delete logic
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ready': return 'check_circle';
      case 'generating': return 'hourglass_empty';
      case 'scheduled': return 'schedule';
      default: return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ready': return 'success';
      case 'generating': return 'warning';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'financial': return 'account_balance';
      case 'performance': return 'trending_up';
      case 'user': return 'people';
      case 'system': return 'computer';
      default: return 'description';
    }
  }

  getFormatIcon(format: string): string {
    switch (format) {
      case 'pdf': return 'picture_as_pdf';
      case 'excel': return 'table_chart';
      case 'csv': return 'grid_on';
      default: return 'description';
    }
  }
}