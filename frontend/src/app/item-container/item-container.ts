import { Component } from '@angular/core';
import { ItemCard } from "./item-card/item-card";
import { Item } from "./item.interface";
import { SAMPLE_DATA } from "./sample-data";
import { CommonModule } from '@angular/common';
import { ItemService } from './item.service';

@Component({
  selector: 'app-item-container',
  imports: [ItemCard, CommonModule],
  templateUrl: './item-container.html',
  styleUrl: './item-container.css'
})
export class ItemContainer {
  //items: Item[] = SAMPLE_DATA;

  items: Item[] = []; // Initialize as an empty array
  public errorMessage: string = '';

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    console.log('Fetching items from backend...');
    this._fetchItems();
  }


  private _fetchItems() {
    this.itemService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (err) => {
        this.errorMessage = err.message; console.error(err);
        this.items = [];
      }
    });
  }
}
