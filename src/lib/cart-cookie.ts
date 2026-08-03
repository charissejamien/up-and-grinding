import Cookies from "js-cookie";

const CART_COOKIE_KEY = "upg_cart_items";
const COOKIE_EXPIRES_DAYS = 7;

export interface CookieCartItem {
  id: string | number;
  cartItemId: string;
  name: string;
  price: number;
  image_url?: string;
  category: string;
  quantity: number;
  stocks_available: number;
  selected_options?: {
    weight?: string;
    profile?: string;
    grinding?: string;
  } | null;
}

// Get items from cookies
export function getCartFromCookies(): CookieCartItem[] {
  const cookieData = Cookies.get(CART_COOKIE_KEY);
  if (!cookieData) return [];
  try {
    return JSON.parse(cookieData);
  } catch (error) {
    console.error("Error parsing cart cookie:", error);
    return [];
  }
}

// Save cart to cookies
export function saveCartToCookies(cart: CookieCartItem[]): void {
  Cookies.set(CART_COOKIE_KEY, JSON.stringify(cart), {
    expires: COOKIE_EXPIRES_DAYS,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
}

// Clear cart cookie
export function clearCartCookie(): void {
  Cookies.remove(CART_COOKIE_KEY);
}