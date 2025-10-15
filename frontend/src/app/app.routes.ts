import { Routes } from '@angular/router';
import { Cart } from './cart/cart';
import { ItemDetail } from './item-detail/item-detail';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'cart', component: Cart },
    { path: 'items/:id', component: ItemDetail }
];
