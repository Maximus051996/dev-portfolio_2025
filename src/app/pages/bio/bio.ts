import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Bio as BioModel } from '../../core/models';   // IMPORTANT
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './bio.html',
  styleUrl: './bio.scss',
})
export class Bio implements OnInit {

  bio$!: Observable<BioModel>;

  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.bio$ = this.ds.getBio();
  }
}
