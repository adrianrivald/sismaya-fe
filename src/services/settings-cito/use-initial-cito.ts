// import { useQuery } from "@tanstack/react-query";
// import { http } from "src/utils/http";

// async function fetchInitialQuota(params: any, company_id: string) {
//   const baseUrl = window.location.origin;
//   const endpointUrl = new URL(`/initial-quota?company_id=${company_id}`, baseUrl);

//   const { data } = await http<{
//     data: {
//       faq: { question: string; answer: string; is_active: boolean; sort: number; id: number }[];
//       product_name: string;
//     }[];
//   }>(endpointUrl.toString().replace(baseUrl, ''));

//   return data;
// }

// export function useInitialQuota(params: any, company_id: string) {
//   const data = useQuery(['product-faq', params, company_id], () =>
//     fetchInitialQuota(params, company_id)
//   );

//   return data;
// }
