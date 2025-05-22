export type FaqType = {
  question: string;
  answer: string;
  id: number;
  is_active: boolean;
  products: {
    name: string;
    id: string;
    company: { id: string; name: string };
    company_id: string;
  }[];
};
