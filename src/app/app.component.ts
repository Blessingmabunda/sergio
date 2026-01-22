import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dashboard-app';
  showSidebar = false;
  isSidebarCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Show sidebar for authenticated routes
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showSidebar = !event.urlAfterRedirects.includes('/login');
    });
  }

  onSidebarCollapsed(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
