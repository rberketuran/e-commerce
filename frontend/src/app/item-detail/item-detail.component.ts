import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { CartState } from '../store/states/cart.state';
import { AddToCart, IncrementQuantity, DecrementQuantity, RemoveFromCart } from '../store/actions/cart.actions';
import { ItemService } from '../../libs/services/item.service';
import { environment } from '../../environments/environment';
import { Item } from '../../libs/interfaces/item.interface';
// import { SAMPLE_DATA } from '../item-container/sample-data';

@Component({
  selector: 'app-item-detail',
  imports: [CurrencyPipe, AsyncPipe, CommonModule],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent {
  baseUrl: string = environment.apiUrl;
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

