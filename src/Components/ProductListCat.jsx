import React, { useState, useEffect } from "react";
import ProductCardCat from "./ProductCardCat";
import styles from "./ProductListCat.module.css";
import getProductsFromFirestore from "./ProductData";

const ProductListCat = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProductsFromFirestore();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  // Calculate indexes for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className={styles.productList}>
        {currentProducts.map((product, index) => (
          <ProductCardCat
            key={index} // Ensure each key is unique
            product={product}
          />
        ))}
      </div>
      <ul className={styles.pagination}>
        <li
          onClick={prevPage}
          className={currentPage === 1 ? styles.disabled : ""}
        >
          Previous
        </li>
        {Array.from({ length: totalPages }, (_, index) => (
          <li
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? styles.active : ""}
          >
            {index + 1}
          </li>
        ))}
        <li
          onClick={nextPage}
          className={currentPage === totalPages ? styles.disabled : ""}
        >
          Next
        </li>
      </ul>
    </div>
  );
};

export default ProductListCat;
