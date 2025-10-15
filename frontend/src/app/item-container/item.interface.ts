export interface Item {
    id: number;
    title: string;
    price: number;
    category: string;
    imageUrl: string;
    description: string;
    createdAt: string;
}

export interface CartItem extends Item {
    quantity: number;
}