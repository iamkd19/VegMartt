import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const CreateBook = (props) => {
  // Define the state with useState hook
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description:"",
    author: "",
    color: "",
    price: "",
    image:"",
  });

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:8082/api/vegs', product)
      .then((res) => {
        setProduct({
            name: "",
            description:"",
            author: "",
            color: "",
            price: "",
            image:"",
        });

        // Push to /
        navigate('/');
      })
      .catch((err) => {
        console.log('Error in post Product!');
      });
  };

  return (
    <div className='CreateBook'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <br />
            <Link to='/' className='btn btn-outline-warning float-left'>
              Show Vegetable List
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Post your Vegetable</h1>
            {/* <p className='lead text-center'>Create new book</p> */}

            <form noValidate onSubmit={onSubmit}>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Name of the Vegetable'
                  name='name'
                  className='form-control'
                  value={product.name}
                  onChange={onChange}
                />
              </div>

              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Description of the Vegetable'
                  name='description'
                  className='form-control'
                  value={product.description}
                  onChange={onChange}
                />
              </div>

              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Farmer Name'
                  name='author'
                  className='form-control'
                  value={product.author}
                  onChange={onChange}
                />
              </div>

              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Color of the Vegetable'
                  name='color'
                  className='form-control'
                  value={product.color}
                  onChange={onChange}
                />
              </div>

              <div className='form-group'>
                <input
                  type='number'
                  placeholder='Price of the Vegetable'
                  name='price'
                  className='form-control'
                  value={product.price}
                  onChange={onChange}
                />
              </div>

              <div className='form-group'>
              <input 
                type="text" 
                placeholder='Vegetable Image URL '
                name="image" 
                className='form-control'
                value={product.image}
                onChange={onChange}
                // id="imageUpload" 
                // accept="image/*"
              />
                </div>


              <input
                type='submit'
                className='btn btn-outline-warning btn-block mt-4'
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBook;