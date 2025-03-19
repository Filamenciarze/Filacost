import { Component } from '@angular/core';
import {ContainerComponent} from './core/layout/container/container.component';

@Component({
  selector: 'app-root',
  imports: [ContainerComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
