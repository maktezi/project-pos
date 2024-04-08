import React, { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
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
                        totalAmount: parseFloat((cartItem.price * (cartItem.quantity + 1)).toFixed(2))
                    }
                    newCart.push(newItem);
                } else {
                    newCart.push(cartItem);
                }
            });

            setCart(newCart);
            toast.success(`${newItem.name} added to Cart`, {
                autoClose: 1000,
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
                autoClose: 1000,
                theme: "dark",
            });
        }
    }

    const addOneProductToCart = async(product) => {
        let findProductInCart = cart.find(item => item.id === product.id);
    
        if (findProductInCart) {
            const newCart = cart.map(cartItem => {
                if (cartItem.id === product.id) {
                    return {
                        ...cartItem,
                        quantity: cartItem.quantity + 1,
                        totalAmount: parseFloat(((cartItem.quantity + 1) * cartItem.price).toFixed(2))
                    };
                }
                return cartItem;
            });
    
            setCart(newCart);
            toast.success(`${product.name} added to Cart`, {
                autoClose: 1000,
                theme: "dark",
            });
        } else {
            const addingProduct = {
                ...product,
                quantity: 1,
                totalAmount: parseFloat(product.price).toFixed(2)
            };
            setCart([...cart, addingProduct]);
            toast.success(`${product.name} added to Cart`, {
                autoClose: 1000,
                theme: "dark",
            });
        }
    }
    
    const removeOneProductFromCart = (product) => {
        const newCart = cart.map(cartItem => {
            if (cartItem.id === product.id && cartItem.quantity > 1) {
                return {
                    ...cartItem,
                    quantity: cartItem.quantity - 1,
                    totalAmount: parseFloat(((cartItem.quantity - 1) * cartItem.price).toFixed(2))
                };
            }
            return cartItem;
        }).filter(cartItem => cartItem.quantity > 0);
    
        setCart(newCart);
        toast.error(`${product.name} removed to Cart`, {
            autoClose: 1000,
            theme: "dark",
        });
    }

    const removeProduct = async(product) => {
        const newCart = cart.filter(cartItem => cartItem.id !== product.id);
        setCart(newCart);
        toast.error(`${product.name} removed from Cart`, {
            autoClose: 1000,
            theme: "dark",
        });
    }

    useEffect(() => {
        fetchProducts();
    },[]);

    const clearCart = () => {
        setCart([]);
        toast.error(`All items removed from cart.`, {
            autoClose: 1000,
            theme: "dark",
        });
    };

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
                                                    <AddIcon style={{ zIndex: 5 }} color='primary'/>
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
                    <div className='cart-box'>
                        <div className='cartReceipt'>
                            <h1 className='title'>Cart</h1>
                            <Button variant='contained' href='#' startIcon={<LocalPrintshopIcon/>}>Receipt</Button>
                        </div>
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
                            <Table sx={{ minWidth: 650, height: 480 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><h4>Action</h4></TableCell>
                                        {/* <TableCell><h4>#</h4></TableCell> */}
                                        <TableCell><h4>Name</h4></TableCell>
                                        <TableCell><h4>Price</h4></TableCell>
                                        <TableCell><h4>Qty</h4></TableCell>
                                        <TableCell><h4>Total</h4></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.length > 0 ? cart
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((cartProduct, key) => (
                                            <TableRow key={key={key}}>
                                                <TableCell >
                                                    <IconButton style={{ padding: "1px 1px" }} onClick={() => addOneProductToCart(cartProduct)}>
                                                        <AddCircleIcon color='success' />
                                                    </IconButton>
                                                    <IconButton style={{ padding: "1px 1px" }} onClick={() => removeOneProductFromCart(cartProduct)}>
                                                        <RemoveCircleIcon color='warning' />
                                                    </IconButton>
                                                    <IconButton style={{ padding: "1px 1px" }} onClick={() => removeProduct(cartProduct)}>
                                                        <DeleteForeverIcon color='error' />
                                                    </IconButton>
                                                </TableCell>
                                                {/* <TableCell component="th" scope="row">{cartProduct.id}</TableCell> */}
                                                <TableCell >{cartProduct.name}</TableCell>
                                                <TableCell >₱ {cartProduct.price}</TableCell>
                                                <TableCell >{cartProduct.quantity}</TableCell>
                                                <TableCell >₱ <b>{cartProduct.totalAmount}</b></TableCell>
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

                    <div className='total-box'>
                        <Card className='total-box1'>
                        <Button startIcon={<DeleteForeverIcon />} variant='contained' color='error' onClick={clearCart}>Clear Cart</Button>
                        <h3 className='title total'>Total Amount: ₱ {totalAmount.toLocaleString()}</h3>
                        </Card>
                    </div>

                    <div className='misc-box'>
                        <div className='qr-scanner'>
                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'/>
                        </div>
                        <div className='cash-title'>
                            <div>
                                <h2>CASH:</h2>
                            </div>
                            <div>
                                <h2>CHANGE:</h2>
                            </div>
                        </div>
                        <div className='cash-number'>
                            <div>
                                <h2>XXXX.XX</h2>
                            </div>
                            <div>
                                <h2>XXX.XX</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>

    );
};

export default PosPage;
