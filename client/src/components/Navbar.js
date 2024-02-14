import { Link } from "react-router-dom";

function Navbar() {
    return (
       
        <div class="navbar">
            <div class="container">
                <ul>
                    <li><Link to="/"> Home </Link></li>
                    <li><Link to="/about"> About </Link></li>
                    <li> <Link to="/contact"> Contact </Link></li>
                    <li> <Link to="/portfolio"> Portfolio </Link></li>
                    <li> <Link to="/auth"> Auth </Link></li>
                    <li><Link to="/manager"> Manager </Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;