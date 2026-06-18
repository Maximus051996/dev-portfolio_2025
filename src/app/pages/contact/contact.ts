import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService } from '../../core/services/data.service';
import { RevealDirective, MagneticDirective } from '../../core/directives';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective, MagneticDirective],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {
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
