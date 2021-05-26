import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  public userIsAuthenticated: boolean = false;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      (isAuthentaicated) => {
        this.userIsAuthenticated = isAuthentaicated;
      }
    );
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
