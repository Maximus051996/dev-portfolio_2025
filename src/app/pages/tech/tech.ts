import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TechItem } from '../../core/models/tech.model';
import { DataService } from '../../core/services/data.service';
import { RevealDirective } from '../../core/directives';

type CategoryKey = keyof TechItem;

interface CategoryDef {
  label: string;
  key: CategoryKey;
  cssAccent: string;
  icon: SafeHtml;
}

@Component({
  selector: 'app-tech',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './tech.html',
  styleUrls: ['./tech.scss']
})
export class Tech implements OnInit {
  tech$!: Observable<TechItem>;

  categories: CategoryDef[] = [];

  constructor(
    private ds: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.tech$ = this.ds.getTech();

    const i = (svg: string) => this.sanitizer.bypassSecurityTrustHtml(svg);

    this.categories = [
      {
        label: 'Frontend',
        key: 'Frontend',
        cssAccent: 'linear-gradient(135deg,#10b981,#22c55e)',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="14" rx="2"/>
          <path d="M3 17h18"/>
          <path d="M9 21h6"/>
          <path d="m9 9 2 2-2 2"/>
          <path d="M13 13h2"/>
        </svg>`),
      },
      {
        label: 'Backend',
        key: 'Backend',
        cssAccent: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="6" rx="2"/>
          <rect x="3" y="14" width="18" height="6" rx="2"/>
          <path d="M7 7h.01"/><path d="M7 17h.01"/>
        </svg>`),
      },
      {
        label: 'Cloud',
        key: 'Cloud',
        cssAccent: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.5 19a4.5 4.5 0 1 0-1.41-8.77 6 6 0 1 0-11.59 2.27A4 4 0 0 0 6 19h11.5z"/>
        </svg>`),
      },
      {
        label: 'Database',
        key: 'Database',
        cssAccent: 'linear-gradient(135deg,#0ea5e9,#1d4ed8)',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="12" cy="5" rx="8" ry="3"/>
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/>
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>
        </svg>`),
      },
      {
        label: 'Tools',
        key: 'Tools',
        cssAccent: 'linear-gradient(135deg,#475569,#1f2937)',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z"/>
        </svg>`),
      },
    ];
  }
}
