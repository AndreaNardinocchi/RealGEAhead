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
import UserProfilePage from "./pages/userProfilePage";
import ProtectedRoute from "./routes/protectedRoutes";
import AccountMyTripsPage from "./pages/accountMyTripsPage";
import BookingConfirmationPage from "./pages/bookingConfirmationPage";
import AdminRoute from "./routes/adminRoute";
import AdminBookingsPage from "./pages/adminBookingsPage";
import AdminUsersPage from "./pages/adminUsersPage";

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

        <Route
          path="/account/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/mytrips"
          element={
            <ProtectedRoute>
              <AccountMyTripsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking-confirmation/:id"
          element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
