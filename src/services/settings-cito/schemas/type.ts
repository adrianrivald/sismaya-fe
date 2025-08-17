export type SettingCitoType = {
  abbreviation: string;
  additional_quota: number;
  cito_type: string;
  id: number;
  initial_quota: number;
  name: string;
  quota_used: number;
  remaining_quota: number;
  subsidiaries: SubsidiariesType[];
  total_quota: number;
  type: string;
};

export type SubsidiariesType = {
  abbreviation: string;
  additional_quota: number;
  cito_type: string;
  id: number;
  initial_quota: number;
  name: string;
  quota_used: number;
  remaining_quota: number;
  total_quota: number;
  type: string;
};

export type InitialCitoType = {
  cito_type: string;
  initial: {
    company_name: string;
    id: number;
    quota: number;
    type: string;
  }[];
};

export type AdditionalCitoListType = {
  details: {
    company_name: string;
    id: number;
    quota: number;
  }[];
  documents:
    | string[]
    | {
        cito_additional_quota_id: number;
        document: string;
        id: string;
        created_at: string;
        updated_at: string;
      }[];
  id: number;
  po_number: string;
};

export type CitoHistoryType = {
  company_name: string[];
  date: string;
  time: string;
  documents: {
    cito_additional_quota_id: number;
    document: string;
    id: number;
    created_at: string;
    updated_at: string;
  }[];
  id: number;
  po_number: string[];
  quota_after: string[];
  quota_before: string[];
  quota_type: string;
  user: string;
};
