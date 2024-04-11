import * as React from 'react';
import { useEffect, useState } from "react"
import MainLayout from '../layout/MainLayout';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import axiosClient from "../axios-client";
import TablePagination from '@mui/material/TablePagination';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = useState('')
    // const [info, setInfo] = useState({});

    const getProducts = () => {
        axiosClient
        .get('/products?page=${page}')
        .then(({data}) => {
            setProducts(data.data)
            // setInfo(data.meta)
            // console.log(data);
        })
        .catch((error) => {
            console.log(error)
        });
    };
    
    const handleChangePage = (event, newPage) => {
        // console.log("Page change event:", event);
        // console.log("New page:", newPage);
        setPage(newPage);
        getProducts(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };

    const onDelete = (product) => {
        if (!window.confirm("Delete this product?")) {
            return
        }
        axiosClient.delete(`/products/${product.id}`)
            .then(() => {
                toast.success('Successfuly deleted', {
                    autoClose: 1000,
                    theme: "dark",
                });
            getProducts()
        })
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <MainLayout>
            <Card style={{ 
                margin: 'auto',
                width: '1300px',
                marginTop: '50px'
            }}>
                <div>
                    <div className='add-search' style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '30px', paddingRight: '30px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Link to='/add'>
                                <Button variant="contained" color='success'>
                                    <AddIcon/>
                                </Button>
                            </Link>
                            <h2 style={{ marginLeft: '20px' }}>Product Management</h2>
                        </div>
                        <div className='search-container'>
                            <input
                                style={{ padding: '8px 15px', width: '300px', outline: 'none', border: '1px solid gray', borderRadius: '5px' }}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search product name . . .'
                            />
                        </div>
                    </div>

                    <TableContainer component={Paper}>
                    <Table size='small' sx={{ minWidth: 650 }} aria-label="simple table">

                        <TableHead>
                        <div className='divider'></div>
                        <TableRow>
                            <TableCell><h4>#</h4></TableCell>
                            <TableCell><h4>Product Name</h4></TableCell>
                            <TableCell><h4>Price</h4></TableCell>
                            <TableCell style={{ textAlign: 'center' }}><h4>Stocks</h4></TableCell>
                            <TableCell style={{ textAlign: 'center' }}><h4>Action</h4></TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {products
                        .filter((product) => {
                            const searchTerm = search.toLowerCase();
                            if (searchTerm === '') {
                                return product;
                            } else {
                                const productName = `${product.name}`.toLowerCase();
                                return productName.includes(searchTerm);
                            }
                        })
                        .slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage)
                        .map(product => (
                            <TableRow
                            key={product.id}
                            >
                            <TableCell component="th" scope="row">{product.id}</TableCell>
                            <TableCell component="th" scope="row">
                                {product.name}
                            </TableCell>
                            <TableCell>₱ {parseFloat(product.price).toLocaleString()}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{product.stocks}</TableCell>
                            <TableCell style={{ justifyContent: 'center', display: 'flex' }}>
                                <Link to={'/edit/'+product.id}><IconButton><EditIcon color='primary'/></IconButton></Link>
                                <IconButton onClick={() => onDelete(product)} color='error'><DeleteIcon/></IconButton>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>

                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 50, 100]}
                        showFirstButton
                        showLastButton
                        component="div"
                        count={products.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    </TableContainer>
                </div>
            </Card>
        </MainLayout>
    )
}
