// Product class matching Java specification exactly
export class ProductClass {
  colorName: string;
  colorCode: string;
  manufacturedDate: string;
  expiryDate: string;
  quantity: number;
  price: number;
  quality: 'Premium' | 'Standard' | 'Economy';
  texture: 'Matte' | 'Gloss' | 'Satin' | 'Semi-Gloss';
  batch: string;
  plant: string;
  brand: string;
  id: string;

  constructor(
    colorName: string,
    colorCode: string,
    manufacturedDate: string,
    expiryDate: string,
    quantity: number,
    price: number,
    quality: 'Premium' | 'Standard' | 'Economy',
    texture: 'Matte' | 'Gloss' | 'Satin' | 'Semi-Gloss',
    batch: string,
    plant: string,
    brand: string,
    id: string
  ) {
    this.colorName = colorName;
    this.colorCode = colorCode;
    this.manufacturedDate = manufacturedDate;
    this.expiryDate = expiryDate;
    this.quantity = quantity;
    this.price = price;
    this.quality = quality;
    this.texture = texture;
    this.batch = batch;
    this.plant = plant;
    this.brand = brand;
    this.id = id;
  }

  // Additional methods for product management
  updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
  }

  updatePrice(newPrice: number): void {
    this.price = newPrice;
  }

  isLowStock(threshold: number = 50): boolean {
    return this.quantity < threshold;
  }

  isExpired(): boolean {
    const today = new Date();
    const expiry = new Date(this.expiryDate);
    return today > expiry;
  }
}