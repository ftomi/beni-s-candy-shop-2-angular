export class Basket {
  items: BasketItem[];
}

export class BasketItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}
