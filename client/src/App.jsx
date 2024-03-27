import './index.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/home.jsx"
import Manga from "./pages/manga.jsx";
import Chapters from "./pages/chapters.jsx";
import Pages from "./pages/pages.jsx";
import Contact from "./pages/contact.jsx";
import About from "./pages/about.jsx";
import Find from "./pages/find.jsx";
import Manager from "./pages/manager.jsx";
import { Create, Delete, Edit } from "./pages/manager.jsx";
import Auth from "./pages/auth.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from './components/Footer.jsx';
import { useCookies } from "react-cookie";



function App() {
  const [cookies, ] = useCookies(["access_token"]);


  return (
    <main className='relative'>
      <Router> 
              {/* <Navbar/>       */}
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/manga" element={<Manga />}/>
            <Route path="/auth" element={<Auth />}/>
            <Route path="/manga/find/:mangaName" element={<Find />}/>
            {cookies.access_token && (
              <>
                <Route path="/manager" element={<Manager />}/>
                <Route path="/manager/create/manga" element={<Create />}/>
                <Route path="/manager/create/manga/chapter" element={<Create />}/>
                <Route path="/manager/delete/manga" element={<Delete />}/>
                <Route path="/manager/delete/manga/chapter" element={<Delete />}/>
                <Route path="/manager/edit/manga" element={<Edit />}/>
                <Route path="/manager/edit/manga/chapter" element={<Edit />}/>
              </>
            )}
            <Route path="/manga/:chapters" element={<Chapters />}/>
            <Route path="/manga/:chapters/:pages" element={<Pages />}/>
          </Routes>       
        {/* <Footer /> */}
      </Router>
    </main>
  );
}

export default App;
