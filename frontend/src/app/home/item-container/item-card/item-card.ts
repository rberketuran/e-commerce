import { Component, Input, Output } from '@angular/core';
import { Item } from "../item.interface";
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { AddToCart, IncrementQuantity, DecrementQuantity, RemoveFromCart, CartState } from '../../../cart/cart.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-item-card',
  imports: [CommonModule, CurrencyPipe, AsyncPipe],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css'
})
export class ItemCard {
  /*   item: Item = {
      title: 'Sample Item',
      imageUrl: 'https://placehold.co/400',
      price: 29.99
    }; */

  @Input({ required: true }) item!: Item;
  public baseUrl: string = environment.apiUrl;


  public quantity$!: Observable<number | undefined>;
  constructor(private store: Store, private router: Router) { };

  ngOnInit() {
    this.quantity$ = this.store.select(CartState.getQuantityById).pipe(
      map(fn => fn(this.item.id))
    );
    console.log(this.baseUrl)
  }


  public increment() {
    const getQuantityById = this.store.selectSnapshot(CartState.getQuantityById);
    const current = getQuantityById(this.item.id);
    if (current === 0) {
      this.store.dispatch(new AddToCart(this.item));
    } else {
      this.store.dispatch(new IncrementQuantity(this.item.id));
    }
    console.log(current);
  }

  public decrement() {
    const getQuantityById = this.store.selectSnapshot(CartState.getQuantityById);
    const current = getQuantityById(this.item.id);
    if (current <= 1) {
      this.store.dispatch(new RemoveFromCart(this.item.id));
      return;
    } else {
      this.store.dispatch(new DecrementQuantity(this.item.id));
    }
  }

  public goToDetail(): void {
    this.router.navigate(['/items', this.item.id]);
  }


}
