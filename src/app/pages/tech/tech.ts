import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faServer,
  faDatabase,
  faBolt,
  faCloud
} from '@fortawesome/free-solid-svg-icons';
import {
  faAngular
} from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-tech',
  standalone: true,
  imports: [CommonModule, AsyncPipe,FontAwesomeModule],
  templateUrl: './tech.html',
  styleUrl: './tech.css',
})
export class Tech implements OnInit {

  techData: any = {};

  icons = [ faServer,
  faAngular,faCloud,
  faDatabase,
  faBolt];

  constructor(private ds: DataService) {}

  ngOnInit() {
    this.ds.getTech().subscribe(res => this.techData = res);
  }

  keys(obj: any) {
    return Object.keys(obj);
  }
}
