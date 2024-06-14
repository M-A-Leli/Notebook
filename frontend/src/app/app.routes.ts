import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotebookComponent } from './features/notebook/notebook.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'notebook', component: NotebookComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
