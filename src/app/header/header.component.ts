import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{

  private authLisenerSubs: Subscription = new Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) { }
  
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authLisenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authLisenerSubs.unsubscribe();
  }
}
