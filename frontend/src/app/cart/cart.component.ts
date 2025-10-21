import { Component } from '@angular/core';
import { CartItemComponent } from "./cart-item/cart-item.component";
import { Select, Store } from '@ngxs/store';
import { CartState } from '../store/states/cart.state';
import { CartItem } from '../../libs/interfaces/item.interface';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, AsyncPipe, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  constructor(private store: Store) { }
  // Get the cart items from the store
  @Select(CartState.getItems) cartItems$!: Observable<CartItem[]>;

  ngOnInit() {
    this.cartItems$ = this.store.select(CartState.getItems);
  }

  public getTotalAmount(items: CartItem[]): number {
    return items.reduce((acc, curr) => acc + (curr.price * (curr.quantity || 0)), 0);
  }

}
