import React, { SetStateAction } from "react";

export function useSearchDebounce(delay = 500) {
    const [search, setSearch] = React.useState<string>("");
    const [searchQuery, setSearchQuery] = React.useState<string>("");
  
    React.useEffect(() => {
      const delayFn = setTimeout(() => setSearch(searchQuery), delay);
      return () => clearTimeout(delayFn);
    }, [searchQuery, delay]);
  
    return [search , setSearchQuery] as const;
  }