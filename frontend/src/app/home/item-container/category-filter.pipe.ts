import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../../../libs/interfaces/item.interface';

@Pipe({
    name: 'categoryFilter',
    standalone: true
})
export class CategoryFilterPipe implements PipeTransform {
    transform(items: Item[], category: string): Item[] {
        if (!items || category === 'All') return items;
        return items.filter(item => item.category === category);
    }
}
