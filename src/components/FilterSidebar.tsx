import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface FormValues {
  minPrice: number;
  maxPrice: number;
  brands: string[];
}

interface FilterSidebarProps {
  isLoading: boolean;
  minPrice: number;
  maxPrice: number;
  brands: string[];
  handleSubmit: (values: FormValues) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  const { isLoading, minPrice, maxPrice, brands, handleSubmit } = props;

  const validationSchema = Yup.object().shape({
    minPrice: Yup.number().min(0),
    maxPrice: Yup.number().min(0),
  });

  return (
    <>
      {isLoading ? (
        <a>Loading...</a>
      ) : (
        <Formik
          initialValues={{
            productName: "",
            minPrice: minPrice,
            maxPrice: maxPrice,
            brands: [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <a className="text-xl py-4">Product name</a>
              <Field
                name="productName"
                type="text"
                placeholder="product name"
                className="p-2 mb-2 border-gray-300 rounded-md w-full text-black"
              />
              <a className="text-xl py-4">Price</a>
              <Field
                name="minPrice"
                type="number"
                placeholder="Min Price"
                className="p-2 mb-2 border-gray-300 rounded-md w-full text-black"
              />
              {errors.minPrice && touched.minPrice && (
                <div className="text-red-600">{errors.minPrice}</div>
              )}
              <Field
                name="maxPrice"
                type="number"
                placeholder="Max Price"
                className="p-2 mb-2 border-gray-300 rounded-md w-full text-black"
              />
              {errors.maxPrice && touched.maxPrice && (
                <div className="text-red-600">{errors.maxPrice}</div>
              )}
              <a className="text-xl py-4">Brand</a>
              {brands.map((brand, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={`brands.${brand}`}
                    id={`brand-${index}`}
                    value={brand}
                    checked={values.brands.includes(brand)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const selectedBrands = [...values.brands];

                      if (isChecked) {
                        selectedBrands.push(brand);
                      } else {
                        const indexToRemove = selectedBrands.indexOf(brand);
                        if (indexToRemove !== -1) {
                          selectedBrands.splice(indexToRemove, 1);
                        }
                      }

                      setFieldValue("brands", selectedBrands);
                    }}
                  />
                  <label htmlFor={`brand-${index}`}>{brand}</label>
                </div>
              ))}
              <button
                type="submit"
                className="bg-white text-black p-4 my-4 w-full"
              >
                Применить
              </button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default FilterSidebar;
