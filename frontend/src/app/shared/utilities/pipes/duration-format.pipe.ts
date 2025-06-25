import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '0 min';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);

    let result = '';
    if (hours > 0) {
      result += `${hours} h `;
    }
    result += `${minutes} min`;

    return result.trim();
  }

}
