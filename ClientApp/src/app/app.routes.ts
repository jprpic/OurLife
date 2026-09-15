import { Routes } from '@angular/router';
import { TodoDetailPageComponent } from './components/todo-detail-page/todo-detail-page';
import { TodoPageComponent } from './components/todo-page/todo-page';
import { ToBuyPageComponent } from './components/to-buy-page/to-buy-page';

export const routes: Routes = [
    { path: 'todo/:id', component: TodoDetailPageComponent },
    { path: 'todo', component: TodoPageComponent },
    { path: 'to-buy', component: ToBuyPageComponent },
    { path: '', redirectTo: 'todo', pathMatch: 'full' },
    { path: '**', redirectTo: 'todo' },
];
