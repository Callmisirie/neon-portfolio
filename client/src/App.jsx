import './index.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/home.jsx"
import Manga from "./pages/manga/manga.jsx";
import Chapters from "./pages/manga/chapters.jsx";
import Pages from "./pages/manga/pages.jsx";
import Contact from "./pages/contact.jsx";
import About from "./pages/about.jsx";
import Find from "./pages/find.jsx";
import Manager from './pages/manager/manager.jsx';
import MangaManager from "./pages/manager/manga/manga.jsx";
import CommissionManager from './pages/manager/commission/commission.jsx';
import { MangaCreate, MangaDelete, MangaEdit } from './pages/manager/manga/manga.jsx';
import { CommissionCreate, CommissionDelete, CommissionEdit } from './pages/manager/commission/commission.jsx';
import Auth from "./pages/auth.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from './components/Footer.jsx';
import { useCookies } from "react-cookie";



function App() {
  const [cookies, ] = useCookies(["access_token"]);


  return (
    <main className='relative'>
      <Router> 
          <div className='min-h-screen'>
            <Navbar/>      
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

                  <Route path="/manager/manga" element={<MangaManager />}/>
                  <Route path="/manager/manga/create/manga" element={<MangaCreate />}/>
                  <Route path="/manager/manga/create/manga/chapter" element={<MangaCreate />}/>
                  <Route path="/manager/manga/delete/manga" element={<MangaDelete />}/>
                  <Route path="/manager/manga/delete/manga/chapter" element={<MangaDelete />}/>
                  <Route path="/manager/manga/edit/manga" element={<MangaEdit />}/>
                  <Route path="/manager/manga/edit/manga/chapter" element={<MangaEdit />}/>

                  <Route path="/manager/commission" element={<CommissionManager />}/>
                  <Route path="/manager/commission/create/commission" element={<CommissionCreate />}/>
                  <Route path="/manager/commission/delete/commission" element={<CommissionDelete />}/>
                  <Route path="/manager/commission/edit/commission" element={<CommissionEdit />}/>
                  
                </>
              )}
              <Route path="/manga/:chapters" element={<Chapters />}/>
              <Route path="/manga/:chapters/:pages" element={<Pages />}/>
            </Routes>    
          </div>  
          <Footer />
      </Router>
    </main>
  );
}

export default App;
