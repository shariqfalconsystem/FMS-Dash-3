import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Alerts from "./pages/UiElements/Alerts";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import DocumentCenter from "./pages/DocumentCenter";
import { Vehicles } from "./pages/Vehicles";
import NotificationsPage from "./pages/NotificationsPage";
import LiveTracking from "./pages/LiveTracking";
import Maintenance from "./pages/Maintenance";
import Dashboard from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import TripsDashboard from "./pages/Trips";
import DriversDashboard from "./pages/Drivers";

export default function App() {

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* <Route index path="/" element={<Home />} /> */}
            <Route path="/" element={<Dashboard />} />


            {/* user profile route page */}
            <Route path="/profile" element={<UserProfiles />} />


            {/* Others Page */}
            <Route path="/live-tracking" element={<LiveTracking />} />
            <Route path="/document-center" element={<DocumentCenter />} />
            <Route path="fleet/notifications" element={<NotificationsPage />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/trips" element={<TripsDashboard />} />
            <Route path="/drivers" element={<DriversDashboard />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
