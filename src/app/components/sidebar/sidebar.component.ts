import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/analytics',
      active: true
    },
    {
      label: 'Reports',
      icon: 'assessment',
      route: '/reports'
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/notifications'
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.collapsedChange.emit(this.isCollapsed);
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  navigateTo(route: string): void {
    this.navigationItems.forEach(item => item.active = false);
    const selectedItem = this.navigationItems.find(item => item.route === route);
    if (selectedItem) {
      selectedItem.active = true;
    }
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}