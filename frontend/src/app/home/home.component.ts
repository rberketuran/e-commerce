import { Component } from '@angular/core';
import { ItemContainerComponent } from './item-container/item-container.component';
import { CATEGORIES } from '../shared/categories';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ItemContainerComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public categories: string[] = CATEGORIES;
  public selectedCategory: string = 'All';

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

}
