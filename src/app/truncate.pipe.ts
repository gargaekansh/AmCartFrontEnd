import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (!value) return '';
    if (value.length <= limit) return value;

    const lastSpaceIndex = value.lastIndexOf(' ', limit);
    return (
      value.substring(0, lastSpaceIndex > 0 ? lastSpaceIndex : limit) + '...'
    );
  }
}
