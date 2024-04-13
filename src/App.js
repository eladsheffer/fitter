import './App.css';
import { Route, Routes, BrowserRouter, HashRouter } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from './pages/Homepage';
import GroupsPage from './pages/GroupsPage';
import EventsPage from './pages/EventsPage';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      path: "/events",
      element: <EventsPage />,
    },
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;
