import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthData } from '../models/auth-data.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.apiUrl + '/user';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  createUser(fullName: string, email: string, password: string) {
    const authData: AuthData = {
      fullName: fullName,
      email: email,
      password: password
    }
    return this.http.post(this.baseUrl + "/signup", authData).subscribe(() => {
      this.router.navigate(['/']);
    })
  }
}
