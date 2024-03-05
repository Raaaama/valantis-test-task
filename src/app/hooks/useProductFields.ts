import { useState, useEffect } from "react";
import { request } from "../utils/api"

const useProductFields = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [prices, setPrices] = useState<number[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const getFields = async (field: string): Promise<number[] | string[]> => {
    try {
      const data = await request("get_fields", { field: field, offset: 0 });
      return data.result || [];
    } catch (e) {
      console.error("Error getting ids:", e);
      throw e;
    }
  };

  useEffect(() => {
    setIsLoading(true)
    const getAllFields = async () => {
      try {
        const p = await getFields("price") as number[];
        let temp = Array.from(new Set(p)).sort((a, b) => a - b);
        setPrices(temp);
        setMinPrice(temp[0])
        setMaxPrice(temp[temp.length - 1])
        const b = await getFields("brand") as string[];
        temp = Array.from(new Set(b.filter((brand) => brand !== null))).sort();
        setBrands(temp);
        setIsLoading(false)
      } catch (e) {
        console.error("Error getting fields", e);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        return getAllFields();
      }
    };
    getAllFields()
  }, []);

  return {
    isLoading,
    prices,
    brands,
    minPrice,
    maxPrice,
  }
}

export default useProductFields