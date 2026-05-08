# Diseño / Arquitectura: Ruta `/pos`

Basado en la investigación del código, la ruta `/pos` es el núcleo operativo de las ventas. A continuación, el desglose de sus componentes principales y su funcionalidad:

## 1. Ingreso de Producto y Modo de Entrada
* **PosProductUI** (`pos-product-ui.tsx`): Centro de control para la entrada de datos.
    * **Lectora (Modo Scanner):** Utiliza `PosSearch` para capturar códigos de barras. Al activarse, pone el foco automáticamente en el input para recibir datos del escáner.
    * **Teclado (Modo Manual):** Alterna a una interfaz de búsqueda manual mediante un componente `Combobox`, permitiendo buscar productos por nombre en una lista desplegable.
    * **Lógica:** Se apoya en el hook `useCartProduct` para procesar la selección o el ingreso (tecla **Enter**) y agregarlo al carrito.

## 2. Listado de Items (Carrito)
* **PosMainLeft** (`pos-main-left.tsx`): Gestiona la visualización de los productos seleccionados.
    * Muestra una tabla con las columnas: **Producto, Cantidad, Precio y Total**.
    * Permite acciones rápidas como aumentar/disminuir cantidades (`ButtonAddSubCartItem`) o eliminar un ítem (`Trash2`).
    * Sincronización en tiempo real con `useCartStore` (Zustand) para reflejar cambios en el inventario temporal.

## 3. Método de Pago
* **PosPayment** (`pos-payment.tsx`): Contenedor modal que se dispara al finalizar la venta.
    * Carga el componente `SalePaymentDynamicForm`, encargado de la lógica de cobro.
    * Permite seleccionar el método de pago (**Efectivo, Tarjeta, etc.**) y procesar la transacción final.

## 4. Footer con Opciones
* **PosFooter** (`pos-footer.tsx`): Operaciones administrativas de la caja.
    * **Movimientos de Caja:** Redirige a formularios para ingresar o retirar dinero (`CashRegisterMovementTypeEnum`).
    * **Cerrar Caja:** Facilita el cierre de la jornada mediante `handleRegisterClosure`.
    * **Estado:** Consulta `useCartStore` para identificar la caja abierta y su ID de cierre correspondiente.

## 5. Estructura y Totales
* **PosTemplate / PosMainRight**: Organización del layout general.
    * Mientras el lado izquierdo gestiona los ítems, el lado derecho (`pos-main-right.tsx`) muestra los **Totales** (Subtotal, Impuestos, Total Final) y el botón de acción principal para proceder al pago.

---

**Resumen técnico:** Esta arquitectura separa la entrada de datos (**PosProductUI**), la gestión de estado (**PosMainLeft + cart.store**) y las acciones de cierre/pago (**PosPayment y PosFooter**), manteniendo un flujo de venta rápido y desacoplado.


