export interface ProductFilter {
  id: number;
  name: string;
  product_used: {
    name: string;
    child_count: number;
    parent_count: number
 }[];
 subsidiaries: {
  id: number;
  name: string;
  product_used: {
    company_name: string;
    request_count: number
  }[];
  type: string;
 abbreviation: string;
 }[];
 type: string;
 abbreviation: string;
}
