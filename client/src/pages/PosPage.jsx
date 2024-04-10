import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ComponentToPrint } from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
// import QrScanner from 'react-qr-scanner';
import './style.css'

const PosPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [tenderedCash, setTenderedCash] = useState('');

// Fetch Localhost DBJSON
// useEffect(() => {
//     const fetchProducts = async () => {
//         try {
//             setIsLoading(true);
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
//             setProducts(response.data);
//             setIsLoading(false);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             setIsLoading(false);
//         }
//     };

//     fetchProducts();

//     const intervalId = setInterval(fetchProducts, 3600000);

//     return () => clearInterval(intervalId);
// }, []);


// Fetch Data Online DBJSON
    useEffect(() => {
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

        fetchProducts();

        const intervalId = setInterval(fetchProducts, 3600000);

        return () => clearInterval(intervalId);

    }, []);


    const addProductToCart = async (product) => {
        const timestamp = Date.now();
        const productWithTimestamp = {
            ...product,
            timestamp: timestamp
        };
    
        let findProductInCart = await cart.find(i => {
            return i.id === product.id
        });
    
        if (findProductInCart) {
            let newCart = [];
            let newItem;
    
            cart.forEach(cartItem => {
                if (cartItem.id === product.id) {
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
            toast.info(`${newItem.name} quantity added`, {
                autoClose: 1000,
                theme: "dark",
            });
    
        } else {
            let addingProduct = {
                ...productWithTimestamp,
                'quantity': 1,
                'totalAmount': product.price,
            }
            setCart([...cart, addingProduct]);
            toast.success(`${product.name} added to cart`, {
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
            toast.info(`${product.name} quantity added`, {
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
            toast.success(`${product.name} added to cart`, {
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
        toast.warning(`${product.name} quantity lessened`, {
            autoClose: 1000,
            theme: "dark",
        });
    }

    const removeProductFromCart = async(product) => {
        const newCart = cart.filter(cartItem => cartItem.id !== product.id);
        setCart(newCart);
        toast.error(`${product.name} removed from cart`, {
            autoClose: 1000,
            theme: "dark",
        });
    }

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

    const componentRef = useRef(null);

    const handleReactToPrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handlePrint = () => {
        handleReactToPrint();
    };

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

    const handleChangeAmount = () => {
        return tenderedCash ? parseFloat(tenderedCash) : 0;
    };

    const handleTenderedCash = (event) => {
        setTenderedCash(event.target.value);
    };
    
    // const handleError = err => {
    //     console.error(err);
    // };

    return (
        <MainLayout>
            <div className='card'>
                <div className='products-card'>
                    <div className='product-box'>
                    <ImageList className='row' sx={{ width: 1200, height: 840 }} cols={6}>
                        {isLoading ? 'Loading...' : (
                            products
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((product) => (
                                    <ImageListItem className='block' key={product.id}>
                                        <img
                                            src={`${product.image}?w=248&fit=crop&auto=format`}
                                            alt={product.name}
                                            loading="lazy"
                                            style={{ width: '175px', height: '175px', objectFit: 'cover'}}
                                        />
                                        <ImageListItemBar
                                            title={product.name}
                                            subtitle={`₱ ${(product.price).toLocaleString()}`}
                                            position="below"
                                            actionIcon={
                                                <IconButton
                                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                    aria-label="add"
                                                    onClick={() => addProductToCart(product)}
                                                >
                                                    <ShoppingCartIcon style={{ zIndex: 5 }} color='primary'/>
                                                </IconButton>
                                            }
                                        />
                                        <ImageListItemBar
                                            className='stocks'
                                            subtitle={`Stock: ${product.stocks}`}
                                            position="below"
                                        />
                                    </ImageListItem>
                                ))
                        )}
                    </ImageList>
                    </div>
                </div>

                <div className='cart-card'>
                    <div className='cart-box'>
                        <div className='cartReceipt'>
                            <h1 className='title'>Cart</h1>
                            <div style={{ display: 'none' }}>
                                <ComponentToPrint cart={cart} totalAmount={totalAmount} tenderedCash={tenderedCash} handleChangeAmount={handleChangeAmount} ref={componentRef} />
                            </div>
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
                                        <TableCell><h4>Item</h4></TableCell>
                                        <TableCell><h4>Price</h4></TableCell>
                                        <TableCell><h4>Qty/Kg</h4></TableCell>
                                        <TableCell><h4>Total</h4></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.length > 0 ? cart
                                        .sort((a, b) => b.timestamp - a.timestamp)
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((cartProduct, key) => (
                                            <TableRow key={key={key}}>
                                                <TableCell>
                                                    <IconButton style={{ padding: "1px 1px" }} onClick={() => removeProductFromCart(cartProduct)}>
                                                        <DeleteIcon color='error' />
                                                    </IconButton>
                                                    <b>{cartProduct.name}</b></TableCell>
                                                <TableCell style={{ textAlign: 'left' }}>₱ {cartProduct.price}</TableCell>
                                                <TableCell style={{ textAlign: 'left' }}>
                                                    <IconButton style={{ padding: "1px 1px" }} onClick={() => addOneProductToCart(cartProduct)}>
                                                        <AddIcon color='primary' />
                                                    </IconButton>
                                                    <b>{cartProduct.quantity}</b>
                                                    {cartProduct.quantity > 1 && (
                                                        <IconButton style={{ padding: "1px 1px" }} onClick={() => removeOneProductFromCart(cartProduct)}>
                                                            <RemoveIcon color='error' />
                                                        </IconButton>
                                                    )}
                                                </TableCell>

                                                <TableCell style={{ textAlign: 'left' }}>₱ <b>{(cartProduct.totalAmount).toLocaleString()}</b></TableCell>
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
                            {cart.length > 0 && (
                                <>
                                    <Button
                                        startIcon={<DeleteForeverIcon />}
                                        variant='contained'
                                        color='error'
                                        onClick={clearCart}
                                    >
                                        Cart
                                    </Button>
                                    <h3 className='total'>Total Amount:</h3>
                                    <h3 className='title'>₱ {totalAmount.toLocaleString()}</h3>
                                </>
                            )}
                        </Card>
                    </div>

                    <div className='misc-box'>
                        <div className='qr-scanner'>
                        {/* <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={addProductToCart}
                            style={{ width: '100%' }}
                        /> */}
                        <img src='https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' />
                        </div>

                        {cart.length > 0 && (
                            <>
                                <div className='cash-number'>
                                    <div className='cash-tendered'>
                                        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                                            <InputLabel htmlFor="cash-tendered">Cash Tendered</InputLabel>
                                            <FilledInput
                                                style={{ fontWeight: 800, fontSize: '18px', width: '200px' }}
                                                id="cash-tendered"
                                                autoComplete='off'
                                                value={tenderedCash}
                                                onChange={handleTenderedCash}
                                                startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                                            />
                                        </FormControl>
                                    </div>
                                    <div>
                                    <h3 className='title-change'>Change:
                                    {tenderedCash > totalAmount && (
                                        <> ₱ {(handleChangeAmount() - totalAmount).toLocaleString()}</>
                                    )}
                                    </h3>
                                    </div>
                                </div>
                                <div className='pay-now'>
                                    <Button onClick={handlePrint} variant='contained' id='pay-button'>Pay Now</Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>

    );
};

export default PosPage;
