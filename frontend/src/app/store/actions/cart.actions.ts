import { Item } from '../../../libs/interfaces/item.interface';

export class AddToCart {
    static readonly type = '[Cart] Add';
    constructor(public payload: Item) { }
}

export class IncrementQuantity {
    static readonly type = '[Cart] Increment Quantity';
    constructor(public payload: number) { } // item id
}

export class DecrementQuantity {
    static readonly type = '[Cart] Decrement Quantity';
    constructor(public payload: number) { } // item id
}

export class RemoveFromCart {
    static readonly type = '[Cart] Remove';
    constructor(public payload: number) { } // item id
}