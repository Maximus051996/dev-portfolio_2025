import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  Renderer2
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { ExperienceItem } from '../../core/models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience implements AfterViewInit, OnDestroy {
  experience$!: Observable<ExperienceItem[]>;

  private io?: IntersectionObserver;
  private sub?: Subscription;

  @ViewChildren('timelineItem', { read: ElementRef })
  items!: QueryList<ElementRef>;

  constructor(
    private ds: DataService,
    private renderer: Renderer2
  ) {
    this.experience$ = this.ds.getExperience();
  }

  /** Extract left-side Month + Year from duration */
  extractMonth(duration: string): string {
    // Example: "Oct 2021 – Feb 2024"
    return duration.split("–")[0].trim().split(" ")[0]; // "Oct"
  }

  extractYear(duration: string): string {
    return duration.split("–")[0].trim().split(" ")[1]; // "2021"
  }

  ngAfterViewInit(): void {
    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('visible');
            this.io?.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.sub = this.items.changes.subscribe(() => this.observeItems());
    setTimeout(() => this.observeItems(), 0);
  }

  observeItems() {
    if (this.items) {
      this.items.forEach((item, idx) => {
        this.renderer.setStyle(item.nativeElement, '--delay', `${0.12 * (idx + 1)}s`);
        this.io?.observe(item.nativeElement);
      });
    }
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    this.sub?.unsubscribe();
  }
}
