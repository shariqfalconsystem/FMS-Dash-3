import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
// import Events from "./pages/Events";
// import Trips from "./pages/Trips";
// import Driver from "./pages/Driver";
// import Devices from "./pages/Devices";
// import Settings from "./pages/Settings";
import DocumentCenter from "./pages/DocumentCenter";
import Vehicle from "./pages/Vehicles";
import NotificationsPage from "./pages/NotificationsPage";
// import UserManagement from "./pages/UserManagement";
// import FleetTracking from "./pages/FleetTracking";
// import SupportsPage from "./pages/Supports";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />


            {/* user profile route page */}
            <Route path="/profile" element={<UserProfiles />} />


            {/* Others Page */}
            {/* <Route path="/fleet-tracking" element={<FleetTracking />} />
            <Route path="/events" element={<Events />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="/supports" element={<SupportsPage />} /> */}
            <Route path="/document-center" element={<DocumentCenter />} />
            <Route path="fleet/notifications" element={<NotificationsPage />} />
            <Route path="/vehicles" element={<Vehicle />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
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
