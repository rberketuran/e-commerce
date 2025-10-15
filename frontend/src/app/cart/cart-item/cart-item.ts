import { Component, Input, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { CartState, IncrementQuantity, DecrementQuantity } from '../cart.state';
import { CartItem } from '../../home/item-container/item.interface';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AddToCart, RemoveFromCart } from '../cart.state';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-cart-item',
  imports: [CommonModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css'
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  baseUrl: string = environment.apiUrl;

  constructor(private store: Store, private router: Router) { }

  public quantity$!: Observable<number | undefined>;

  ngOnInit() {
    this.quantity$ = this.store.select(CartState.getQuantityById).pipe(
      map(fn => fn(this.item.id))
    );
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

  public remove() {
    this.store.dispatch(new RemoveFromCart(this.item.id));
  }

  public goToDetail(): void {
    this.router.navigate(['/items', this.item.id]);
  }

}
