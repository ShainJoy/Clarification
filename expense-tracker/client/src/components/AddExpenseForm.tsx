import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { postItem } from '../services/items';
import IItem from '../models/IItem';

type Props = {
    confirmFunc: ( item : IItem ) => void,
    formClose: () => void
}

type State = {
    values:{
        payeeName: string,
        product: string,
        price: string,
        setDate: string
    },
    errors:{
        payeeName: string,
        product: string[],
        price: string[],
        setDate: string[]
    }
    isValid: boolean,
    toastMessage: string,
    show: boolean
}

class AddExpenseForm extends Component< Props, State >{
    // const { confirmFunc, formClose} : Props
    state: State = {
        values:{
            payeeName: '',
            product: '',
            price: '0',
            setDate: ''
        },
        errors:{
            payeeName: '',
            product: [],
            price: [],
            setDate: []
        },
        isValid: false,
        toastMessage: '',
        show: false   
    };

    validate( nameOfInput?: keyof State['values']) {
        const errors : State['errors'] = {
            payeeName: '',
            product: [],
            price: [],
            setDate: []
        };
        let isValid = true;

        const {
            payeeName,
            product,
            price,
            setDate
        } = this.state.values;

        if( payeeName !== 'Rahul' && payeeName !== 'Ramesh'   ){
            errors.payeeName = 'Please choose a correct payee!' ;
            isValid = false;
        }

        if( product.trim().length < 2  ){
            errors.product.push( 'Expense description should at least have 2 characters!' );
            isValid = false;
        }

        const pricePat = /^\d+(\.\d{1,2})?$/;
        if( !pricePat.test(price) ){
            errors.price.push( 'Please enter a valid amount' );
            isValid = false;
        }

        if( parseFloat(price) === 0  ){
            errors.price.push( 'Please enter an amount' );
            isValid = false;
        }

        if ( nameOfInput ){
            this.setState(
                state => {
                    return {
                        errors: {
                            ...state.errors,
                            [ nameOfInput ]: errors[ nameOfInput ]
                        },
                        isValid
                    };    
                }
            )
            return errors[ nameOfInput ].length === 0;
        }else{
            this.setState(
                {
                errors,
                isValid
                }
            )
            return isValid;
        }

    };

    updateValue = ( event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        const { name, value } = event.target;

        this.setState(
            state => {
                return {
                    vaues: {
                        ...state.values,
                        [name]: value
                    }
                };
            },
            () => {
                this.validate( name as keyof State['values'] )
            }
        )
    };

    render() {
        const {
            payeeName,
            product,
            price,
            setDate
        } = this.state.values;

        const {
            payeeName: payeeNameErr,
            product: productErr,
            price: priceErr,
            setDate: setDateErr
        } = this.state.errors;

        const isValid = this.state.isValid;

        return (
            <Modal show={true} onHide={formClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add an Expense</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addExpense}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Paid by:</Form.Label>
                            <Form.Select aria-label="Default select example" 
                            value={payeeName} 
                            onChange={this.updateValue}
                            isInvalid={payeeNameErr.length !== 0}>
                                <option>Select a payee name</option>
                                <option value="Rahul">Rahul</option>
                                <option value="Ramesh">Ramesh</option>
                            </Form.Select>
                            {/* Message at 7:40 */}
                    </Form.Group>
    
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Paid for:</Form.Label>
                        <Form.Control type="text" placeholder="Expense description" ref={descriptionRef} />
                    </Form.Group>
    
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Amount paid:</Form.Label>
                        <Form.Control type="number" placeholder="How much do you spent?" ref={amountRef}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Date:</Form.Label>
                        <Form.Control type="date" placeholder="Date" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={formClose} className='me-2'>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    
        )
    }
}

export default AddExpenseForm;