import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { CertificationItem } from '../../core/models';
import { Observable } from 'rxjs';
import { RevealDirective } from '../../core/directives';

interface IssuerStyle {
  color: string;     // primary brand color
  ribbon: string;    // gradient for ribbon
  iconKey: 'azure' | 'gcp' | 'aws' | 'generic';
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe, RevealDirective],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
})
export class Certifications {
  certifications$!: Observable<CertificationItem[]>;

  constructor(private ds: DataService) {
    this.certifications$ = this.ds.getCertifications();
  }

  /** Decide which logo + accent to use for a given certification */
  styleFor(cert: CertificationItem): IssuerStyle {
    const issuer = (cert.issuer || '').toLowerCase();
    const name = (cert.name || '').toLowerCase();

    // Microsoft Azure → blue
    if (issuer.includes('microsoft') || name.includes('azure')) {
      return {
        color: '#0078d4',
        ribbon: 'linear-gradient(135deg,#0078d4,#0050a0)',
        iconKey: 'azure',
      };
    }
    // Google Cloud → multi-color
    if (issuer.includes('google')) {
      return {
        color: '#4285f4',
        ribbon: 'linear-gradient(135deg,#4285f4,#34a853 50%,#ea4335)',
        iconKey: 'gcp',
      };
    }
    // AWS → orange
    if (issuer.includes('amazon') || issuer.includes('aws') || name.includes('aws')) {
      return {
        color: '#ff9900',
        ribbon: 'linear-gradient(135deg,#ff9900,#cc6f00)',
        iconKey: 'aws',
      };
    }
    return {
      color: '#6366f1',
      ribbon: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      iconKey: 'generic',
    };
  }
}
