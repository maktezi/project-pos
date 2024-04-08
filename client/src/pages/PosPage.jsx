import React, { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { toast } from 'react-toastify';
import './style.css'

const PosPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

// Fetch Localhost DBJSON
    // const fetchProducts = async () => {
    //     try {
    //         setIsLoading(true);
    //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
    //         setProducts(response.data);
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //     }
    // };

// Fetch Data Online DBJSON
const fetchProducts = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(import.meta.env.VITE_API_URL, {
            headers: {
                'X-Master-Key': '$2a$10$OUObxgOj8M5HxMIyqVebluB07/l5KZsb5Jw23FGeLOGu8/.PY9qte'
            }
        });
        setProducts(response.data.record.products);
        setIsLoading(false);
    } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
    }
};


    const addProductToCart = async(product) => {
        console.log(product);
        let findProductInCart = await cart.find(i=>{
            return i.id === product.id
        });

        if (findProductInCart) {
            let newCart = [];
            let newItem;

            cart.forEach(cartItem => {
                if(cartItem.id === product.id){
                    newItem = {
                        ...cartItem,
                        quantity: cartItem.quantity + 1,
                        totalAmount: cartItem.price * (cartItem.quantity + 1)
                    }
                    newCart.push(newItem);
                } else {
                    newCart.push(cartItem);
                }
            });

            setCart(newCart);
            toast.success(`${newItem.name} added to Cart`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });

        } else {
            let addingProduct = {
                ...product,
                'quantity': 1,
                'totalAmount': product.price,
            }
            setCart([...cart, addingProduct]);
            toast.success(`${product.name} added to Cart`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const removeProduct = async(product) => {
        const newCart = cart.filter(cartItem => cartItem.id !== product.id);
        setCart(newCart);
        toast.error(`${product.name} removed from Cart`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
        });
    }

    useEffect(() => {
        fetchProducts();
    },[]);

    useEffect(() => {
        let newTotalAmount = 0;
        cart.forEach(icart => {
            newTotalAmount = newTotalAmount + parseFloat(icart.totalAmount);
        })
        newTotalAmount = parseFloat(newTotalAmount.toFixed(2));
        setTotalAmount(newTotalAmount);
    },[cart])

    // useEffect(() => {
    //     console.log(products);
    // }, [products]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <MainLayout>
            <div className='card'>
                <div className='products-card'>
                    <h1 className='title'>Add Products</h1>
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

                <div className='cart-card'>
                    <div>
                        <h1 className='title'>Cart</h1>
                        <TableContainer id='border-none' component={Paper}>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={cart.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <Table sx={{ minWidth: 620, height: 550 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><h5>#</h5></TableCell>
                                        <TableCell><h5>Name</h5></TableCell>
                                        <TableCell><h5>Price</h5></TableCell>
                                        <TableCell><h5>Qty</h5></TableCell>
                                        <TableCell><h5>Total</h5></TableCell>
                                        <TableCell><h5>Action</h5></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.length > 0 ? cart
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((cartProduct, key) => (
                                            <TableRow key={key={key}}>
                                                <TableCell component="th" scope="row">{cartProduct.id}</TableCell>
                                                <TableCell>{cartProduct.name}</TableCell>
                                                <TableCell>₱ {cartProduct.price}</TableCell>
                                                <TableCell>{cartProduct.quantity}</TableCell>
                                                <TableCell>₱ <b>{cartProduct.totalAmount}</b></TableCell>
                                                <TableCell>
                                                    <Button onClick={() => removeProduct(cartProduct)}><RemoveCircleOutlineIcon color='error' /></Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : 
                                        <TableRow>
                                            <TableCell colSpan={6} align="center"><h1>No Item/s in Cart</h1></TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                    <div>
                    <h2 className='title total'>Total Amount: ₱ {totalAmount}</h2>
                    </div>
                </div>
            </div>
        </MainLayout>

    );
};

export default PosPage;
