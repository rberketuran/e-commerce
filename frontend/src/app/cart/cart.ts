import { Component } from '@angular/core';
import { CartItemComponent } from "./cart-item/cart-item";
import { Select, Store } from '@ngxs/store';
import { CartState } from './cart.state';
import { CartItem } from '../home/item-container/item.interface';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, AsyncPipe, CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  constructor(private store: Store) { }
  // Get the cart items from the store
  @Select(CartState.getItems) cartItems$!: Observable<CartItem[]>;

  ngOnInit() {
    this.cartItems$ = this.store.select(CartState.getItems);
    console.log(this.cartItems$.subscribe(items => console.log(items)));
  }
}
