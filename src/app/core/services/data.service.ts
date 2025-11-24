import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bio, TechItem, ExperienceItem, CertificationItem, EducationItem } from '../models';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
  private base = '/data';
  constructor(private http: HttpClient) { }


  getBio(): Observable<Bio> {
    return this.http.get<Bio>(`${this.base}/bio.json`);
  }


  getTech(): Observable<TechItem> {
    return this.http.get<TechItem>(`${this.base}/tech.json`);
  }


  getExperience(): Observable<ExperienceItem[]> {
    return this.http.get<ExperienceItem[]>(`${this.base}/experience.json`);
  }


  // additional getters
  getCertifications(): Observable<CertificationItem[]> {
    return this.http.get<CertificationItem[]>(`${this.base}/certifications.json`);
  }

  getStudies(): Observable<EducationItem[]> {
    return this.http.get<EducationItem[]>(`${this.base}/education.json`);
  }

  sendEmail(payload: {
    first: string;
    last: string;
    email: string;
    message: string;
  }) {
    const templateParams = {
      name: `${payload.first} ${payload.last}`,
      from_email: payload.email,
      message: payload.message,
    };

    return emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateId,
      templateParams,
      environment.emailjs.publicKey)
  }
}
