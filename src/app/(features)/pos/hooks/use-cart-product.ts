import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Product } from "@/types/interfaces/product/product.interface";
import type { Sale } from "@/types/interfaces/sales/sale.interface";
import type{ PosPayment } from "@/types/interfaces/pos-payment/pos-payment.interface";
import { AppConstants } from "@/constants/app.constants";
import { useCartStore } from "@/stores/cart/cart.store";
import { useClientSupplierStore } from "@/stores/client-supplier/client-supplier.store";
import { useCompanyStore } from "@/stores/company/company.store";
import { useProductStore } from "@/stores/product/product.store";
import { useRealTimeStore } from "@/stores/general/real-time.store";
import { saleInsert } from "@/actions/sales/sale.insert.action";
import { generateSaleTicket } from "@/services/tickets/sale/sale-ticket.use-case";

export const useCartProdut = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const cart = useCartStore((state) => state.cart);
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const setIsKeyboardMode = useCartStore((state) => state.setIsKeyboardMode);
  const setB64 = useCartStore((state) => state.setB64);
  const getSummaryCart = useCartStore((state) => state.getSummaryCart);
  //const clearCart = useCartStore((state) => state.clearCart);
  const products = useProductStore((state) => state.products);
  const cashRegisterOpen = useCartStore((state) => state.cashRegisterOpen);
  const company = useCompanyStore((state) => state.company);
  const clientSupplier = useClientSupplierStore(
    (state) => state.clientSupplier
  );
  const setUpdated = useRealTimeStore((state) => state.setUpdated);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    // Limpia el contexto cuando el componente se desmonte
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const addOrUpdateCartProduct = (product: Product) => {
    const currentProduct = cart.find((item) => item.id === product.id);
    const cartProduct = currentProduct
      ? {
          ...currentProduct,
        }
      : {
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.salePrice,
          total: product.salePrice,
        };
    if (!currentProduct) addProductToCart(cartProduct);
    else updateProductQuantity(cartProduct, cartProduct.quantity + 1);
    playBeep();
    setIsKeyboardMode(false);
  };

  const handleSelectProduct = (value: string) => {
    const product = products.find((product) => product.id === value);
    if (!product) {
      toast.error("Producto no encontrado");
      return;
    }
    addOrUpdateCartProduct(product);
  };

  const handleOnKeyDownEnterSearch = (value: string) => {
    const product = products.find((product) => product.barcode === value);
    if (!product) {
      toast.error("Producto no encontrado");
      return;
    }
    addOrUpdateCartProduct(product);
  };

  const saveSale = async (
    setIsLoading: (isLoading: boolean) => void,
    posPayment: PosPayment
  ): Promise<boolean> => {
    if (!cart.length) {
      toast.error("No hay productos en el carrito");
      return false;
    }

    if (!posPayment || !posPayment.paymentDetails.length) {
      toast.error("No se ha realizado el cobro");
      return false;
    }
    setIsLoading(true);

    console.log("BRAnCH.ID", cashRegisterOpen.branchId);  

    const sale: Sale = {
      branchId: cashRegisterOpen.branchId,
      companyId: company.id,
      clientId: clientSupplier.id,
      totalAmount: posPayment.totalSale,
      paymentType: posPayment.paymentMethodId,
      status: AppConstants.DEFAULT_VALUES.states.active,
      totalTaxes: 0,
      balance: 0,
      paidWith: 0,
      cardReference: "",
      change: posPayment.changeDue,
      cash: 0,
      credit: 0,
      card: 0,
      productCount: 0,
      subTotal: 0,
      userId: "",
      id: "",
      SaleDetail: [],
    };

    const resp = await saleInsert(cart, sale, posPayment);

    setIsLoading(false);
    if (!resp.success) {
      toast.error(resp.message);
      return false;
    }
    setUpdated(true);
    toast.success("Venta realizada exitosamente");
    //clearCart();
    return true;
  };

  const handleGenerateTicketSale = async(output: string = "b64", posPayment: PosPayment) => {
    const data = {
      logo: "https://as01.epimg.net/epik/imagenes/2020/08/04/portada/1596535756_527518_1596535915_noticia_normal.jpg",
      cart,
      totals: getSummaryCart(),
      posPayment
    };
    const resp = await generateSaleTicket(output, data);
    setB64(resp?.content ?? "");
  }

  const playBeep = () => {
    if (audioContextRef.current) {
      const beep = new AudioContext();
      const oscillator = beep.createOscillator();
      const gainNode = beep.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(beep.destination);
      oscillator.type = "sine"; // Tipo de onda (puedes experimentar con "square", "sawtooth", "triangle")
      oscillator.frequency.setValueAtTime(440, beep.currentTime); // Frecuencia del beep (440 Hz es un "A")
      gainNode.gain.setValueAtTime(1, beep.currentTime); // Volumen inicial
      oscillator.start();
      oscillator.stop(beep.currentTime + 0.1); // Duración del beep (0.1 segundos)
    }
  };

  return {
    handleSelectProduct,
    handleOnKeyDownEnterSearch,
    saveSale,
    handleGenerateTicketSale,
  };
};
