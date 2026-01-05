import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import SiteHeader from "./components/siteHeader/siteHeader";
import Footer from "./components/footer/footer";
import AboutUsPage from "./pages/aboutUsPage";

const App = () => {
  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
