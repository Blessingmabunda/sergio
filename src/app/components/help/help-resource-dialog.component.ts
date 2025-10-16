import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface HelpResourceDialogData {
  icon: string;
  title: string;
  description: string;
  bullets?: string[];
}

@Component({
  selector: 'app-help-resource-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './help-resource-dialog.component.html',
  styleUrl: './help-resource-dialog.component.scss'
})
export class HelpResourceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HelpResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HelpResourceDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}