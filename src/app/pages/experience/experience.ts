import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { ExperienceItem } from '../../core/models';
import { RevealDirective } from '../../core/directives';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe, RevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  experience$!: Observable<ExperienceItem[]>;

  constructor(private ds: DataService) {
    this.experience$ = this.ds.getExperience();
  }

  extractMonth(duration: string): string {
    return duration.split('–')[0].trim().split(' ')[0];
  }

  extractYear(duration: string): string {
    return duration.split('–')[0].trim().split(' ')[1];
  }

  companyInitials(company: string): string {
    if (!company) return '';
    const parts = company.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
