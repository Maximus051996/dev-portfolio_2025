import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Bio as BioModel } from '../../core/models';   // IMPORTANT
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FontAwesomeModule],
  templateUrl: './bio.html',
  styleUrl: './bio.scss',
})
export class Bio implements OnInit {
  iconMap: Record<string, any> = {
    github: faGithub,
    linkedin: faLinkedin,
    instagram: faInstagram,
  };
  bio$!: Observable<BioModel>;

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.bio$ = this.ds.getBio();
  }
  scrollToContact() {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

}
