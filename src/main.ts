import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimations()],
})
  .then(() => {
    // Keep loader visible long enough for the cube + terminal sequence to finish
    const start = (window as any).__appStart || performance.now();
    const elapsed = performance.now() - start;
    const minVisible = 5600;
    const wait = Math.max(0, minVisible - elapsed);

    setTimeout(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('app-ready');
        document.body.classList.remove('is-loading');
        // Fully remove after the fade transition completes
        setTimeout(() => {
          const loader = document.getElementById('app-loader');
          if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        }, 800);
      });
    }, wait);
  })
  .catch(err => {
    console.error(err);
    document.body.classList.add('app-ready');
    document.body.classList.remove('is-loading');
  });
