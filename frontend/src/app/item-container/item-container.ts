import { Component } from '@angular/core';
import { ItemCard } from "./item-card/item-card";
import { Item } from "./item.interface";
import { SAMPLE_DATA } from "./sample-data";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-container',
  imports: [ItemCard, CommonModule],
  templateUrl: './item-container.html',
  styleUrl: './item-container.css'
})
export class ItemContainer {
  items: Item[] = SAMPLE_DATA;
}
