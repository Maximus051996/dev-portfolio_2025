import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  Renderer2
} from '@angular/core';
import { CommonModule, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { CertificationItem } from '../../core/models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-certifications',
    standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
})
export class Certifications implements AfterViewInit, OnDestroy {

  certifications$!: Observable<CertificationItem[]>;

  @ViewChildren('certCard', { read: ElementRef })
  cards!: QueryList<ElementRef>;

  private io!: IntersectionObserver;
  private sub?: Subscription;

  constructor(
    private ds: DataService,
    private renderer: Renderer2
  ) {
    this.certifications$ = this.ds.getCertifications();
  }

  ngAfterViewInit(): void {
    this.io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('visible');
            this.io.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.sub = this.cards.changes.subscribe(() => this.observeCards());
    setTimeout(() => this.observeCards(), 50);
  }

  observeCards() {
    this.cards.forEach((card, idx) => {
      this.renderer.setStyle(card.nativeElement, '--delay', `${idx * 0.12}s`);
      this.io.observe(card.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.io.disconnect();
    this.sub?.unsubscribe();
  }
}
