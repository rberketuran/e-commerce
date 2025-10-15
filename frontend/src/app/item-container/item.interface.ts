export interface Item {
    id: number;
    title: string;
    imageUrl: string;
    price: number;
}

export interface CartItem extends Item {
    quantity: number;
}