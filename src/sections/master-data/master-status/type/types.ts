export interface StatusTypes {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
    type: string;
  };
  isActive: boolean;
}
