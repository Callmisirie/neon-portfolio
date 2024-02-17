import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

function Navbar() {

    const [cookies, setCookies] = useCookies(["access_token"]);

    console.log(cookies);


    const Navigate = useNavigate();

    function Logout() {
        setCookies("access_token", "");
        window.localStorage.removeItem("adminUserID")
        Navigate("/");
    };

    return (   
        <div class="navbar">
            <div class="container">
                <ul>
                    <li><Link to="/"> Home </Link></li>
                    <li><Link to="/about"> About </Link></li>
                    <li> <Link to="/contact"> Contact </Link></li>
                    <li> <Link to="/manga"> Manga </Link></li>
                    {cookies.access_token ? (
                        <>
                            <li> <Link to="/auth"> Auth </Link></li>
                            <li><Link to="/manager"> Manager </Link></li> 
                            <li>
                                <button onClick={Logout}> Logout </button>
                            </li> 
                        </>
                            
                    ): null}
            
                   
                </ul>
            </div>
        </div>
    )
}
  
export default Navbar;