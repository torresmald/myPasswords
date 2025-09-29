import { Category } from '@/category/interfaces';
import { Password } from '@/passwords/interfaces';
import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  // Overload signatures for type safety
  transform(value: Category[], text: string, type: 'category'): Category[];
  transform(value: Password[], text: string, type: 'password'): Password[];

  // Implementation signature
  transform(
    value: Category[] | Password[],
    text: string,
  ): Category[] | Password[] {
    if (!text) return value;
    return value.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
  }
}
