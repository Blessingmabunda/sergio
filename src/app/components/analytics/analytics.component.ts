import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface ChartData {
  title: string;
  type: string;
  data: any[];
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  isLoading = false;
  selectedTimeRange = '7d';
  
  timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  metrics: AnalyticsMetric[] = [
    {
      title: 'Total Views',
      value: '24,567',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'visibility'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'people'
    },
    {
      title: 'Conversion Rate',
      value: '3.45%',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'trending_up'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'attach_money'
    }
  ];

  charts: ChartData[] = [
    {
      title: 'User Traffic',
      type: 'line',
      data: []
    },
    {
      title: 'Revenue Breakdown',
      type: 'pie',
      data: []
    },
    {
      title: 'Performance Metrics',
      type: 'bar',
      data: []
    },
    {
      title: 'Geographic Distribution',
      type: 'map',
      data: []
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  onTimeRangeChange(): void {
    this.loadAnalyticsData();
  }

  exportData(): void {
    // Implement export functionality
    console.log('Exporting analytics data...');
  }

  refreshData(): void {
    this.loadAnalyticsData();
  }

  getChartIcon(type: string): string {
    switch (type) {
      case 'line': return 'show_chart';
      case 'pie': return 'pie_chart';
      case 'bar': return 'bar_chart';
      case 'map': return 'map';
      default: return 'analytics';
    }
  }
}