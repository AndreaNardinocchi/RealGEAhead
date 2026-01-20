import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import SiteHeader from "./components/siteHeader/siteHeader";
import Footer from "./components/footer/footer";
import AboutUsPage from "./pages/aboutUsPage";
import FacilitiesPage from "./pages/facilities";
import RoomsPage from "./pages/roomsPage";
import SearchResultsPage from "./pages/searchResultsPage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";
import UpdatePasswordPage from "./pages/updatePassword";
import RoomDetails from "./pages/roomDetailsPage";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
