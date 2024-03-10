import { useState, useEffect } from "react";
import { IProduct } from "../interfaces/IProduct";
import axios from "axios";
import { request } from "../utils/api";
import { getItemsByIds } from "../utils/api";

const useProductsData = (
  page: string,
  filters: any,
  filtered: boolean,
  prices: number[]
) => {
  const pageSize = 50;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getIds = async (offset: number, limit: number) => {
    try {
      const data = await request("get_ids", { offset, limit });
      return data.result || [];
    } catch (e) {
      console.error("Error getting ids:", e);
    }
  };

  async function getProductsByValues(
    fieldName: string,
    values: any[]
  ): Promise<string[]> {
    let allIds: string[] = [];
    for (const value of values) {
      let success = false;
      while (!success) {
        try {
          const params = {
            [fieldName]: value,
          };
          const data = await request("filter", JSON.stringify(params));
          const ids: string[] = data.result || [];
          allIds = allIds.concat(ids);
          success = true;
        } catch (error) {
          console.error(
            `Error fetching products for ${fieldName} ${value}:`,
            error
          );
        }
      }
    }

    return allIds;
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        let commonIds = [] as string[];
        if (filtered) {
          let byBrands = [] as string[];
          let filteredByBrands = false;

          if (filters.brands?.length > 0) {
            byBrands = await getProductsByValues("brand", filters.brands);
            filteredByBrands = true;
            commonIds = byBrands;
          }

          let byPrices = [] as string[];
          let filteredByPrices = false;

          if (
            (filters.minPrice !== prices[0] ||
              filters.maxPrice !== prices[prices.length - 1]) &&
            prices.length > 0
          ) {
            let p = [];
            for (let i = 0; i < prices.length; i++) {
              if (prices[i] > filters.maxPrice) break;
              if (prices[i] > filters.minPrice && prices[i] < filters.maxPrice)
                p.push(prices[i]);
            }

            byPrices = await getProductsByValues("price", p);
            filteredByPrices = true;

            if (filteredByBrands) {
              commonIds = byBrands.filter((id) => byPrices.includes(id));
            } else {
              commonIds = byPrices;
            }
          }

          let byName = [] as string[];
          if (filters.productName) {
            byName = await getProductsByValues("product", [
              filters.productName,
            ]);
            if (filteredByPrices && filteredByBrands) {
              commonIds = byBrands.filter(
                (id) => byPrices.includes(id) && byName.includes(id)
              );
            } else if (filteredByPrices) {
              commonIds = byPrices.filter((id) => byName.includes(id));
            } else if (filteredByBrands) {
              commonIds = byBrands.filter((id) => byName.includes(id));
            } else {
              commonIds = byName;
            }
          }

          const items = await getItemsByIds(commonIds);
          const unique = items.filter(
            (item: IProduct, index: number, self: any) =>
              index === self.findIndex((p: IProduct) => p.id === item.id)
          );
          setProducts(unique);
        } else if (filtered === false) {
          const offset = (parseInt(page as string) - 1) * pageSize;
          const ids = await getIds(offset, pageSize);
          const items = await getItemsByIds(ids);
          const unique = items.filter(
            (item: IProduct, index: number, self: any) =>
              index === self.findIndex((p: IProduct) => p.id === item.id)
          );
          setProducts(unique);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, filters, filtered]);

  return {
    products,
    isLoading,
  };
};

export default useProductsData;
