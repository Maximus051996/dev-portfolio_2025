import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Bio as BioModel } from '../../core/models';
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { RevealDirective, CountUpDirective, MagneticDirective } from '../../core/directives';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FontAwesomeModule, RevealDirective, CountUpDirective, MagneticDirective],
  templateUrl: './bio.html',
  styleUrl: './bio.scss',
})
export class Bio implements OnInit, AfterViewInit, OnDestroy {
  iconMap: Record<string, any> = {
    github: faGithub,
    linkedin: faLinkedin,
    instagram: faInstagram,
  };

  bio$!: Observable<BioModel>;

  // Cycling roles for the typing effect
  roles: string[] = [
    'scalable .NET 8 APIs',
    'cloud-native Azure apps',
    'Angular UIs at scale',
    'microservices on AKS',
    'CI/CD pipelines on Azure DevOps',
  ];
  currentRole = this.roles[0];
  private roleIndex = 0;
  private roleTimer?: any;

  @ViewChild('avatarWrap') avatarWrap?: ElementRef<HTMLElement>;
  @ViewChild('avatarStack') avatarStack?: ElementRef<HTMLElement>;

  private rafId = 0;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private isHovering = false;
  private tiltCleanups: Array<() => void> = [];

  constructor(private ds: DataService, private zone: NgZone) {}

  ngOnInit(): void {
    this.bio$ = this.ds.getBio();
    this.cycleRoles();
  }

  ngAfterViewInit(): void {
    // Smooth animation loop for avatar tilt
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        // Smooth lerp toward target
        this.currentX += (this.targetX - this.currentX) * 0.08;
        this.currentY += (this.targetY - this.currentY) * 0.08;
        const stack = this.avatarStack?.nativeElement;
        if (stack) {
          stack.style.setProperty('--rx', `${this.currentY.toFixed(2)}deg`);
          stack.style.setProperty('--ry', `${this.currentX.toFixed(2)}deg`);
          stack.style.setProperty('--mx', `${(this.currentX / 14).toFixed(3)}`);
          stack.style.setProperty('--my', `${(this.currentY / 14).toFixed(3)}`);
        }
        this.rafId = requestAnimationFrame(animate);
      };
      this.rafId = requestAnimationFrame(animate);
    });

    // Stat card tilts
    setTimeout(() => this.bindTiltCards(), 50);
  }

  private bindTiltCards(): void {
    const cards = document.querySelectorAll<HTMLElement>('.tilt-card');
    cards.forEach(card => {
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tx', `${(-y * 8).toFixed(2)}deg`);
        card.style.setProperty('--ty', `${(x * 8).toFixed(2)}deg`);
      };
      const leave = () => {
        card.style.setProperty('--tx', '0deg');
        card.style.setProperty('--ty', '0deg');
      };
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      this.tiltCleanups.push(() => {
        card.removeEventListener('mousemove', move);
        card.removeEventListener('mouseleave', leave);
      });
    });
  }

  onAvatarMove(event: MouseEvent): void {
    const wrap = this.avatarWrap?.nativeElement;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.targetX = x * 18;   // rotateY range
    this.targetY = -y * 18;  // rotateX range
    this.isHovering = true;
  }

  onAvatarLeave(): void {
    this.targetX = 0;
    this.targetY = 0;
    this.isHovering = false;
  }

  ngOnDestroy(): void {
    if (this.roleTimer) clearInterval(this.roleTimer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.tiltCleanups.forEach(fn => fn());
  }

  private cycleRoles(): void {
    this.roleTimer = setInterval(() => {
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      this.currentRole = this.roles[this.roleIndex];
    }, 2400);
  }

  scrollToContact() {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
