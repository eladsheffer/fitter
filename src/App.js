import "./App.css";
import { Route, Routes, BrowserRouter, HashRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import GroupsPage from "./pages/GroupsPage";
import EventsPage from "./pages/EventsPage";
import GroupPage from "./pages/GroupPage";
import EventPage from "./pages/EventPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef, createContext } from "react";

export const AppContext = createContext({});

function App() {
  const [group, setGroup] = useState(null);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/groups",
      element: <AppContext.Provider value={{setGroup}}><GroupsPage />
      </AppContext.Provider>,
    },
    {
      path: "/groups/:id",
      element: <AppContext.Provider value={{group}}>
        <GroupPage />
      </AppContext.Provider>,
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
