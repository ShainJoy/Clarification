import { useState, useEffect, useRef, FormEvent } from 'react';
import { getItems } from '../services/items';
import { Spinner, Alert, Container, Table, Button, Modal, Form } from 'react-bootstrap';
import IItem from '../models/IItem';
import AddExpenseForm from './AddExpenseForm'

const ExpenseTracker = () => {
    const [ items, setItems ] = useState<IItem[]>( [] as IItem[] );
    const [ error, setError ] = useState<Error | null>( null );
    const [ loading, setLoading ] = useState<boolean>( true );
    const  [show, setShow ] = useState<boolean>( false );

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let rahulExp = 0;
    let rameshExp = 0;
    let toBePaid ='';
    let amtToPay = 0;
    
    useEffect(() => {
        const fetchItems = async () => {
            try{
                const items = await getItems(); 
                setItems( items );
            }catch{
                setError( error as Error );
            }finally{
                setLoading( false );
            };
        }
        fetchItems();
    }, [])

    const totalByPayee = (payee : string) => {
        let total = 0;
        items.forEach(
            item => {
                if(item.payeeName === payee){
                    total += parseFloat(item.price);
                };
            });
        return total;
    };

    const calculateTotal = () => {
        rahulExp = totalByPayee( 'Rahul' );
        rameshExp = totalByPayee( 'Ramesh' );
        rahulExp > rameshExp ? toBePaid = 'Ramesh' : toBePaid = 'Rahul';
        rahulExp > rameshExp ? 
            (amtToPay = (rahulExp - rameshExp)/2) : 
            (amtToPay = (rameshExp - rahulExp)/2);
        return rahulExp;
    };

    const onPostConfirm = ( postedItem : IItem ) => (
        setItems([
            ...items,
            postedItem
        ])
    )

    return (
        <Container className='my-4'>
            {
            show && (<AddExpenseForm confirmFunc={onPostConfirm} formClose={handleClose} />)
            }

            <h2>Expense Tracker
                <Button variant="primary" className='float-end' onClick={handleShow}>
                    Add Expense
                </Button>
            </h2>

            <hr />
        {
            loading && (
                <div className='d-flex justify-content-centre'>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <div>Loading data...</div>
                </div>
            )
        }
        {
            !loading && error && (
                    <Alert variant="danger">
                        {error.message}
                    </Alert>
            )
        }
        {
            !loading && !error && (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Sl.</th>
                            <th>Date</th>
                            <th>Payee</th>
                            <th>Description</th>
                            <th className='text-end'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items.map(
                                (item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx+1}</td>
                                        <td>{item.setDate}</td>
                                        <td>{item.payeeName}</td>
                                        <td>{item.product}</td>
                                        <td className='font-monospace text-end'>{parseFloat(item.price).toFixed(2)}</td>
                                    </tr>
                                )
                            )
                        }

                        <tr>
                            <td className='text-end' colSpan={4}>
                                Total amount spent by Rahul
                            </td>
                            <td className='font-monospace text-end'>
                                {calculateTotal().toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td className='text-end' colSpan={4}>
                                Total amount spent by Ramesh
                            </td>
                            <td className='font-monospace text-end'>
                                {rameshExp.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td className='text-end' colSpan={4}>
                                {toBePaid} has to pay
                            </td>
                            <td className='font-monospace text-end'>
                                {amtToPay.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                    </Table>
            )
        }
        </Container>
    );
};

export default ExpenseTracker;
