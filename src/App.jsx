import { useEffect, useState } from "react";
import "./App.css";
import LabelCheckbox from "./components/LabelCheckbox";
import { Product } from "./components/product";

function App() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  const [priceFilter, setPriceFilter] = useState("");
  const [sizesFilter, setSizesFilter] = useState("");
  const [brandsFilter, setBrandsFilter] = useState("");
  const [idealForFilter, setIdealForFilters] = useState("");

  const fetchProducts = async () => {
    const products = await require("./data.json");
    setAllProducts(products);
    setProducts(products);
    setAvailableBrands(
      Array.from(new Set(products.map((product) => product.productBrand)))
    );
  };

  const clearAllFilters = () => {
    setPriceFilter("");
    setSizesFilter("");
    setBrandsFilter("");
    setIdealForFilters("");
  };

  // Fetching
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filteredProducts = allProducts;

    // Prices
    // https://stackoverflow.com/questions/50288154/react-component-doesnt-rerender-after-sorting-array-in-store
    filteredProducts = [...filteredProducts].sort((productA, productB) => {
      if (priceFilter === "lowToHigh") {
        return (
          parseInt(productA.pricing.finalPrice.decimalValue) -
          parseInt(productB.pricing.finalPrice.decimalValue)
        );
      } else if (priceFilter === "highToLow") {
        return (
          parseInt(productB.pricing.finalPrice.decimalValue) -
          parseInt(productA.pricing.finalPrice.decimalValue)
        );
      } else {
        return 1;
      }
    });

    // Ideal for
    if (idealForFilter) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.idealFor === idealForFilter;
      });
    }

    // Brands
    if (brandsFilter) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.productBrand === brandsFilter;
      });
    }

    // Sizes
    if (sizesFilter) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.titles.coSubtitle.split(" ")[1] === sizesFilter;
      });
    }

    setProducts(filteredProducts);
  }, [priceFilter, brandsFilter, idealForFilter, sizesFilter, allProducts]);

  const onChangePricesFilter = (e, filter) => {
    if (e.target.checked) {
      if (filter === "lowToHigh") {
        setPriceFilter("lowToHigh");
      } else {
        setPriceFilter("highToLow");
      }
    } else {
      setPriceFilter("");
    }
  };

  const onChangeSizesFilter = (e, filter) => {
    if (e.target.checked) {
      setSizesFilter(filter);
    } else {
      setSizesFilter("");
    }
  };

  const onChangeBrandsFilter = (e, filter) => {
    if (e.target.checked) {
      setBrandsFilter(filter);
    } else {
      setBrandsFilter("");
    }
  };

  const onChangeIdealForFilter = (e, filter) => {
    if (e.target.checked) {
      setIdealForFilters(filter);
    } else {
      setIdealForFilters("");
    }
  };

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="flex min-h-screen">
      <div className="w-72 bg-slate-300 p-4">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md mb-2"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </button>

        <div className="my-3">
          <p className="mb-1">Prices</p>
          <LabelCheckbox
            value={priceFilter}
            onChange={onChangePricesFilter}
            title={"Low to High"}
            identity={"lowToHigh"}
          />
          <LabelCheckbox
            value={priceFilter}
            onChange={onChangePricesFilter}
            title={"High to Low"}
            identity={"highToLow"}
          />
        </div>

        <div className="my-3">
          <p className="mb-1">Sizes</p>
          {sizes.map((size) => (
            <LabelCheckbox
              key={size}
              value={sizesFilter}
              onChange={onChangeSizesFilter}
              title={size}
              identity={size}
            />
          ))}
        </div>

        <div className="my-3">
          <p className="mb-1">Brands</p>
          {availableBrands.map((brand) => (
            <LabelCheckbox
              key={brand}
              value={brandsFilter}
              onChange={onChangeBrandsFilter}
              title={brand}
              identity={brand}
            />
          ))}
        </div>

        <div className="my-3">
          <h5 className="mb-1">Ideal for</h5>
          <LabelCheckbox
            value={idealForFilter}
            onChange={onChangeIdealForFilter}
            title={"Men"}
            identity={"MEN"}
          />
          <LabelCheckbox
            value={idealForFilter}
            onChange={onChangeIdealForFilter}
            title={"Women"}
            identity={"WOMEN"}
          />
        </div>
      </div>
      <div
        className="p-4 grid w-full"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(208px, 1fr)",
          justifyItems: "center",
        }}
      >
        {products.length > 0 ? (
          products.map((product) => <Product key={product.id} {...product} />)
        ) : (
          <p>No products to show.</p>
        )}
      </div>
    </div>
  );
}

export default App;
