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


const router = createBrowserRouter([
  {path: '/', element: <KisarRegistration/>},
  {path: '/admin', element: <AdminPanel/>},
  {path: '/admin/packages', element: <AdminPanelPackages/>},
  { path: '*', element: <KisarRegistration /> },
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