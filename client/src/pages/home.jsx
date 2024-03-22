import {useState} from "react"
import axios from "axios"

function Home() {
    const [email, setEmail] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4001/updateSignUp", {email});
            console.log(response);
            setEmail("");
        } catch (error) {
            console.error(error)
        }
    }
            
           

    return (
        <div>
            <div>
                <form 
                    onSubmit={handleSubmit}
                >
                    <input 
                        onChange={(e)=> setEmail(e.target.value)} 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        name="email"
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div class="footer">
                <div class="container">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};


export default Home;