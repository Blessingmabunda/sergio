import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HelpResourceDialogComponent } from './help-resource-dialog.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  faqs = [
    {
      question: 'How do I view a dashboard?',
      answer: 'Go to Dashboard, then select a card to open detailed view.'
    },
    {
      question: 'How can I export data?',
      answer: 'Open a dashboard and use the download button in the toolbar.'
    },
    {
      question: 'Who has access to dashboards?',
      answer: 'Access is based on your role and company permissions.'
    }
  ];

  resources = [
    {
      icon: 'school',
      label: 'Getting Started',
      summary: 'Learn the basics and set up your first dashboard.',
      details: {
        description: 'Kick off quickly with these steps:',
        bullets: [
          'Navigate to Dashboard Overview',
          'Select a dashboard card to view details',
          'Use filters and actions to tailor insights'
        ]
      }
    },
    {
      icon: 'article',
      label: 'User Guide',
      summary: 'Explore features, tips, and power-user workflows.',
      details: {
        description: 'Highlights from the guide:',
        bullets: [
          'Working with dashboards and reports',
          'Exporting data and sharing with teams',
          'Best practices for analytics and filters'
        ]
      }
    },
    {
      icon: 'shield',
      label: 'Security & Privacy',
      summary: 'Understand how we protect your data.',
      details: {
        description: 'Key principles:',
        bullets: [
          'Role-based access and least privilege',
          'Encrypted transit and storage',
          'Privacy controls in Settings'
        ]
      }
    },
    {
      icon: 'bug_report',
      label: 'Report an Issue',
      summary: 'Found a problem? Here’s how to get help fast.',
      details: {
        description: 'Before reporting:',
        bullets: [
          'Check if it reproduces after refresh',
          'Note any error messages or screenshots',
          'Use email: support@dashboard-portal.example'
        ]
      }
    }
  ];

  openDocs(): void {
    window.open('https://docs.example.com', '_blank');
  }

  openChat(): void {
    window.open('mailto:support@dashboard-portal.example', '_blank');
  }

  openResourceDialog(res: { icon: string; label: string; details: { description: string; bullets?: string[] } }): void {
    this.dialog.open(HelpResourceDialogComponent, {
      data: {
        icon: res.icon,
        title: res.label,
        description: res.details.description,
        bullets: res.details.bullets
      },
      panelClass: 'resource-dialog-panel'
    });
  }
}