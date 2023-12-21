import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import toast, { Toaster } from 'react-hot-toast';

function ProductList() {
  const user = useSelector((state) => state.user);
  const id = user._id;
  const isAuthenticated = user.isAuthenticated;
  const [vegs, setVegs] = useState([]);
  const [filteredVegs, setFilteredVegs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8082/products/all');
        setVegs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error from Server:', error);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = async (productId, seller_id, p_name, p_image, price) => {
    try {
      const response = await axios.put(`http://localhost:8082/add2cart/${id}`, {
        productId,
        seller_id,
        p_name,
        p_image,
        price,
      });
      console.log(response.data.message);
      // toast.success('Item added to cart successfully!');
      alert(response.data.message);
    } catch (error) {
      // console.error('Error adding to cart:', error);
      alert("Failed to add to Cart");
      // toast.error('Error adding item to cart');
    }
  };

  useEffect(() => {
    setFilteredVegs(vegs); // Initialize filteredVegs with all products
  }, [vegs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log(searchTerm);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    console.log(categoryFilter);
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
    console.log(priceFilter);
  };

  const handleFilterSubmit = (e) => {

    // Filter the products based on searchTerm, categoryFilter, and priceFilter
    const filteredProducts = vegs.filter((product) => {
      const matchesSearchTerm = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesPrice = !priceFilter || product.price <= parseInt(priceFilter, 10);
      return matchesSearchTerm && matchesCategory && matchesPrice;
    });
    setFilteredVegs(filteredProducts); // Update the filtered products state
    console.log("Search complete");
    e.preventDefault();
  };

  const productList =
    loading ? (
      'Loading...'
    ) : filteredVegs.length === 0 ? (
      'No matching products found.'
    ) : (
      filteredVegs.map((item, k) => (
        <ProductCard key={k} product={item} addToCart={() => addToCart(item._id, item.seller_id, item.name, item.image, item.price)} />
      ))
    );

  return (
    <div className=" mx-auto mt-8  bg-white shadow-md rounded-md">
      <div className="form-container flex">
        <form onSubmit={handleFilterSubmit} className="w-full flex">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search by product name"
            onChange={handleSearchChange}
            className="w-full h-10 border rounded mr-4"
          />
          <select onChange={handleCategoryChange} className="w-full h-10 border rounded mr-4">
            <option disabled>All Categories</option>
            <option value="Fruit">Fruit</option>
            <option value="Flower">Flower</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Home Made">Home Made</option>
          </select>
          <input
            type="number"
            placeholder="Max Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full h-10 border rounded mr-4"
          // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button type="submit" className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {productList}
      </div>

    </div>
  );
}
export default ProductList;