/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
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
import axiosClient from "../axios-client";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './style.css'



const PosPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [tenderedCash, setTenderedCash] = useState('');
    const [search, setSearch] = useState('')
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                axiosClient
                .get('/products?page=${page}')
                .then(({data}) => {
                    setProducts(data.data)
                    // setInfo(data.meta)
                    // console.log(data);
                })
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

    const addProductToCart = useCallback(async (product) => {
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
                        quantity: (cartItem.quantity + 1),
                        totalAmount: parseFloat((cartItem.price * (cartItem.quantity + 1)).toFixed(2))
                    }
                    newCart.push(newItem);
                } else {
                    newCart.push(cartItem);
                }
            });
    
            setCart(newCart);
            toast.info(`${newItem.name} quantity added`, {
                autoClose: 500,
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
                autoClose: 500,
                theme: "dark",
            });
        }
    })
    
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
            autoClose: 500,
            theme: "dark",
        });
    }

    const removeProductFromCart = async(product) => {
        const newCart = cart.filter(cartItem => cartItem.id !== product.id);
        setCart(newCart);
        toast.error(`${product.name} removed from cart`, {
            autoClose: 500,
            theme: "dark",
        });
    }

    const clearCart = () => {
        setCart([]);
        toast.error(`All items removed from cart.`, {
            autoClose: 500,
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

    const isCashTenderedEmpty = tenderedCash.trim() === '' || parseFloat(tenderedCash) < totalAmount;
    
    const handleAddProductToCart = useCallback(async (result) => {
        if (!result) {
            console.log("No QR code scanned");
            return;
        }
    
        // Example: Parsing the product ID from the QR code result
        const productId = parseInt(result);
        
        // Find the product in the cart
        const existingProductIndex = cart.findIndex(item => item.id === productId);
    
        if (existingProductIndex !== -1) {
            // If the product is already in the cart, increase its quantity by 1
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += 1;
            updatedCart[existingProductIndex].totalAmount = parseFloat((updatedCart[existingProductIndex].price * (updatedCart[existingProductIndex].quantity)).toFixed(2));
            setCart(updatedCart);
            toast.info(`Quantity of product updated`, {
                autoClose: 500,
                theme: "dark",
            });
        } else {
            // If the product is not in the cart, add it with quantity 1
            const productToAdd = products.find(product => product.id === productId);
            
            if (!productToAdd) {
                console.log("Product not found for ID:", productId);
                return;
            }
    
            // Add the product to the cart with quantity 1
            const timestamp = Date.now();
            const productWithTimestamp = {
                ...productToAdd,
                timestamp,
                quantity: 1,
                totalAmount: parseFloat((productToAdd.price * 1).toFixed(2)) // Total amount for new product
            };
            
            setCart(prevCart => [...prevCart, productWithTimestamp]);
            toast.success(`${productToAdd.name} added to cart`, {
                autoClose: 500,
                theme: "dark",
            });
        }
    
        console.log("Product added to cart:", productId);
    }, [products, cart, setCart]);    
    
    useEffect(() => {
        if (isScanning) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 150,
                    height: 100,
                },
                fps: 5,
            });
    
            const success = async (result) => {
                // console.log("QR code scanned:", result);
                scanner.clear();
                setScanResult(result);
                setIsScanning(false);
            };
    
            const error = () => {
                // console.log(err);
            };
    
            scanner.render(success, error);
    
            return () => {
                scanner.clear();
            };
        }
    }, [isScanning]);

    useEffect(() => {
        if (!isScanning && scanResult) {
            handleAddProductToCart(scanResult);
            setScanResult(null); // Reset scan result after processing
            setTimeout(() => {
                setIsScanning(true); // Resume scanning
            }, 500);
        }
    }, [scanResult, isScanning, handleAddProductToCart]);
    

    return (
        <MainLayout>
            <div className='card'>

                <div className='products-card'>
                    <div className='search-container'>
                        <input
                            style={{ padding: '8px 15px', width: '300px', outline: 'none', border: '1px solid gray', borderRadius: '5px', marginBottom: '5px' }}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search product name . . .'
                        />
                    </div>
                    <div className='product-box'>
                    <ImageList className='row' sx={{ width: 1180, height: 810 }} cols={6}>
                        {isLoading ? 'Loading...' : (
                            products
                                .filter((product) => {
                                    const searchTerm = search.toLowerCase();
                                    if (searchTerm === '') {
                                        return product;
                                    } else {
                                        const productName = `${product.name}`.toLowerCase();
                                        return productName.includes(searchTerm);
                                    }
                                })
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((product) => (
                                    <ImageListItem className='block' key={product.id}>
                                        <div style={{ width: '182px', border: '3px solid maroon' }}>
                                        <img
                                            src={`${product.image}?w=248&fit=crop&auto=format`}
                                            alt={product.name}
                                            loading="lazy"
                                            style={{ width: '176px', height: '130px', objectFit: 'contain'}}
                                        />
                                        <ImageListItemBar
                                            title={product.name}
                                            subtitle={`₱ ${parseFloat((product.price)).toLocaleString()}`}
                                            position="below"
                                            style={{ marginTop: '-10px', marginLeft: '5px' }}
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
                                        </div>
                                    </ImageListItem>
                                ))
                        )}
                    </ImageList>
                    </div>
                </div>

                <div className='cart-card'>

                    <div className='cart-box'>
                        <div className='cartReceipt'>
                            {/* <h1 className='title'>Cart</h1> */}
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
                            <Table sx={{ minWidth: 650, height: 545 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Item</b></TableCell>
                                        <TableCell style={{ textAlign: 'left' }}><b>Price</b></TableCell>
                                        <TableCell style={{ textAlign: 'center' }}><b>Qty/Kg</b></TableCell>
                                        <TableCell style={{ textAlign: 'left' }}><b>Total</b></TableCell>
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
                                                <TableCell style={{ textAlign: 'left', width: '120px' }}>₱ {parseFloat((cartProduct.price)).toLocaleString()}</TableCell>
                                                <TableCell style={{ textAlign: 'right', width: '120px' }}>
                                                    {cartProduct.quantity > 1 && (
                                                        <IconButton size='small' onClick={() => removeOneProductFromCart(cartProduct)}>
                                                            <RemoveCircleRoundedIcon color='error' />
                                                        </IconButton>
                                                    )}
                                                    <b>{cartProduct.quantity}</b>
                                                    <IconButton size='small' onClick={() => addProductToCart(cartProduct)}>
                                                        <AddCircleRoundedIcon color='primary' />
                                                    </IconButton>
                                                </TableCell>

                                                <TableCell style={{ textAlign: 'left', width: '130px' }}>₱ <b>{parseFloat(cartProduct.totalAmount).toLocaleString()}</b></TableCell>
                                            </TableRow>
                                        )) : 
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <>
                                                <ProductionQuantityLimitsRoundedIcon fontSize='large'/>
                                                <h1>Cart empty . . .</h1>
                                                </>
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div>
                        <Card className='total-box-outer'>
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
                                </>
                            )}
                                <div className='total-box'>
                                    <h3 className='total'>Total Amount:</h3>
                                    <h3>₱ {totalAmount.toLocaleString()}</h3>
                                </div>
                        </Card>
                    </div>

                    <div className='misc-box'>
                        <div className='qr-scanner'>
                            <div id='reader'></div>
                        </div>

                        <div className='option-box'>
                        {cart.length > 0 && (
                            <>
                                <div className='cash-number'>
                                    <div className='cash-tendered'>
                                        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                                            <InputLabel htmlFor="cash-tendered">Cash Tendered</InputLabel>
                                            <FilledInput
                                                style={{ fontWeight: 800, fontSize: '18px', width: '220px' }}
                                                id="cash-tendered"
                                                color='black'
                                                autoComplete='off'
                                                value={tenderedCash}
                                                onChange={handleTenderedCash}
                                                startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                                            />
                                        </FormControl>
                                    </div>
                                    <div>
                                    <h3 className='title-change'>Change:
                                    {tenderedCash >= totalAmount && (
                                        <span className='cash-change'> ₱ {(handleChangeAmount() - totalAmount).toLocaleString()}</span>
                                    )}
                                    </h3>
                                    </div>
                                </div>
                                <div className='pay-now'>
                                    <Button onClick={handlePrint} disabled={isCashTenderedEmpty} variant='contained' id='pay-button'>Pay Now</Button>
                                </div>
                            </>
                        )}
                        </div>
                    </div>

                </div>

            </div>
        </MainLayout>

    );
};

export default PosPage;
