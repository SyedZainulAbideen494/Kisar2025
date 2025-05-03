import { Fragment, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Params,
} from "react-router-dom";
import "./index.css";
import "./App.css";
import KisarRegistration from "./form/form";
import AdminPanel from "./admin pannel/admin";
import AdminPanelPackages from "./admin pannel/add-packages";
import PaymentSuccess from "./payment-status/paymentSuccess";
import PaymentFail from "./payment-status/paymentFail";
import UpgradePackagesPage from "./upgrade package/UpgradePackagesPage";
import MainEventRegApp from "./event admin pannel/mainEventReg";
import AddEventRegPage from "./event admin pannel/addreg";
import SessionsPage from "./event admin pannel/SessionsPage";
import AnalyticsPage from "./event admin pannel/analytics";


const router = createBrowserRouter([
  {path: '/', element: <KisarRegistration/>},
  {path: '/admin', element: <AdminPanel/>},
  {path: '/admin/packages', element: <AdminPanelPackages/>},
  { path: '*', element: <KisarRegistration /> },
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment-fail", element: <PaymentFail /> },
  {path: '/upgrade-package', element: <UpgradePackagesPage/>},
  {path: '/event/admin/main', element: <MainEventRegApp/>},
  {path: '/event/admin/add-registration', element: <AddEventRegPage/>},
  {path: '/event/admin/session', element: <SessionsPage/>},
  {path: '/event/admin/analytics', element: <AnalyticsPage/>},


]);


function App() {
  const [subscription, setSubscription] = useState(null);


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;