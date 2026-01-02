import { Link } from 'react-router-dom';
import { Shield, Clock, Heart, Star, Phone, MapPin, Menu, X, ArrowRight, CheckCircle, User } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const features = [
        { icon: <Clock size={32} className="text-blue-600" />, title: '24/7 Availability', desc: 'Book appointments anytime, day or night.' },
        { icon: <Shield size={32} className="text-blue-600" />, title: 'Secure Data', desc: 'Your medical records are encrypted and safe.' },
        { icon: <Heart size={32} className="text-blue-600" />, title: 'Expert Doctors', desc: 'Access to top-rated specialists in every field.' },
    ];

    const stats = [
        { value: '10k+', label: 'Happy Patients' },
        { value: '500+', label: 'Expert Doctors' },
        { value: '100%', label: 'Satisfaction' },
        { value: '24/7', label: 'Support' },
    ];

    const services = [
        'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Surgery'
    ];

    return (
        <div className="font-sans text-gray-900 bg-white">
            {/* 1. Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
                                <Heart className="mr-2 fill-current" /> MediBook
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
                            <a href="#services" className="text-gray-600 hover:text-blue-600 font-medium">Services</a>
                            <a href="#doctors" className="text-gray-600 hover:text-blue-600 font-medium">Doctors</a>
                            <Link to="/login" className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">Log In</Link>
                            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Sign Up</Link>
                        </div>
                        <div className="md:hidden">
                            <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <a href="#features" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg">Features</a>
                            <a href="#services" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg">Services</a>
                            <Link to="/login" className="block px-3 py-2 text-blue-600 font-medium">Log In</Link>
                            <Link to="/register" className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-center">Sign Up</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* 2. Hero Section */}
            <section className="relative pt-16 pb-24 lg:pt-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:w-1/2">
                        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                            👋 Number 1 Healthcare Application
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                            Find Your Doctor <br className="hidden lg:block" /> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Book Online</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-lg">
                            We offer the best medical services with top specialists. Book your appointment seamlessly and manage your health records in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30">
                                Book an Appointment <ArrowRight className="ml-2" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold flex items-center justify-center hover:bg-gray-50 transition-all">
                                Existing Patient
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Abstract Shapes / Image Placeholder */}
                <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block bg-gradient-to-bl from-blue-50 to-white">
                    {/* In a real app, an image would go here. Using a pattern for now */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>
            </section>

            {/* 3. Stats Section */}
            <section className="py-12 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx}>
                                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                                <p className="text-blue-200 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Features Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MediBook?</h2>
                        <p className="text-gray-600">We prioritize your health with seamless technology and expert care.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="mb-6 mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Services Section */}
            <section id="services" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Medical Departments</h2>
                            <p className="text-gray-600 max-w-lg">Specialized care for every need. Our doctors are experts in their fields.</p>
                        </div>
                        <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 flex items-center mt-4 md:mt-0">
                            See all departments <ArrowRight size={20} className="ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {services.map((service, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors text-center cursor-pointer group">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <Heart size={20} />
                                </div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-700">{service}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. How it Works */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400">3 Simple Steps to your first appointment</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/50">1</div>
                            <h3 className="text-xl font-bold mb-2">Create Account</h3>
                            <p className="text-gray-400">Sign up securely as a patient.</p>
                        </div>
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/50">2</div>
                            <h3 className="text-xl font-bold mb-2">Choose Doctor</h3>
                            <p className="text-gray-400">Browse profiles and select your specialist.</p>
                        </div>
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/50">3</div>
                            <h3 className="text-xl font-bold mb-2">Book Slot</h3>
                            <p className="text-gray-400">Pick a time that works and confirm.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Footer */}
            <footer className="bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center mb-4">
                                <Heart className="mr-2 fill-current" /> MediBook
                            </Link>
                            <p className="text-gray-500 max-w-sm">
                                Empowering better health through technology. The simplest way to book appointments and manage your medical journey.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-500">
                                <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                                <li><a href="#services" className="hover:text-blue-600">Services</a></li>
                                <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-500">
                                <li className="flex items-center"><Phone size={16} className="mr-2" /> +1 (555) 123-4567</li>
                                <li className="flex items-center"><MapPin size={16} className="mr-2" /> 123 Health Dr, Med City</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-400 text-sm">
                        © {new Date().getFullYear()} MediBook. All rights reserved. Made with ❤️ by Suraj Pawar.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
