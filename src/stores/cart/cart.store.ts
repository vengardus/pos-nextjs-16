import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProduct } from "@/types/interfaces/sales/cart-product.interface";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { AppConstants } from "@/constants/app.constants";
import { CashRegisterOpen } from "@/types/interfaces/cash-register/cash-register-open.interface";

interface State {
  cart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (id: string) => void;
  getSummaryCart: () => {
    subTotal: number;
    tax: number;
    total: number;
    totalItems: number;
  };
  clearCart: () => void;
  isKeyboardMode: boolean;
  setIsKeyboardMode: (value: boolean) => void;
  isOpenModalSalePayment: boolean;
  setIsOpenModalSalePayment: (value: boolean) => void;
  paymentMethod: PaymentMethodEnum;
  setPaymentMethod: (value: PaymentMethodEnum) => void;
  clientId: string;
  setClientId: (value: string) => void;
  isOpenTicketModal: boolean;
  setIsOpenTicketModal: (value: boolean) => void;
  b64: string;
  setB64: (value: string) => void;
  
  cashRegisterOpen: CashRegisterOpen;     // caja aperturda con su sucursal correspondiente
  setCashRegisterOpen: (value: CashRegisterOpen) => void;

  branchId: string; // sucursal del usuario (la encontrada por defecto en la ruta)
  setBranchId: (branchId: string) => void;
  
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      isKeyboardMode: false,
      isOpenModalSalePayment: false,
      paymentMethod: PaymentMethodEnum.CASH,
      clientId: "",
      isOpenTicketModal: false,
      b64: "",
      cashRegisterOpen: {} as CashRegisterOpen,
      branchId: "",

      setIsKeyboardMode: (value) => set({ isKeyboardMode: value }),

      addProductToCart: (product: CartProduct) => {
        // 1. Si producto con size no existe en carrito : agregarlo
        const { cart } = get();

        const productInCart = cart.some((item) => item.id === product.id);

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 2. El producto existe: incremetar cantidad
        const newCart = cart.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
            };
          }
          return item;
        });

        // 3. Actualiar cart

        set({ cart: newCart });
      },

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((accum, current) => accum + current.quantity, 0);
      },

      updateProductQuantity: (product, quantity) => {
        const { cart } = get();
        const updateCart = cart.map((item) => {
          if (item.id === product.id)
            return {
              ...item,
              quantity: quantity,
              total: item.price * quantity,
            };
          return item;
        });
        set({ cart: updateCart });
      },

      removeProduct: (id) => {
        const { cart } = get();
        const updateCart = cart.filter((item) => !(item.id === id));
        set({ cart: updateCart });
      },

      getSummaryCart: () => {
        const { cart, getTotalItems } = get();
        const subTotal = cart.reduce(
          (accum, current) => accum + current.price * current.quantity,
          0
        );
        const tax = subTotal * (AppConstants.DEFAULT_VALUES.igv / 100);
        const total = Math.round((subTotal + tax) * 100) / 100;
        const totalItems = getTotalItems();

        return {
          subTotal,
          tax,
          total,
          totalItems,
        };
      },

      clearCart: () => {
        set({ cart: [] });
      },

      setIsOpenModalSalePayment: (value) => set({ isOpenModalSalePayment: value }),

      setPaymentMethod: (value) => set({ paymentMethod: value }),

      setClientId: (value) => set({ clientId: value }),

      setIsOpenTicketModal: (value) => set({ isOpenTicketModal: value }),

      setB64: (value) => set({ b64: value }),

      setCashRegisterOpen: (value) => set({ cashRegisterOpen: value }),

      setBranchId: (branchId) => set({ branchId }),

    }),
    {
      name: "cart-store",
    }
  )
);
