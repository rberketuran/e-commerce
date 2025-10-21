import { Component, Input } from '@angular/core';
import { Item } from "../../../libs/interfaces/item.interface";
import { SAMPLE_DATA } from "./sample-data";
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../libs/services/item.service';
import { CategoryFilterPipe } from './category-filter.pipe';
import { ItemCardComponent } from './item-card/item-card.component';

@Component({
  selector: 'app-item-container',
  imports: [ItemCardComponent, CommonModule, CategoryFilterPipe],
  templateUrl: './item-container.component.html',
  styleUrls: ['./item-container.component.css']
})
export class ItemContainerComponent {
  //items: Item[] = SAMPLE_DATA;

  @Input({ required: true }) public category: string = 'All';

  public items: Item[] = []; // Initialize as an empty array
  public errorMessage: string = '';

  constructor(private itemService: ItemService) { }

  ngOnInit() {
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
