import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'symbol',
})
export class SymbolPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (args === 'price') {
      return '$' + value;
    } else {
      return value;
    }
  }
}
