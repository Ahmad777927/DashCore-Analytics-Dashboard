import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

const initialCustomers = [
  { id: 1, name: 'Sarah Connor', email: 'sarah@sky.net', status: 'Active', joined: '2023-05-12', spend: '$1,200' },
  { id: 2, name: 'Kyle Reese', email: 'kyle@resistance.io', status: 'Active', joined: '2023-08-20', spend: '$450' },
  { id: 3, name: 'T-800', email: 'cyberdyne@systems.com', status: 'Inactive', joined: '2022-11-01', spend: '$0' },
  { id: 4, name: 'Ellen Ripley', email: 'ripley@nostromo.com', status: 'Active', joined: '2023-01-15', spend: '$3,400' },
  { id: 5, name: 'Rick Deckard', email: 'blade@runner.com', status: 'Active', joined: '2023-03-10', spend: '$890' },
];

const initialOrders = [
  { id: 'ORD-001', customer: 'Sarah Connor', date: '2026-09-10', total: '$250.00', status: 'Completed' },
  { id: 'ORD-002', customer: 'Kyle Reese', date: '2026-09-12', total: '$49.00', status: 'Pending' },
  { id: 'ORD-003', customer: 'T-800', date: '2026-09-14', total: '$120.00', status: 'Review' },
  { id: 'ORD-004', customer: 'Ellen Ripley', date: '2026-09-15', total: '$15.00', status: 'Failed' },
  { id: 'ORD-005', customer: 'Rick Deckard', date: '2026-09-15', total: '$500.00', status: 'Completed' },
];

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [orders, setOrders] = useState(initialOrders);

  const addCustomer = (customer) => {
    // New records show first; keep a server-assigned id when the record came
    // from the API — the id is what detail links and PATCH/DELETE use.
    setCustomers(prev => [{ ...customer, id: customer.id ?? Date.now() }, ...prev]);
  };

  const updateCustomer = (id, customer) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addOrder = (order) => {
    // New records show first; keep a server-assigned id when the record came
    // from the API — the id is what PATCH/DELETE calls are built from.
    setOrders(prev => [{ ...order, id: order.id || `ORD-${Math.floor(Math.random() * 1000)}` }, ...prev]);
  };

  const updateOrder = (id, order) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...order } : o));
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <DataContext.Provider value={{
      customers, setCustomers, addCustomer, updateCustomer, deleteCustomer,
      orders, setOrders, addOrder, updateOrder, deleteOrder
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
