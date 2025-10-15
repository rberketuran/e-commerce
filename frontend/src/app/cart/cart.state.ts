import { State, Action, StateContext, Selector } from '@ngxs/store'
import { Item, CartItem } from '../home/item-container/item.interface'

export interface CartStateModel {
    items: CartItem[];
}


// Actions
export class AddToCart {
    static readonly type = '[Cart] Add';
    constructor(public payload: Item) { }; // still send Item
}

export class IncrementQuantity {
    static readonly type = '[Cart] Increment Quantity';
    constructor(public payload: number) { }; // payload = item id
}

export class DecrementQuantity {
    static readonly type = '[Cart] Decrement Quantity';
    constructor(public payload: number) { }; // payload = item id
}

export class RemoveFromCart {
    static readonly type = '[Cart] Remove';
    constructor(public payload: number) { }; // payload = item id 
}


// State
@State<CartStateModel>({
    name: 'cart',
    defaults: {
        items: []
    }
})
export class CartState {

    // Selectors
    @Selector()
    public static getItems(state: CartStateModel) {
        return state.items;
    }

    @Selector()
    public static getQuantityById(state: CartStateModel) {
        return (id: number) => state.items.find(i => i.id === id)?.quantity ?? 0;
    }

    @Selector()
    public static getCartCount(state: CartStateModel) {
        return state.items.length;
    }

    @Action(AddToCart)
    public add({ getState, patchState }: StateContext<CartStateModel>, { payload }: AddToCart) {
        const state = getState();
        const existing = state.items.find(i => i.id === payload.id);

        if (!existing) {
            const cartItem: CartItem = { ...payload, quantity: 1 };
            patchState({ items: [...state.items, cartItem] });
        }
    }

    @Action(IncrementQuantity)
    public increment({ getState, patchState }: StateContext<CartStateModel>, { payload }: IncrementQuantity) {
        const state = getState();
        patchState({
            items: state.items.map(i =>
                i.id === payload ? { ...i, quantity: i.quantity + 1 } : i
            )
        });
    }

    @Action(DecrementQuantity)
    public decrement({ getState, patchState }: StateContext<CartStateModel>, { payload }: DecrementQuantity) {
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
    public remove({ getState, patchState }: StateContext<CartStateModel>, { payload }: RemoveFromCart) {
        const state = getState();

        patchState({
            items: state.items.filter(i =>
                i.id !== payload
            )
        });
    }
}