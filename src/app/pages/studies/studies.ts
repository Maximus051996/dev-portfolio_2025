import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { EducationItem } from '../../core/models';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-studies',
  imports: [CommonModule, NgIf, NgFor],
  standalone: true,
  templateUrl: './studies.html',
  styleUrl: './studies.scss',
})
export class Studies implements AfterViewInit {
  education!: Observable<EducationItem[]>;

  @ViewChildren('eduItem', { read: ElementRef })
  items!: QueryList<ElementRef>;

  constructor(private ds: DataService) {
    this.education=this.ds.getStudies();
  }

ngAfterViewInit(): void {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  this.items.changes.subscribe(() => {
    this.items.forEach((item, i) => {
      item.nativeElement.style.setProperty('--delay', `${i * 0.15}s`);
      observer.observe(item.nativeElement);
    });
  });
}

}
