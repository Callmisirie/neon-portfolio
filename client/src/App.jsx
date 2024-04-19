import './index.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/home.jsx"
import Manga from "./pages/manga/manga.jsx";
import Chapters from "./pages/manga/chapters.jsx";
import Pages from "./pages/manga/pages.jsx";
import Gift from './pages/gift.jsx';
import Payment from './pages/payment.jsx';
import Commission from './pages/commission.jsx';
import Contact from "./pages/contact.jsx";
import About from "./pages/about.jsx";
import Find from "./pages/find.jsx";
import Manager from './pages/manager/manager.jsx';
import MangaManager from "./pages/manager/manga/manga.jsx";
import CommissionManager from './pages/manager/commission/commission.jsx';
import GiftManager from './pages/manager/gift/gift.jsx';
import ReviewManager from './pages/manager/review/review.jsx';
import { MangaCreate, MangaDelete, MangaEdit } from './pages/manager/manga/manga.jsx';
import { CommissionCreate, CommissionDelete, CommissionEdit } from './pages/manager/commission/commission.jsx';
import { GiftCreate, GiftDelete, GiftEdit } from './pages/manager/gift/gift.jsx';
import { ReviewCreate, ReviewDelete, ReviewEdit } from './pages/manager/review/review.jsx';
import AdminAuth from "./pages/adminAuth.jsx";
import UserAuth from './pages/userAuth.jsx';
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
              <Route path="/commission" element={<Commission />}/>
              <Route path="/contact" element={<Contact />}/>
              <Route path="/about" element={<About />}/>
              <Route path="/manga" element={<Manga />}/>
              <Route path="/gift" element={<Gift />}/>
              <Route path="/payment" element={<Payment />}/>
              <Route path="/auth/admin" element={<AdminAuth />}/>
              <Route path="/auth/user" element={<UserAuth />}/>

              <Route path="/manga/find/:mangaName" element={<Find />}/>
              {cookies.access_token &&  (
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
                  <Route path="/manager/commission/create" element={<CommissionCreate />}/>
                  <Route path="/manager/commission/delete" element={<CommissionDelete />}/>
                  <Route path="/manager/commission/edit" element={<CommissionEdit />}/>

                  <Route path="/manager/gift" element={<GiftManager />}/>
                  <Route path="/manager/gift/create" element={<GiftCreate />}/>
                  <Route path="/manager/gift/delete" element={<GiftDelete />}/>
                  <Route path="/manager/gift/edit" element={<GiftEdit />}/>

                  <Route path="/manager/review" element={<ReviewManager />}/>
                  <Route path="/manager/review/delete" element={<ReviewDelete />}/>
                  <Route path="/manager/review/edit" element={<ReviewEdit />}/>
                </>
              )}
              <Route path="/review/create" element={<ReviewCreate />}/>
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
