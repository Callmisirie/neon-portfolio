import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/home"
import Contact from './pages/contact';
import About from './pages/about';
import Manga from './pages/manga';
import Auth from './pages/auth';
import Manager from './pages/manager';
import Navbar from './components/Navbar';
import NewManga from './pages/newManga';
import ExistingManga from './pages/existingManga';
import Chapters from './pages/chapters';
import Pages from './pages/pages';


function App() {

  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/manga" element={<Manga />}/>
          <Route path="/auth" element={<Auth />}/>
          <Route path="/manager" element={<Manager />}/>
          <Route path="/manager/newManga" element={<NewManga />}/>
          <Route path="/manager/existingManga" element={<ExistingManga />}/>
          <Route path="/manga/:chapters" element={<Chapters />}/>
          <Route path="/manga/:chapters/:pages" element={<Pages />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
