import { Component } from '@angular/core';
import { ItemContainer } from './item-container/item-container';
import { CATEGORIES } from '../shared/categories';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ItemContainer, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  public categories: string[] = CATEGORIES;
  public selectedCategory: string = 'All';

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

}
