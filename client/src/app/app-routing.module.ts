import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import * as Components from './components/index';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: "", component: Components.PostListComponent },
  { path: "create", component: Components.PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: Components.PostCreateComponent, canActivate: [AuthGuard] },
  { path: "login", component: Components.LoginComponent },
  { path: "signup", component: Components.SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
