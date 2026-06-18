import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

// Standalone sections
import { Bio } from './pages/bio/bio';
import { Tech } from './pages/tech/tech';
import { Experience } from './pages/experience/experience';
import { Certifications } from './pages/certifications/certifications';
import { Studies } from './pages/studies/studies';
import { Contact } from './pages/contact/contact';
import { Chatbot } from './shared/chatbot/chatbot';

interface NavItem {
  id: string;
  label: string;
}

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
    Contact,
    Chatbot,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit, OnDestroy {

  menuOpen = false;
  activeSection = 'bio';
  scrollProgress = 0;
  currentYear = new Date().getFullYear();

  navItems: NavItem[] = [
    { id: 'bio', label: 'About Me' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'studies', label: 'Education' },
    { id: 'contact', label: 'Contact Me' },
  ];

  private observer?: IntersectionObserver;

  private sectionIds = this.navItems.map(n => n.id);

  scrollTo(id: string, event?: Event) {
    if (event) event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    this.menuOpen = false;

    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 10);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    this.scrollProgress = total > 0 ? (doc.scrollTop / total) * 100 : 0;
  }

  ngAfterViewInit(): void {
    history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, behavior: 'auto' });
    history.replaceState(null, '', '/');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            section.classList.add('visible');
            this.activeSection = section.id;
          }
        });
      },
      { root: null, threshold: 0.35, rootMargin: '0px' }
    );

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
