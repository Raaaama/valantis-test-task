"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterSidebar from "../(components)/FilterSidebar";
import useProductsData from "../(hooks)/useProductsData";
import Products from "../(components)/Products";
import useProductFields from "../(hooks)/useProductFields";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") as string;

  const [filters, setFilters] = useState({});
  const [filtered, setFiltered] = useState<any>(null);

  const {
    isLoading: areFieldsLoading,
    prices,
    brands,
    minPrice,
    maxPrice,
  } = useProductFields();

  const { products, isLoading } = useProductsData(
    page,
    filters,
    filtered,
    prices
  );

  const handleSubmit = (values: any) => {
    let queryString = "";
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((val: any) => {
            queryString += `&${key}=${val}`;
          });
        } else {
          queryString += `&${key}=${value}`;
        }
      }
    });
    router.replace(`?page=1` + queryString);
  };

  const applySearchParams = () => {
    const brands = searchParams.getAll("brands") as string[];
    const max = searchParams.get("maxPrice");
    const min = searchParams.get("minPrice");
    const productName = searchParams.get("productName");

    if (brands.length > 0 || max || min || productName) {
      setFiltered(true);
      let f: any = {};
      if (brands.length > 0) f.brands = brands;

      if (max !== null || min !== null) {
        f.minPrice = min !== null ? parseInt(min) : undefined;
        f.maxPrice = max !== null ? parseInt(max) : undefined;
      }
      if (productName) f.productName = productName;
      setFilters(f);
    } else {
      setFiltered(false);
    }
  };

  useEffect(() => {
    applySearchParams();
    if (page === null) router.replace(`?page=1`);
  }, []);

  useEffect(() => {
    applySearchParams();
  }, [searchParams]);

  return (
    <main className="flex p-24">
      <div className="w-1/6 p-4 flex flex-col">
        <FilterSidebar
          isLoading={areFieldsLoading}
          brands={brands}
          minPrice={minPrice}
          maxPrice={maxPrice}
          handleSubmit={handleSubmit}
        />
      </div>
      <div className="w-5/6 p-4">
        <Products
          products={
            filtered
              ? products.slice((parseInt(page) - 1) * 50, parseInt(page) * 50)
              : products
          }
          isLoading={isLoading}
          page={page}
        />
      </div>
    </main>
  );
}
