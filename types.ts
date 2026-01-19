
export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Burger' | 'Pizza' | 'Fries' | 'Drinks' | 'Deals' | 'More Fun';
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  isPopular?: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface FilterState {
  category: string;
  sort: 'low-high' | 'high-low' | 'none';
  onlyDiscounted: boolean;
  minRating: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'cancelled' | 'delivered';
  timestamp: number;
  address: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'super-admin' | 'admin' | 'manager' | 'user';
  isAdmin: boolean;
  address?: string;
  street?: string;
  riderNote?: string;
  orderHistory: string[];
}

export interface StoreSettings {
  name: string;
  logo: string;
  isLogoImage: boolean;
}
