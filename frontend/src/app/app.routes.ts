import { Routes } from '@angular/router';
import { Cart } from './cart/cart';
import { ItemContainer } from './item-container/item-container';
import { ItemDetail } from './item-detail/item-detail';

export const routes: Routes = [
    { path: '', component: ItemContainer },
    { path: 'cart', component: Cart },
    { path: 'items/:id', component: ItemDetail }
];
