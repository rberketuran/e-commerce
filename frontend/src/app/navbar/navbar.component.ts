import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartState } from '../store/states/cart.state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private store: Store) { }
  public cartCount$!: Observable<number | undefined>;

  ngOnInit() {
    this.cartCount$ = this.store.select(CartState.getCartCount);
    this.cartCount$.subscribe(count => {
      console.log('Cart count:', count);
    });
  }

}
