export interface ProductTypes {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
    type: string;
  };
  is_active: boolean;
}
