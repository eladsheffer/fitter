import "./App.css";
import { Route, Routes, BrowserRouter, HashRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import GroupsPage from "./pages/GroupsPage";
import EventsPage from "./pages/EventsPage";
import GroupPage from "./pages/GroupPage";
import EventPage from "./pages/EventPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/groups",
      element: <GroupsPage />,
    },
    {
      path: "/groups/:id",
      element: <GroupPage />,
    },
    {
      path: "/events",
      element: <EventsPage />,
    },
    {
      path: "/events/:id",
      element: <EventPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
