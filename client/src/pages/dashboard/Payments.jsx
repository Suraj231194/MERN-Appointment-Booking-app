import React from 'react';
import { CreditCard } from 'lucide-react';

const Payments = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Payments & Billing</h2>
                <p className="text-gray-500 text-sm">Manage transactions and invoices</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-green-50 p-4 rounded-full mb-4">
                    <CreditCard size={48} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Gateway</h3>
                <p className="text-gray-500 max-w-md">This section will handle payment processing, invoice generation, and financial reporting.</p>
            </div>
        </div>
    );
};

export default Payments;
