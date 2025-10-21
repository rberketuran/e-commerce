import { Component, Input, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { CartState } from '../../store/states/cart.state';
import { CartItem } from '../../../libs/interfaces/item.interface';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AddToCart, IncrementQuantity, DecrementQuantity, RemoveFromCart } from '../../store/actions/cart.actions';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-cart-item',
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
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
