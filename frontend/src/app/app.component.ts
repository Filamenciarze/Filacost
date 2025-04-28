import {Component, OnInit} from '@angular/core';
import {ContainerComponent} from './core/layout/container/container.component';
import {RouterOutlet} from '@angular/router';
import {UserService} from './core/user/services/user.service';
import {User} from './core/user/interfaces/user';

@Component({
  selector: 'app-root',
  imports: [ContainerComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.checkAuthStatus().subscribe({
      next:(status) => {
        this.userService.authenticate();
        this.userService.userData = status.user;
      },
      error:(status) => {
        this.userService.remove_authentication();
        this.userService.userData = {} as User
      }
    });
  }
}
