import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-router-content',
  imports: [RouterOutlet],
  templateUrl: './router-content.component.html',
  standalone: true,
  styleUrl: './router-content.component.scss'
})
export class RouterContentComponent {

}
