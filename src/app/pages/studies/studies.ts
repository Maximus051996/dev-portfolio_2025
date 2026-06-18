import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationItem } from '../../core/models';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { RevealDirective } from '../../core/directives';

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './studies.html',
  styleUrl: './studies.scss',
})
export class Studies {
  education: Observable<EducationItem[]>;

  constructor(private ds: DataService) {
    this.education = this.ds.getStudies();
  }
}
