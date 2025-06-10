import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {Observable, Subscription} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {RouterContentComponent} from '../router-content/router-content.component';
import {MatListItemComponent} from '../../../shared/utilities/components/mat-list-item/mat-list-item.component';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../../user/services/user.service';
import {AuthService} from '../../auth/services/auth.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {User} from '../../user/interfaces/user';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterContentComponent,
    MatListItemComponent,
    NgIf,
    RouterLink,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ]
})
export class ContainerComponent implements OnInit, OnDestroy{
  isHandset$: Observable<boolean>;
  isAuthenticated: boolean = false;
  user: User | null = null;

  isAuthenticatedSubscription!: Subscription;
  userSubscription!: Subscription;

  @ViewChild('drawer') drawer?: MatSidenav;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private authService: AuthService,
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit() {
    this.isAuthenticatedSubscription = this.userService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    })
    this.userSubscription = this.userService.user$.subscribe(user => {
      console.log(user);
      this.user = user;
    })
  }

  ngOnDestroy() {
    this.isAuthenticatedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }


}
