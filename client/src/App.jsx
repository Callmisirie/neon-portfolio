import './index.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/home.jsx"
import Manga from "./pages/manga/manga.jsx";
import Chapters from "./pages/manga/chapters.jsx";
import Pages from "./pages/manga/pages.jsx";
import Gift from './pages/gift.jsx';
import Payment from './pages/payment.jsx';
import Order from './pages/order.jsx';
import Commission from './pages/commission.jsx';
import TransactionHistory from './pages/transactionHistory.jsx';
import Contact from "./pages/contact.jsx";
import About from "./pages/about.jsx";
import Find from "./pages/find.jsx";
import Manager from './pages/manager/manager.jsx';
import MangaManager from "./pages/manager/manga/manga.jsx";
import CommissionManager from './pages/manager/commission/commission.jsx';
import GiftManager from './pages/manager/gift/gift.jsx';
import NewsLetterUpdateManager from './pages/manager/newsLetter/newsletter.jsx';
import ReviewManager from './pages/manager/review/review.jsx';
import TransactionsManager from './pages/manager/transactions/transactions.jsx';
import { MangaCreate, MangaDelete, MangaEdit } from './pages/manager/manga/manga.jsx';
import { CommissionCreate, CommissionDelete, CommissionEdit } from './pages/manager/commission/commission.jsx';
import { GiftCreate, GiftDelete, GiftEdit } from './pages/manager/gift/gift.jsx';
import { ReviewCreate, ReviewDelete, ReviewEdit } from './pages/manager/review/review.jsx';
import { TransactionsStatus, TransactionsDelete } from './pages/manager/transactions/transactions.jsx';
import { CreateNewsletterUpdate } from './pages/manager/newsLetter/newsletter.jsx';
import AdminAuth from "./pages/adminAuth.jsx";
import UserAuth from './pages/userAuth.jsx';
import Navbar from "./components/Navbar.jsx";
import Footer from './components/Footer.jsx';
import { useCookies } from "react-cookie";
import ScrollToTop from './components/ScrollToTop.jsx';
import GenerateOTP from './pages/passwordReset.js/generateOTP.jsx';
import ChangePassword from './pages/passwordReset.js/changePassword.jsx';
import { useEffect } from 'react';



function App() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const orderDetails = JSON.parse(window.localStorage.getItem("orderDetails"));

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
        setCookies("access_token", accessToken);
    }
  }, []);

  return (
      <main className='relative'>
      <Router> 
          <div className='min-h-screen'>
          <Navbar/> 
          <ScrollToTop />     
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/commission" element={<Commission />}/>
            <Route path="/commission/transactionHistory" element={<TransactionHistory />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/manga" element={<Manga />}/>
            <Route path="/gift" element={<Gift />}/>
            <Route path="/commission/payment" element={<Payment />}/>
            <Route path="/commission/payment/order" element={<Order />}/>
            <Route path="/auth/admin" element={<AdminAuth />}/>
            <Route path="/auth/user" element={<UserAuth />}/>
            <Route path="/passwordReset/generateOTP" element={<GenerateOTP />}/>
            <Route path="/passwordReset/changePassword" element={<ChangePassword />}/>
            <Route path="/manga/find/:mangaName" element={<Find />}/>
            {cookies.access_token ?  (
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

                <Route path="/manager/transactions" element={<TransactionsManager />}/>
                <Route path="/manager/transactions/status" element={<TransactionsStatus />}/>
                <Route path="/manager/transactions/delete" element={<TransactionsDelete />}/>

                <Route path="/manager/newsletterUpdate" element={<NewsLetterUpdateManager />}/>
                <Route path="/manager/newsletterUpdate/create" element={<CreateNewsletterUpdate />}/>
              </>
            ) : null}
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
