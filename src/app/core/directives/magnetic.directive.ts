import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

/**
 * Magnetic hover — element subtly follows the cursor when nearby.
 * Usage: <button appMagnetic [strength]="14">...</button>
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements AfterViewInit {
  @Input() strength: number | string = 12;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'magnetic');
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const s = Number(this.strength) || 12;
    const scale = s / Math.max(rect.width, rect.height);
    node.style.setProperty('--mag-x', `${x * scale}px`);
    node.style.setProperty('--mag-y', `${y * scale}px`);
  }

  @HostListener('mouseleave')
  onLeave(): void {
    const node = this.el.nativeElement;
    node.style.setProperty('--mag-x', `0px`);
    node.style.setProperty('--mag-y', `0px`);
  }
}
