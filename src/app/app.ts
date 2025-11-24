import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Standalone sections
import { Bio } from './pages/bio/bio';
import { Tech } from './pages/tech/tech';
import { Experience } from './pages/experience/experience';
import { Certifications } from './pages/certifications/certifications';
import { Studies } from './pages/studies/studies';
import { Contact } from './pages/contact/contact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Bio,
    Tech,
    Experience,
    Certifications,
    Studies,
    Contact
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit, OnDestroy {

  menuOpen = false;
  activeSection = 'bio';

  private observer?: IntersectionObserver;

  private sectionIds = [
    'bio',
    'tech',
    'experience',
    'certifications',
    'studies',
    'contact'
  ];

  // 📌 Smooth scroll FIXED — no downward shifting
  scrollTo(id: string, event?: Event) {
    if (event) event.preventDefault();

    const target = document.getElementById(id);
    if (!target) return;

    this.menuOpen = false;

    // Smooth scroll
    setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 10);

    // ❌ Do NOT set activeSection here
    // Observer will update active automatically
  }

ngAfterViewInit(): void {

  history.scrollRestoration = "manual";
  window.scrollTo({ top: 0, behavior: 'auto' });
  history.replaceState(null, '', '/');

  this.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const section = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          section.classList.add('visible');
          this.activeSection = section.id; // auto-highlight current nav
        }
      });
    },
    {
      root: null,
      threshold: 0.35,
      rootMargin: '0px'
    }
  );

  // ⭐ Delay for stable layout → correct initial activeSection
  setTimeout(() => {
    this.sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer!.observe(el);
    });
  }, 300);
}



  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

}
