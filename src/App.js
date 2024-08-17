import "./App.css";
import { Route, Routes, BrowserRouter, HashRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import GroupsPage from "./pages/GroupsPage";
import EventsPage from "./pages/EventsPage";
import GroupPage from "./pages/GroupPage";
import EventPage from "./pages/EventPage";
import LoginPage from './pages/LoginPage';
import SignupPage from "./pages/SignupPage";
import FitterNavbar from "./components/FitterNavbar";
import NewGroupPage from "./pages/NewGroupPage";
import NewEventPage from "./pages/NewEventPage";
import SearchPage from "./pages/SearchPage";
import "bootstrap/dist/css/bootstrap.min.css";
import UserPage from "./pages/UserPage";
import EditProfilePage from "./pages/EditProfilePage";
import EditGroupPage from "./pages/EditGroupPage";
import EditEventPage from "./pages/EditEventPage";

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Homepage />,
  //   },
  //   {
  //     path: "/groups",
  //     element: <GroupsPage />
  //   },
  //   {
  //     path: "/groups/:id",
  //     element:
  //       <GroupPage />,
  //   },
  //   {
  //     path: "/events",
  //     element: <EventsPage />,
  //   },
  //   {
  //     path: "/events/:id",
  //     element: <EventPage />,
  //   },
  //   {
  //     path: "/login",
  //     element:
  //       <LoginPage />
  //   },
  //   {
  //     path: "/signup",
  //     element:
  //       <SignupPage />,
  //   }
  // ]);
  return <div>

    <BrowserRouter>
      <FitterNavbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/new-group" element={<NewGroupPage />} />
        <Route path="/new-event/:groupId" element={<NewEventPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/edit-group/:id/" element={<EditGroupPage />} />
        <Route path="/edit-event/:id/" element={<EditEventPage />} />
      </Routes>
    </BrowserRouter>
  </div>;
}

export default App;
