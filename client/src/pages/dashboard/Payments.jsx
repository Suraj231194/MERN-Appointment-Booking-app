import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, CheckCircle, Loader2, QrCode, Copy, ChevronRight } from 'lucide-react';

const Payments = () => {
    const [status, setStatus] = useState('idle'); // idle, processing, success
    const [method, setMethod] = useState('upi');
    const [upiOption, setUpiOption] = useState('qr'); // qr, id

    const handlePayment = () => {
        setStatus('processing');
        setTimeout(() => {
            setStatus('success');
        }, 3000);
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center p-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-slide-up">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 mb-8">Transaction ID: TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                        <span className="text-gray-500">Amount Paid</span>
                        <span className="text-xl font-bold text-gray-900">₹850.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Paid to</span>
                        <span className="font-medium text-gray-900">Dr. Gregory House</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Date & Time</span>
                        <span className="font-medium text-gray-900">{new Date().toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary-500/30"
                >
                    Done
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                <p className="text-gray-500 text-sm">Secure Payment Gateway</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Consultation Fee</span>
                                <span>₹800.00</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Service Tax (GST)</span>
                                <span>₹50.00</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between font-bold text-gray-900 text-lg">
                                <span>Total Payable</span>
                                <span>₹850.00</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-primary-800">100% Secure Payment</p>
                                <p className="text-xs text-primary-600 mt-1">Your payment details are encrypted and processed securely.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Options */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col md:flex-row">

                        {/* Sidebar */}
                        <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-100 p-2">
                            <div className="space-y-1">
                                <button
                                    onClick={() => setMethod('upi')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${method === 'upi' ? 'bg-white shadow text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Smartphone size={20} /> UPI
                                </button>
                                <button
                                    onClick={() => setMethod('card')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${method === 'card' ? 'bg-white shadow text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <CreditCard size={20} /> Card
                                </button>
                                <button
                                    onClick={() => setMethod('netbanking')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${method === 'netbanking' ? 'bg-white shadow text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Building size={20} /> Netbanking
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="w-full md:w-2/3 p-8 relative">
                            {status === 'processing' && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                                    <p className="text-gray-600 font-medium">Processing your payment...</p>
                                    <p className="text-xs text-gray-400 mt-2">Do not close this window</p>
                                </div>
                            )}

                            {method === 'upi' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-gray-900">Pay via UPI</h3>

                                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                                        <button
                                            onClick={() => setUpiOption('qr')}
                                            className={`pb-2 text-sm font-medium transition-colors relative ${upiOption === 'qr' ? 'text-primary-600' : 'text-gray-500'}`}
                                        >
                                            Scan QR
                                            {upiOption === 'qr' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full"></div>}
                                        </button>
                                        <button
                                            onClick={() => setUpiOption('id')}
                                            className={`pb-2 text-sm font-medium transition-colors relative ${upiOption === 'id' ? 'text-primary-600' : 'text-gray-500'}`}
                                        >
                                            UPI ID
                                            {upiOption === 'id' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full"></div>}
                                        </button>
                                    </div>

                                    {upiOption === 'qr' ? (
                                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
                                                <QrCode size={180} className="text-gray-900" />
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium mb-1">Scan to Pay ₹850.00</p>
                                            <p className="text-xs text-gray-500">Use any UPI app (PhonePe, GPay, Paytm)</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="username@upi"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                                    />
                                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-600 uppercase">Verify</button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">e.g. mobileNumber@ybl, username@okhdfcbank</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePayment}
                                        className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        Pay ₹850.00 <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}

                            {method === 'card' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-gray-900">Pay via Card</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Card Number</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    maxLength="19"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Valid Thru</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">CVV</label>
                                                <input
                                                    type="password"
                                                    placeholder="123"
                                                    maxLength="3"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Cardholder Name</label>
                                            <input
                                                type="text"
                                                placeholder="Name on card"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
                                    >
                                        Pay ₹850.00
                                    </button>
                                </div>
                            )}

                            {method === 'netbanking' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-gray-900">Netbanking</h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank'].map((bank) => (
                                            <button
                                                key={bank}
                                                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {bank[0]}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{bank}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white text-gray-700">
                                            <option>Select another bank</option>
                                            <option>Punjab National Bank</option>
                                            <option>Bank of Baroda</option>
                                            <option>Union Bank</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
                                    >
                                        Pay ₹850.00
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
