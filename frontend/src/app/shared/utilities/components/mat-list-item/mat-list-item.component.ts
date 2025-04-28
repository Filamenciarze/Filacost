import {Component, Input} from '@angular/core';
import {MatListItem} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-mat-list-item',
  imports: [
    MatListItem,
    MatIcon
  ],
  templateUrl: './mat-list-item.component.html',
  standalone: true,
  styleUrl: './mat-list-item.component.scss'
})
export class MatListItemComponent {
  @Input() text: string = "default";
  @Input() iconName: string = "question_mark";
}
