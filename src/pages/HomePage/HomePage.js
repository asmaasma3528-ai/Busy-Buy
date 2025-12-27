import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";

import { fetchProducts, getVisibleItems, getLoading, getFilters } from "../../redux/reducers/productsReducer";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/UI/Loader/Loader";

function HomePage() {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState(75000);
  const [categories, setCategories] = useState({
    mensFashion: false,
    electronics: false,
    jewelery: false,
    womensClothing: false,
  });

  const dispatch = useDispatch();
//redux selectors
const products = useSelector(getVisibleItems);
const loading = useSelector(getLoading);

  // Fetch products on app mount
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])
  // Rerender the products if the search or filter parameters change
  useEffect(() => {
    dispatch(getFilters({
      searchText:query,
      maxPrice:priceRange,
      selectedCategory:categories
    }))
  }, [query, priceRange, categories, products.length, dispatch]);
  // Display loader while products are fetching using the Loader Component
  if(loading){
    return <Loader />
  }
  return (
    <div className={styles.homePageContainer}>
      <FilterSidebar
        setPriceRange={setPriceRange}
        setCategories={setCategories}
        priceRange={priceRange}
      />
      <form className={styles.form}>
        <input
          type="search"
          placeholder="Search By Name"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      
      {products.length ? (
        <ProductList />
      ) : null}
    </div>
  );
}

export default HomePage;
