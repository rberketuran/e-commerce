export interface Item {
    id: number;
    title: string;
    price: number;
    category: string;
    image_url: string;
    description: string;
    created_at: string;
}

export interface CartItem extends Item {
    quantity: number;
}