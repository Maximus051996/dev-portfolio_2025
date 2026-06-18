import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
} from '@angular/core';

/**
 * Reveals an element when it scrolls into view.
 * Usage:
 *   <div appReveal>...</div>
 *   <h2 appReveal="left" delay="100">...</h2>
 *
 * Modes: '' | 'left' | 'right' | 'zoom' | 'rise' | 'blur'
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('appReveal') mode: string = '';
  @Input() delay: number | string = 0;

  private observer?: IntersectionObserver;
  private static sharedObserver?: IntersectionObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    this.renderer.setAttribute(node, 'data-reveal', this.mode || '');
    if (this.delay) {
      this.renderer.setStyle(node, '--reveal-delay', `${this.delay}ms`);
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              this.observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
