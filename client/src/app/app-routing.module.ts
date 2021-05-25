import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import * as Components from './components/index';

const routes: Routes = [
  { path: "", component: Components.PostListComponent },
  { path: "create", component: Components.PostCreateComponent },
  { path: "edit/:postId", component: Components.PostCreateComponent },
  { path: "login", component: Components.LoginComponent },
  { path: "signup", component: Components.SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
