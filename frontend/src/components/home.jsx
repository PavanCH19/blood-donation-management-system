import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from "./nav";


const Home = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const navigate = useNavigate();

    useEffect(() => { }, [user, navigate]);

    const [notifications, setNotifications] = useState([]);


    useEffect(() => {
        // Fetch notifications for the logged-in user
        if (user) {
            axios.get(`http://localhost:8081/notifications?userId=${user.id}`, { withCredentials: true })
                .then(response => setNotifications(response.data))
                .catch(error => console.error('Error fetching notifications', error));
        }
    }, [user]);

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                localStorage.removeItem('user');
                alert("Successfully logged out.");
                navigate("/blood-donation-management-system/login");
            })
            .catch(error => {
                console.error('Logout failed', error);
            });
    };

    return (
        <div>
            <Nav userType={user?.userType} handleLogout={handleLogout} />

            <div className="App">
                <style>{`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        font-family: 'Roboto', sans-serif;
                    }
                    body {
                        color: #333;
                        background-color: #f9f9f9;
                        scroll-behavior: smooth;
                    }
                    header {
                        background-color: #c0392b;
                        color: #fff;
                        padding: 1rem 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: sticky;
                        top: 0;
                        z-index: 1000;
                    }
                    header h1 {
                        margin-left: 1rem;
                        font-size: 2rem;
                        font-weight: 700;
                    }
                    header nav ul {
                        list-style: none;
                        display: flex;
                        margin-right: 1rem;
                    }
                    header nav ul li {
                        margin: 0 20px;
                    }
                    header nav ul li a {
                        color: #fff;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    header nav ul li a:hover {
                        text-decoration: underline;
                    }
                    .hero {
                        height: 500px;
                        background-image: url('https://via.placeholder.com/1200x500/ff0000/ffffff?text=');
                        background-size: cover;
                        background-position: center;
                        text-align: center;
                        color: #fff;
                        position: relative;
                    }
                    .hero h2 {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 3rem;
                        font-weight: 700;
                        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                        color: white;
                    }
                    .hero button {
                        position: absolute;
                        top: 65%;
                        left: 50%;
                        transform: translateX(-50%);
                        padding: 0.8rem 1.5rem;
                        background-color: #c0392b;
                        border: none;
                        color: #fff;
                        font-size: 1rem;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .mission {
                        padding: 4rem 2rem;
                        background-color: #ffe6e6;
                        text-align: center;
                    }
                    .mission h2 {
                        font-size: 2.5rem;
                        color: #c0392b;
                        margin-bottom: 1rem;
                    }
                    .mission p {
                        font-size: 1.2rem;
                        max-width: 700px;
                        margin: auto;
                    }
                    .why-donate {
                        padding: 4rem 2rem;
                        background-color: #f8f8f8;
                        text-align: center;
                    }
                    .why-donate h2 {
                        font-size: 2.5rem;
                        color: #c0392b;
                        margin-bottom: 1rem;
                    }
                    .reasons {
                        display: flex;
                        justify-content: space-around;
                        gap: 2rem;
                        margin-top: 2rem;
                    }
                    .reason {
                        background: #fff;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        padding: 2rem;
                        width: 30%;
                    }
                    .reason h3 {
                        color: #c0392b;
                        font-size: 1.8rem;
                        margin-bottom: 1rem;
                    }
                    .reason p {
                        font-size: 1.1rem;
                        line-height: 1.5;
                    }
                    .contact {
                        padding: 4rem 2rem;
                        background-color: #ffe6e6;
                        text-align: center;
                    }
                    .contact h2 {
                        font-size: 2.5rem;
                        color: #c0392b;
                        margin-bottom: 1rem;
                    }
                    .contact form {
                        max-width: 600px;
                        margin: 0 auto;
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .contact input, .contact textarea {
                        padding: 1rem;
                        border: 2px solid #ddd;
                        border-radius: 5px;
                        font-size: 1rem;
                    }
                    .contact button {
                        background-color: #c0392b;
                        color: #fff;
                        padding: 1rem;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                        border-radius: 5px;
                    }
                    .contact button:hover {
                        background-color: #e74c3c;
                    }
                    footer {
                        background-color: #333;
                        color: #fff;
                        text-align: center;
                        padding: 2rem;
                    }
                    footer a {
                        color: #e74c3c;
                        text-decoration: none;
                    }

                    /* Donor Testimonials CSS */
                    .donor-testimonials {
                        padding: 4rem 2rem;
                        background-color: #f8f8f8;
                        text-align: center;
                    }
                    .donor-testimonials h2 {
                        font-size: 2.5rem;
                        color: #c0392b;
                        margin-bottom: 2rem;
                    }
                    .testimonial-container {
                        display: flex;
                        justify-content: space-around;
                        gap: 2rem;
                        margin-top: 2rem;
                        flex-wrap: wrap;
                    }
                    .testimonial {
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        padding: 2rem;
                        width: 30%;
                        text-align: left;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .testimonial h3 {
                        color: #c0392b;
                        font-size: 1.8rem;
                        margin-bottom: 1rem;
                    }
                    .testimonial p {
                        font-size: 1.1rem;
                        line-height: 1.5;
                    }
                    .testimonial:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
                    }

                    @media (max-width: 768px) {
                        .testimonial {
                            width: 45%;
                        }
                    }

                    @media (max-width: 480px) {
                        .testimonial {
                            width: 100%;
                        }
                    }
                        /* How to Donate Blood Section CSS */
                    .how-to-donate {
                        padding: 4rem 2rem;
                        background-color: #f8f8f8;
                        text-align: center;
                    }

                    .how-to-donate h2 {
                        font-size: 2.5rem;
                        color: #c0392b;
                        margin-bottom: 1.5rem;
                    }

                    .steps {
                        display: flex;
                        justify-content: space-around;
                        gap: 2rem;
                        flex-wrap: wrap;
                        margin-top: 2rem;
                    }

                    .step {
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        padding: 2rem;
                        width: 30%;
                        text-align: left;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }

                    .step h3 {
                        color: #c0392b;
                        font-size: 1.8rem;
                        margin-bottom: 1rem;
                    }

                    .step p {
                        font-size: 1.1rem;
                        line-height: 1.6;
                    }

                    .step:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
                    }

                    @media (max-width: 768px) {
                        .step {
                            width: 45%;
                        }
                    }

                    @media (max-width: 480px) {
                        .step {
                            width: 100%;
                        }
                    }
 .notifications {
                        padding: 4rem 2rem;
                        background-color: #ffe6e6;
                        text-align: center;
                    }
                    .notifications h2 {
                        font-size: 2.5rem;
                        color: #c0392b;
                        margin-bottom: 1rem;
                    }
                    .notification-list {
                        max-width: 700px;
                        margin: auto;
                        list-style: none;
                        padding: 0;
                    }
                    .notification-item {
                        background: #fff;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        padding: 1.5rem;
                        margin-bottom: 1rem;
                        text-align: left;
                    }
                    .notification-item h3 {
                        color: #c0392b;
                        font-size: 1.4rem;
                        margin-bottom: 0.5rem;
                    }
                    .notification-item p {
                        font-size: 1rem;
                        line-height: 1.5;
                        color: #555;
                    }
                `}</style>

                <header>
                    <h1>Blood Donation</h1>
                    <nav>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#mission">Mission</a></li>
                            <li><a href="#why-donate">Why Donate</a></li>
                            <li><a href="#uses">Uses of Blood Donation</a></li>
                            <li><a href="#testimonials">Testimonials</a></li>
                            <li><a href="#how-to-donate">How to Donate Blood</a></li> {/* Added link to new section */}
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                </header>

                <section className="hero">
                    <h2 >Welcome to the Blood Donation Management System</h2>
                    {user ? (
                        user.userType === "admin" ? (
                            <>
                                <h3>Welcome, {user.donarName || user.bloodBankName || user.adminName}</h3>
                                <button onClick={() => navigate("/blood-donation-management-system/admin-dashboard")}>
                                    Go to Dashboard
                                </button>
                            </>
                        ) : user.userType === "donar" || user.userType === "bloodbank" ? (
                            <>
                                <h3>Welcome, {user.donarName || user.bloodBankName}</h3>
                                <button onClick={() => navigate("/blood-donation-management-system/user-dashboard")}>
                                    Go to Dashboard
                                </button>
                            </>
                        ) : (
                            <button onClick={() => navigate("/blood-donation-management-system/login")}>
                                Login / Register
                            </button>
                        )
                    ) : (
                        <button onClick={() => navigate("/blood-donation-management-system/login")}>
                            Login / Register
                        </button>
                    )}
                </section>


                <section id="notifications" className="notifications">
                    <h2>Notifications</h2>
                    {notifications.length > 0 ? (
                        <ul className="notification-list">
                            {notifications.map((notification, index) => (
                                <li key={index} className="notification-item">
                                    <h3>{notification.title}</h3>
                                    <p>{notification.message}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No new notifications</p>
                    )}
                </section>

                <section id="mission" className="mission">
                    <h2>Our Mission</h2>
                    <p>We aim to create a life-saving network that connects donors with those in need of blood.</p>
                </section>

                <section id="why-donate" className="why-donate">
                    <h2>Why Donate Blood?</h2>
                    <div className="reasons">
                        <div className="reason">
                            <h3>Save Lives</h3>
                            <p>Your donation can save up to three lives. Blood is crucial in many medical emergencies.</p>
                        </div>
                        <div className="reason">
                            <h3>Community Support</h3>
                            <p>Donating blood helps strengthen your community and provide assistance during crises.</p>
                        </div>
                        <div className="reason">
                            <h3>Health Benefits</h3>
                            <p>Regular blood donation can lower the risk of certain diseases and promote overall health.</p>
                        </div>
                    </div>
                </section>

                <section id="uses" className="mission">
                    <h2>Uses of Blood Donation</h2>
                    <p>Blood is vital for various medical treatments. Here are some of its important uses:</p>
                    <ul>
                        <li>Emergency surgeries, trauma, and accidents</li>
                        <li>Cancer treatments and organ transplants</li>
                        <li>Support for mothers during childbirth</li>
                        <li>Treating severe anemia and blood disorders</li>
                        <li>Helping patients undergoing treatments for chronic conditions</li>
                    </ul>
                </section>

                <section id="how-to-donate" className="how-to-donate">
                    <h2>How to Donate Blood</h2>
                    <div className="steps">
                        <div className="step">
                            <h3>Step 1: Check Eligibility</h3>
                            <p>Before donating blood, ensure youre eligible. Typically, you need to be in good health, at least 18 years old, and weigh over 50kg.</p>
                        </div>
                        <div className="step">
                            <h3>Step 2: Find a Blood Donation Center</h3>
                            <p>Locate a nearby blood donation center or a mobile blood drive. You can find them through hospitals, blood banks, or online resources.</p>
                        </div>
                        <div className="step">
                            <h3>Step 3: Prepare for Donation</h3>
                            <p>Make sure to eat a healthy meal and drink plenty of water before donating. Bring identification, and wear clothing with sleeves that can be rolled up.</p>
                        </div>
                        <div className="step">
                            <h3>Step 4: Donate Blood</h3>
                            <p>During donation, a trained professional will collect approximately one pint of blood. The process usually takes about 10-15 minutes.</p>
                        </div>
                        <div className="step">
                            <h3>Step 5: Post-Donation Care</h3>
                            <p>After donation, take a few minutes to rest and enjoy a light snack to replenish your energy. Make sure to stay hydrated for the next 24 hours.</p>
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="donor-testimonials">
                    <h2>What Donors Say</h2>
                    <div className="testimonial-container">
                        <div className="testimonial">
                            <h3>John Doe</h3>
                            <p>I donate blood regularly because I know it can save lives. Its a simple act, but it makes a huge difference.</p>
                        </div>
                        <div className="testimonial">
                            <h3>Jane Smith</h3>
                            <p>Donating blood is one of the most rewarding things Ive ever done. It feels great knowing I can help someone in need.</p>
                        </div>
                    </div>
                </section>

                <section id="contact" className="contact">
                    <h2>Contact Us</h2>
                    <form>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Message" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </section>

                <footer>
                    <p>&copy; 2024 Blood Donation Management System</p>
                    <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
