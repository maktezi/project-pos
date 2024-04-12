import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axiosClient from "../axios-client";
import { toast } from 'react-toastify';
import MainLayout from '../layout/MainLayout';
import Card from '@mui/material/Card';

export default function Form({csrfToken}) {

    const {id} = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState( {
        id: null,
        name: '',
        price: '',
        image: '',
        stocks: '',
    })

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                setLoading(true);
                const response = await axiosClient.get(`/products/${id}`);
                setProduct(response.data);
                } catch (error) {
                console.error('Error fetching product data:', error);
                } finally {
                setLoading(false);
                }
            };
    
          fetchData(); // Call the function directly within useEffect
        }
    }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (product.id) {
            axiosClient.put(`/products/${product.id}`, product, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
            .then( () => {
                toast.success('Successfuly updated', {
                    autoClose: 1000,
                    theme: "dark",
                });
                setTimeout(() => {
                    navigate('/products');
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            })
        } else {
            axiosClient.post(`/products`, product, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
            .then( () => {
                toast.success('Successfuly added', {
                    autoClose: 1000,
                    theme: "dark",
                });
                setProduct({
                    name: '',
                    price: '',
                    image: '',
                    stocks: '',
                });
                navigate('/add')
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <MainLayout>
            <Card style={{ 
                display: 'flex',
                margin: 'auto',
                marginTop: '100px',
                width: '500px',
                height: '500px'
            }}>
            <Container className='form-container' component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                sx={{
                    // marginTop: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                <Typography className='form-title' component="h1" variant="h5">
                    {product.id && <p style={{ textAlign: 'center' }}>Update<br /><b>{product.name}</b></p>}
                    {!product.id && <h3>Add Product</h3>}
                </Typography>
                <div>
                    {loading && (
                        <div className='text-center'>Loading...</div>
                    )}
                </div>
                {!loading && 
                <Box onSubmit={onSubmit} component="form">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                            required
                            autoComplete='false'
                            fullWidth
                            id="name"
                            name="name"
                            label="Product name"
                            value={product.name}
                            onChange={ev => setProduct({...product, name: ev.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            required
                            autoComplete='false'
                            fullWidth
                            id="price"
                            name="price"
                            label={`Price (\u20B1)`}
                            type='text' // Use text type for custom validation
                            value={product.price}
                            onChange={ev => {
                                const inputValue = ev.target.value;
                                // Regex to allow only numbers with up to 2 decimal places
                                const regex = /^\d*\.?\d{0,2}$/;
                                if (regex.test(inputValue) || inputValue === '') {
                                    setProduct({...product, price: inputValue});
                                }
                            }}
                            inputProps={{ min: 1, }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            name="stocks"
                            autoComplete='false'
                            fullWidth
                            required
                            id="stocks"
                            label="Stocks"
                            type='number'
                            value={product.stocks}
                            onChange={ev => setProduct({...product, stocks: ev.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                            autoComplete='false'
                            fullWidth
                            required
                            id="image"
                            name="image"
                            label="Image URL put N/A if none"
                            type='string'
                            value={product.image}
                            onChange={ev => setProduct({...product, image: ev.target.value})}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                    {product.id && <p>UPDATE</p>}
                    {!product.id && <p>SAVE</p>}
                    </Button>

                    <Link to="/products"><Button fullWidth variant="contained" color='error'>BACK</Button></Link>
                </Box>
                }
                </Box>
            </Container>
            </Card>
        </MainLayout>
    );
}