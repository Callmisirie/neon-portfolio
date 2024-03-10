import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/home"
import Manga from "./pages/manga";
import Chapters from "./pages/chapters";
import Pages from "./pages/pages";
import Contact from "./pages/contact";
import About from "./pages/about";
import Find from "./pages/find";

import Manager from "./pages/manager";
import { Create, Delete, Edit } from "./pages/manager";
import Auth from "./pages/auth";

import Navbar from "./components/Navbar";

import { useCookies } from "react-cookie";


function App() {
  const [cookies, ] = useCookies(["access_token"]);

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
      </Router>
    </div>
  );
}

export default App;
