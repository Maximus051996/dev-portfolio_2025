import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

import { DataService } from '../../core/services/data.service';
import { ChatbotEngine, ChatContext, ChatMessage } from './chatbot-engine';

interface RichSuggestion {
  label: string;
  text: string;
  color: string;
  icon: SafeHtml;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.scss'],
})
export class Chatbot implements OnInit, OnDestroy, AfterViewChecked {

  open = false;
  unread = 1;
  hasGreeted = false;
  draft = '';
  isTyping = false;
  messages: ChatMessage[] = [];

  private engine = new ChatbotEngine();
  private ctx: ChatContext = {};
  private autoOpenTimer?: any;
  private greetTimer?: any;
  private scrollPending = false;

  @ViewChild('messagesEl') messagesEl?: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  suggestions = this.engine.suggestions();

  /** Rich suggestion chips with brand-color icon tiles */
  richSuggestions: RichSuggestion[] = [];

  constructor(private ds: DataService, private sanitizer: DomSanitizer) {
    const i = (svg: string) => this.sanitizer.bypassSecurityTrustHtml(svg);

    this.richSuggestions = [
      {
        label: 'About Sayan',
        text: 'Tell me about Sayan',
        color: '#6366f1',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`),
      },
      {
        label: 'Tech Stack',
        text: 'What technologies does he use?',
        color: '#06b6d4',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`),
      },
      {
        label: 'Experience',
        text: 'Show his experience',
        color: '#f59e0b',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>`),
      },
      {
        label: 'Certifications',
        text: 'Show his certifications',
        color: '#10b981',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="m9 12-1 9 4-3 4 3-1-9"/></svg>`),
      },
      {
        label: 'Contact',
        text: 'How to contact him?',
        color: '#ec4899',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`),
      },
      {
        label: 'Resume',
        text: 'Can I see his resume?',
        color: '#8b5cf6',
        icon: i(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`),
      },
    ];
  }

  ngOnInit(): void {
    forkJoin({
      bio: this.ds.getBio(),
      experience: this.ds.getExperience(),
      tech: this.ds.getTech(),
      education: this.ds.getStudies(),
      certifications: this.ds.getCertifications(),
    }).subscribe({
      next: data => { this.ctx = data; },
      error: err => console.warn('Chatbot context fetch failed', err),
    });

    const alreadyGreeted = sessionStorage.getItem('sp_chat_greeted');
    if (!alreadyGreeted) {
      // Just bump the unread badge after a delay (don't auto-pop the panel)
      this.autoOpenTimer = setTimeout(() => {
        if (!this.open) {
          this.unread = Math.max(this.unread, 1);
        }
      }, 4000);
    } else {
      this.hasGreeted = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.scrollPending) {
      this.scrollToBottom();
      this.scrollPending = false;
    }
  }

  ngOnDestroy(): void {
    if (this.autoOpenTimer) clearTimeout(this.autoOpenTimer);
    if (this.greetTimer) clearTimeout(this.greetTimer);
  }

  toggle(): void {
    this.open = !this.open;
    this.unread = 0;
    if (this.open && !this.hasGreeted) {
      this.hasGreeted = true;
      sessionStorage.setItem('sp_chat_greeted', '1');
    }
    if (this.open) {
      setTimeout(() => this.inputEl?.nativeElement.focus(), 200);
    }
  }

  /** Manual greet (still kept in case we want to call it later) */
  private greet(pop: boolean): void {
    this.hasGreeted = true;
    sessionStorage.setItem('sp_chat_greeted', '1');
    if (pop) {
      this.open = true;
      this.unread = 0;
    }
    this.pushBot("Hi 👋  Welcome to Sayan's portfolio! I'm his AI assistant.");
    setTimeout(() => {
      this.pushBot("Ask me about his experience, tech stack, certifications, or how to get in touch.");
    }, 800);
  }

  send(text?: string): void {
    const value = (text ?? this.draft).trim();
    if (!value) return;

    this.messages = [...this.messages, { role: 'user', text: value, ts: Date.now() }];
    this.draft = '';
    this.scrollPending = true;
    this.isTyping = true;

    // Simulate a tiny "thinking" delay for personality
    const delay = 600 + Math.min(900, value.length * 12);
    this.greetTimer = setTimeout(() => {
      const out = this.engine.reply(value, this.ctx);
      this.pushBot(out.text, out.cta);
      this.isTyping = false;
    }, delay);
  }

  pickSuggestion(text: string): void {
    this.send(text);
  }

  private pushBot(text: string, cta?: ChatMessage['cta']): void {
    this.messages = [...this.messages, { role: 'bot', text, ts: Date.now(), cta }];
    this.scrollPending = true;
    if (!this.open) this.unread++;
  }

  private scrollToBottom(): void {
    const el = this.messagesEl?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  /** Allow CTA links to do scroll-to-section navigation */
  onCtaClick(href: string, target?: string, event?: MouseEvent): void {
    if (href.startsWith('#')) {
      event?.preventDefault();
      const id = href.slice(1);
      const node = document.getElementById(id);
      node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.open = false;
    }
    // External / file links use anchor default behavior with target=_blank
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.open = false;
  }

  /** Render a tiny inline-formatted text — supports **bold** and \n line breaks */
  formatText(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  }

  /** Format timestamp as HH:MM (e.g., "10:42 AM") */
  formatTime(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
}
