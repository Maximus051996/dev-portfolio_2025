import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {

  constructor(private dataService: DataService) { }

  loading = false;
  success = false;

  form = {
    first: '',
    last: '',
    email: '',
    message: ''
  };

  sendMessage() {
    this.loading = true;

    this.dataService.sendEmail(this.form)
      .then(() => {
        this.success = true;
        this.loading = false;
        this.form = { first: '', last: '', email: '', message: '' };
      })
      .catch(err => {
        console.error('Email failed', err);
        this.loading = false;
        alert("Failed to send message. Try again later.");
      });
  }
}
