import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';

/**
 * Counts up to the target number when the element scrolls into view.
 * Usage: <span appCountUp="25" suffix="+">0</span>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  @Input('appCountUp') target: number | string = 0;
  @Input() duration: number | string = 1600;
  @Input() suffix: string = '';
  @Input() prefix: string = '';

  private observer?: IntersectionObserver;
  private rafId = 0;
  private played = false;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.textContent = `${this.prefix}0${this.suffix}`;

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.played) {
              this.played = true;
              this.animate();
              this.observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      this.observer.observe(node);
    });
  }

  private animate(): void {
    const node = this.el.nativeElement;
    const target = Number(this.target) || 0;
    const dur = Number(this.duration) || 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      node.textContent = `${this.prefix}${value}${this.suffix}`;
      if (t < 1) {
        this.rafId = requestAnimationFrame(tick);
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
