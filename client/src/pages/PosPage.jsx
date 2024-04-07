import React, { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import './style.css'

const PosPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
            setProducts(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProductToCart = async(product) => {
        let findProductInCart = await cart.find(i=>{
            return i.id === product.id
        });
    }

    useEffect(() => {
        fetchProducts();
    },[]);

    // useEffect(() => {
    //     console.log(products);
    // }, [products]);

    return (
        <MainLayout>
            <div className='card'>
            <h1 className='title'>Products</h1>
                <ImageList className='row' sx={{ width: 1200, height: 750 }} cols={6}>
                    {isLoading ? 'Loading...' : (
                        products
                            .slice()
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((product) => (
                                <ImageListItem className='block' key={product.id}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                    />
                                    <ImageListItemBar
                                        title={product.name}
                                        subtitle={`₱ ${product.price}`}
                                        position="below"
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label="add"
                                                onClick={() => addProductToCart(product)}
                                            >
                                                <AddBoxSharpIcon />
                                            </IconButton>
                                        }
                                    />
                                    <ImageListItemBar
                                        className='stocks'
                                        subtitle={`Stock ${product.stocks}`}
                                        position="below"
                                    />
                                </ImageListItem>
                            ))
                    )}
                </ImageList>
            </div>
        </MainLayout>

    );
};

export default PosPage;
