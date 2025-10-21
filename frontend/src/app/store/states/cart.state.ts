import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CartStateModel } from '../models/cart.model';
import { CART_DEFAULTS } from '../defaults/cart.defaults';
import {
    AddToCart,
    IncrementQuantity,
    DecrementQuantity,
    RemoveFromCart
} from '../actions/cart.actions';
import { CartItem } from '../../../libs/interfaces/item.interface';

@State<CartStateModel>({
    name: 'cart',
    defaults: CART_DEFAULTS
})
export class CartState {
    // 🧭 Selectors
    @Selector()
    static getItems(state: CartStateModel) {
        return state.items;
    }

    @Selector()
    static getQuantityById(state: CartStateModel) {
        return (id: number) => state.items.find(i => i.id === id)?.quantity ?? 0;
    }

    @Selector()
    static getCartCount(state: CartStateModel) {
        return state.items.length;
    }

    // ⚡ Actions
    @Action(AddToCart)
    add({ getState, patchState }: StateContext<CartStateModel>, { payload }: AddToCart) {
        const state = getState();
        const existing = state.items.find(i => i.id === payload.id);

        if (!existing) {
            const cartItem: CartItem = { ...payload, quantity: 1 };
            patchState({ items: [...state.items, cartItem] });
        }
    }

    @Action(IncrementQuantity)
    increment({ getState, patchState }: StateContext<CartStateModel>, { payload }: IncrementQuantity) {
        const state = getState();
        patchState({
            items: state.items.map(i =>
                i.id === payload ? { ...i, quantity: i.quantity + 1 } : i
            )
        });
    }

    @Action(DecrementQuantity)
    decrement({ getState, patchState }: StateContext<CartStateModel>, { payload }: DecrementQuantity) {
        const state = getState();
        const item = state.items.find(i => i.id === payload);
        if (!item) return;

        patchState({
            items: state.items.map(i =>
                i.id === payload ? { ...i, quantity: i.quantity - 1 } : i
            )
        });
    }

    @Action(RemoveFromCart)
    remove({ getState, patchState }: StateContext<CartStateModel>, { payload }: RemoveFromCart) {
        const state = getState();
        patchState({
            items: state.items.filter(i => i.id !== payload)
        });
    }
}