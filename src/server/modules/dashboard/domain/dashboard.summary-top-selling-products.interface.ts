import type { TopSellingProduct } from "./dashboard.top-selling-product.interface";

export interface SummaryTopSellingProducts {
  topByQuantity: TopSellingProduct[];
  topByAmount: TopSellingProduct[];
}
