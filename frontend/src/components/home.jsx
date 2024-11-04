import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from "./nav";

const Home = () => {
    const [user, setUser] = useState(() => {
        // Check if user data is stored in local storage
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null; // Initialize state with user data from local storage
    });
    const navigate = useNavigate();

    useEffect(() => {
        // If user is not available, you can handle accordingly
        // For now, we won't redirect to login
    }, [user, navigate]); // No dependencies needed here

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
            .then(() => {
                setUser(null); // Clear user details
                localStorage.removeItem('user'); // Clear user from local storage
                alert("Successfully logged out.");
                navigate("/blood-donation-management-system/login"); // Redirect to login after logout
            })
            .catch(error => {
                console.error('Logout failed', error); // Properly log logout errors
            });
    };

    return (
        <div>
            <Nav userType={user?.userType} handleLogout={handleLogout} />
            <h1><b><i><u><marquee direction="">Blood donation management system</marquee></u></i></b></h1>

            <center>
                {user ? (
                    <>
                        <h2>Welcome, {user.donarName || user.bloodBankName}</h2>
                        <h3>Logged in as {user.userType}</h3>
                        <button onClick={() => navigate("/blood-donation-management-system/user-dashboard")}>dashboard</button>
                    </>
                ) : (
                    <></>
                )}
            </center>

            <p><i>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo delectus ratione ad corrupti non aperiam unde dicta, nostrum, in eos, commodi voluptate nihil minima. Totam eum illo cum modi error.
                Voluptatum, quia dolorem laboriosam labore libero quidem molestiae recusandae vero quasi placeat in dolor minima deleniti quae, impedit optio ratione voluptatibus magnam molestias rem quos! Possimus necessitatibus nemo amet odit.
                Quaerat a dolor minima corporis illo modi assumenda quod! Non est deleniti vel itaque blanditiis eos. Quod, perferendis. Itaque nesciunt vitae vero harum, praesentium quam quod? Cumque, quaerat rerum. Voluptates.
                Officia et maxime hic cupiditate vel corrupti facere exercitationem. Enim asperiores, consequuntur commodi amet, animi adipisci, culpa fugiat pariatur harum delectus fuga! Consequuntur natus nihil laudantium earum hic, explicabo rerum.
                Ipsa corrupti cumque optio veniam praesentium, omnis, deleniti harum consequuntur doloribus perferendis id provident inventore quo! Unde optio eligendi, incidunt voluptas minima sequi, deserunt, obcaecati officia accusantium voluptates reiciendis minus!
                Amet consectetur blanditiis hic, accusantium accusamus deleniti illo rem in, sequi ducimus debitis iste fugit molestiae, dicta explicabo error voluptatum? Quisquam laborum vel fuga nam distinctio voluptas voluptate. Suscipit, ab.
                Totam eius nesciunt laudantium aspernatur. Debitis, tenetur ratione. Ea sint sequi minima neque voluptate ex soluta, laborum mollitia debitis perspiciatis unde sapiente doloribus! Odit quis ea quidem esse ipsa accusamus!
                Similique ullam inventore saepe provident atque, blanditiis harum ab eius voluptatum possimus iure facere, pariatur ea in molestiae earum vero. Voluptatem consequuntur quidem eius. Fugit saepe ratione possimus amet dolore.
                Iusto id, ipsa voluptatum, nam inventore labore tenetur, maiores expedita impedit nesciunt velit voluptatem eius quisquam? Eos voluptatem sint fugit incidunt ducimus amet autem. Sint ipsam quod vel ullam corporis?
                Facere odit magni harum sunt ab ratione quia labore eaque nulla nihil laboriosam a officiis tenetur consectetur optio amet autem voluptatem, commodi aspernatur distinctio! Ex molestias quod consectetur voluptatum aut.</i></p>
        </div>
    );
};

export default Home;
