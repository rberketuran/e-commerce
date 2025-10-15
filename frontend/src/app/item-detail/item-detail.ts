import { Component } from '@angular/core';
// import { SAMPLE_DATA } from '../item-container/sample-data';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../item-container/item.interface';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { AddToCart, CartState, DecrementQuantity, IncrementQuantity, RemoveFromCart } from '../cart/cart.state';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { CommonModule } from '@angular/common';
import { ItemService } from '../item-container/item.service';

@Component({
  selector: 'app-item-detail',
  imports: [CurrencyPipe, AsyncPipe, CommonModule],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.css'
})
export class ItemDetail {
  item!: Item | undefined;

  public quantity$!: Observable<number | undefined>;
  public errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // this.item = SAMPLE_DATA.find(item => item.id === id);
    this.fetchItem(id);
    this.quantity$ = this.store.select(CartState.getQuantityById).pipe(
      map(fn => fn(id))
    );
  }

  private fetchItem(id: number) {
    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        this.item = data;
      },
      error: (err) => {
        this.errorMessage = err.message; console.error(err);
        this.item = undefined;
      }
    });
  }

  public increment() {
    if (!this.item) return;
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
    if (!this.item) return;
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
    if (!this.item) return;
    this.store.dispatch(new RemoveFromCart(this.item.id));
  }



}

