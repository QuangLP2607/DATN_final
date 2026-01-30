// import { useEffect, useState } from "react";
// import { useDebounce } from "./useDebounce";

// export function useSearch<T>(
//   query: string,
//   fetchFn: (query: string) => Promise<T[]>,
//   delay = 300
// ) {
//   const debouncedQuery = useDebounce(query, delay);

//   const [data, setData] = useState<T[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<unknown>(null);

//   useEffect(() => {
//     const q = debouncedQuery.trim();
//     if (!q) {
//       queueMicrotask(() => {
//         setData([]);
//         setLoading(false);
//         setError(null);
//       });
//       return;
//     }

//     let cancelled = false;

//     queueMicrotask(() => {
//       if (!cancelled) {
//         setLoading(true);
//         setError(null);
//       }
//     });

//     fetchFn(q)
//       .then((res) => {
//         if (!cancelled) setData(res);
//       })
//       .catch((err) => {
//         if (!cancelled) setError(err);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [debouncedQuery, fetchFn]);

//   return {
//     data: debouncedQuery.trim() ? data : [],
//     loading,
//     error,
//   };
// }
