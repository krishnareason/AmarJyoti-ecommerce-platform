import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMostSelling } from '../api';
import ProductCard from '../components/product/ProductCard';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [mostSelling, setMostSelling] = useState([]);

    useEffect(() => {
        const getMostSelling = async () => {
            try {
                const res = await fetchMostSelling();
                setMostSelling(res.data);
            } catch (error) {
                console.error("Failed to fetch most selling products", error);
            }
        };
        getMostSelling();
    }, []);

    const handleNavigation = (role) => {
        navigate('/signup', { state: { userRole: role } });
    };

    return (
        <>
            <div className="landing-container">
                <div className="landing-overlay">
                    <div className="landing-content">
                        <h1>AmarJyoti Gold</h1>
                        <br></br><br></br>
                        <p>A serene flame for a tranquil soul.</p>
                    
                        <div className="button-group">
                            <button onClick={() => handleNavigation('wholesaler')} className="btn btn-primary">
                                🏬 Shop as Wholesaler (B2B)
                            </button>
                            <button onClick={() => handleNavigation('consumer')} className="btn btn-secondary">
                                🛍️ Shop for Personal Use (D2C)
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <section className="featured-products">
                <h2 className="featured-title">Featured Products</h2>
                <div className="product-list">
                    {mostSelling.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default LandingPage;