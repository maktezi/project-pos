/* eslint-disable react/display-name */
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import './receipt.css'

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const {cart, totalAmount, tenderedCash, handleChangeAmount} = props;

  return (
    <div ref={ref}>
      <TableContainer id='container'>
      <div>
        <h3 className='title'>POS System</h3>
      </div>
        <div className='table-container'>
        <Table sx={{ minWidth: 650, maxHeight: 800 }} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell><h5>Item</h5></TableCell>
                    <TableCell><h5>Price</h5></TableCell>
                    <TableCell style={{ textAlign: 'center' }}><h5>Qty/Kg</h5></TableCell>
                    <TableCell style={{ textAlign: 'center' }}><h5>Total</h5></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {cart.length > 0 ? cart
                    .map((cartProduct, key) => (
                        <TableRow key={key={key}}>
                            <TableCell>{cartProduct.name}</TableCell>
                            <TableCell>₱ {cartProduct.price}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{cartProduct.quantity}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>₱ {(cartProduct.totalAmount).toLocaleString()}</TableCell>
                        </TableRow>
                    )) : 
                    <TableRow>
                        <TableCell colSpan={6} align="center"><h1>No Item/s in Cart</h1></TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
        </div>
    </TableContainer>
    <div className='amount-container'>
      <p className='total-amount'>Total Amount: ₱ {(totalAmount).toLocaleString()} </p>
      <p className='total-amount'>Tendered Cash: ₱ {(tenderedCash).toLocaleString()} </p>
      <p className='total-amount'>Change: ₱ {(handleChangeAmount() - totalAmount).toLocaleString()} </p>
    </div>
    </div>
  );
});