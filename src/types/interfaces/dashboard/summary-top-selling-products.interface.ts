import type { TopSellingProduct } from "./top-selling-product.interface";

export interface SummaryTopSellingProducts {
  topByQuantity: TopSellingProduct[];
  topByAmount: TopSellingProduct[];
}
