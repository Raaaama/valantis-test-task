import { IProduct } from "@/interfaces/IProduct";
import Link from "next/link";

interface ProductsProps {
  products: IProduct[];
  isLoading: boolean;
  page: string;
}

const Products: React.FC<ProductsProps> = (props) => {
  const { products, isLoading, page } = props;

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          products.map((item: IProduct) => (
            <div key={item.id} className="border-2 p-4">
              <p>ID: {item.id}</p>
              <p>Название: {item.product}</p>
              <p>Цена: {item.price}</p>
              <p>Бренд: {item.brand ? item.brand : "нет бренда"}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-center p-4">
        {+page > 1 && (
          <Link
            href={`/?page=${+page - 1}`}
            passHref
            className="bg-grey-500 text-white py-2 px-4"
          >
            {+page - 1}
          </Link>
        )}
        <span className="bg-gray-200 text-black py-2 px-4">{page}</span>
        <Link
          href={`/?page=${+page + 1}`}
          passHref
          className="bg-grey-500 text-white py-2 px-4"
        >
          {+page + 1}
        </Link>
      </div>
    </>
  );
};

export default Products;
