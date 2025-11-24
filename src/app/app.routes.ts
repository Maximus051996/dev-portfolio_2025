import { Routes } from '@angular/router';

// Import all standalone components
import { Bio } from './pages/bio/bio';

export const routes: Routes = [
  { path: '', redirectTo: 'dev-profile', pathMatch: 'full' },

  { path: 'dev-profile', component: Bio },
  // { path: 'tech', component: Tech },
  // { path: 'experience', component: Experience },
  // { path: 'certifications', component: Certifications },
  // { path: 'studies', component: Studies },
  // { path: 'resume', component: Resume },
  // { path: 'contact', component: Contact },

  // Wildcard Route
  { path: '**', redirectTo: 'dev-profile' }
];
