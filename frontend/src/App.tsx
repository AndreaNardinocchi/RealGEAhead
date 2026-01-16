import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import SiteHeader from "./components/siteHeader/siteHeader";
import Footer from "./components/footer/footer";
import AboutUsPage from "./pages/aboutUsPage";
import FacilitiesPage from "./pages/facilities";
import RoomsPage from "./pages/roomsPage";
import SearchResultsPage from "./pages/searchResultsPage";

const App = () => {
  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
