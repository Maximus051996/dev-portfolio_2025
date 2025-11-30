import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TechItem } from '../../core/models/tech.model';
import { DataService } from '../../core/services/data.service';

type CategoryKey = keyof TechItem;

@Component({
  selector: 'app-tech',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech.html',
  styleUrls: ['./tech.css']
})
export class Tech implements OnInit {
  tech$!: Observable<TechItem>;

  categories: { label: string; key: CategoryKey; color: string }[] = [
    { label: 'Frontend', key: 'Frontend', color: 'from-emerald-400 to-green-600' },
    { label: 'Backend', key: 'Backend', color: 'from-amber-400 to-orange-600' },
    { label: 'Cloud', key: 'Cloud', color: 'from-violet-500 to-purple-700' },
    { label: 'Database', key: 'Database', color: 'from-sky-500 to-blue-700' },
    { label: 'Tools', key: 'Tools', color: 'from-gray-500 to-gray-700' },
  ];

  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.tech$ = this.ds.getTech();
  }
}
