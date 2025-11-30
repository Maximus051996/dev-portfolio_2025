import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {
  faEnvelope = faEnvelope;

  loading = false;
  success = false;

  form = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private dataService: DataService) {}

  async sendMessage(formRef: NgForm) {
    if (!formRef.valid) return;
    this.loading = true;
    this.success = false;

    try {
      await this.dataService.sendEmail(this.form);
      this.success = true;
      this.form = { name: '', email: '', message: '' };
      formRef.resetForm();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to send email. Please try again.');
    } finally {
      this.loading = false;
    }
  }
}
