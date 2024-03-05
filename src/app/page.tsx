"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MD5 } from "crypto-js";
import { IProduct } from "@/interfaces/IProduct";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import useProductsData from "./hooks/useProductsData";
import Products from "@/components/Products";
import useProductFields from "./hooks/useProductFields";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") as string;

  const [filters, setFilters] = useState({});
  const [filtered, setFiltered] = useState(false);

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
    console.log(max, prices[prices.length - 1]);

    if (brands.length > 0 || max || min || productName) {
      setFiltered(true);
      let f: any = {};
      if (brands.length > 0) f.brands = brands;

      if (max || min) {
        f.minPrice = parseInt(min);
        f.maxPrice = parseInt(max);
      }
      if (productName) f.productName = productName;
      setFilters(f);
    }
  };

  useEffect(() => {
    applySearchParams();
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
          // products={
          //   filtered
          //     ? products.slice(filterPage - 1 * 50, filterPage * 50)
          //     : products
          // }
          products={products}
          isLoading={isLoading}
          page={page}
          // filterPage={filterPage}
          // setFilterPage={setFilterPage}
          // filtered={filtered}
        />
      </div>
    </main>
  );
}
