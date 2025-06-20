import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByMonth',
  standalone: true
})
export class FilterByMonthPipe implements PipeTransform {
  transform(value: any[], month: number): any[] {
    return value.filter(item => item.month === month);
  }
}