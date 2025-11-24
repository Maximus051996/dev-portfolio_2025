import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './tech.html',
  styleUrl: './tech.css',
})
export class Tech implements OnInit {

  techData: any = {};

  icons = ["⚙️", "🖥️", "☁️", "🗄️", "🛠️"];

  constructor(private ds: DataService) {}

  ngOnInit() {
    this.ds.getTech().subscribe(res => this.techData = res);
  }

  keys(obj: any) {
    return Object.keys(obj);
  }
}
