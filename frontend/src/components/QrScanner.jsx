/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-toastify';
import axiosClient from "../axios-client";

const QrScanner = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [cart, setCart] = useState([]);

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

    const getProductFromQR = (qrData) => {
        try {
            // Assuming the QR data contains only the product ID as a single digit
            const productId = parseInt(qrData);
            
            // Find the product in your data based on the ID
            const product = products.find(product => product.id === productId);
            
            if (!product) {
                console.error("Product not found for ID:", productId);
                return null;
            }
    
            return product;
        } catch (error) {
            console.error("Error parsing QR data:", error);
            return null;
        }
    };

    const handleAddProductToCart = useCallback(async () => {
        if (!scanResult) {
            // If there's no scanned result, return or show an error
            console.log("No QR code scanned");
            return;
        }
    
        const product = getProductFromQR(scanResult); // Implement getProductFromQR function to extract product data from QR code
    
        if (!product) {
            // If the scanned QR code doesn't contain valid product data, return or show an error
            console.log("Invalid QR code scanned");
            return;
        }
    
        const timestamp = Date.now();
        const productWithTimestamp = {
            ...product,
            timestamp: timestamp
        };
    
        let findProductInCart = await cart.find(item => item.id === product.id);
    
        if (findProductInCart) {
            setCart(prevCart => {
                const newCart = prevCart.map(cartItem => {
                    if (cartItem.id === product.id) {
                        return {
                            ...cartItem,
                            quantity: cartItem.quantity + 1,
                            totalAmount: parseFloat((cartItem.price * (cartItem.quantity + 1)).toFixed(2))
                        };
                    } else {
                        return cartItem;
                    }
                });
                toast.info(`${product.name} quantity added`, {
                    autoClose: 500,
                    theme: "dark",
                });
                return newCart;
            });
        } else {
            const addingProduct = {
                ...productWithTimestamp,
                quantity: 1,
                totalAmount: product.price,
            };
    
            setCart(prevCart => [...prevCart, addingProduct]);
            toast.success(`${product.name} added to cart`, {
                autoClose: 500,
                theme: "dark",
            });
        }
    }, [cart, scanResult]);
    
    useEffect(() => {
        if (isScanning) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 200,
                    height: 200,
                },
                fps: 5,
            });
    
            const success = async (result) => {
                scanner.clear();
                setScanResult(result);
                // console.log(result);
    
                // Stop scanning temporarily
                setIsScanning(false);
    
                // Add the product to the cart if it matches the scanned ID
                await handleAddProductToCart();
    
                // Resume scanning after 2 seconds
                setTimeout(() => {
                    setIsScanning(true);
                }, 2000);
            };
    
            const error = (err) => {
                console.log(err);
            };
    
            scanner.render(success, error);
    
            return () => {
                scanner.clear();
            };
        }
    }, [isScanning, handleAddProductToCart]);

    return (
        <>
        {scanResult ? (
            <div id='reader'>Success: <a href={'http://' + scanResult}>{scanResult}</a></div>
        ) : (
            <div id="reader"></div>
        )}
        </>
    );
};

export default QrScanner;
