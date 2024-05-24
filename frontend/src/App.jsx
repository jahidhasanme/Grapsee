import { HashRouter, Routes, Route } from "react-router-dom"
import Auth from "./layouts/Auth"
import Main from "./layouts/Main"
import Login from "./pages/Login"
import CreateNewAccount from "./pages/CreateNewAccount"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Communities from "./pages/Communities"
import Messenger from "./pages/Messenger"
import Chating from "./pages/Chating"
import Notifications from "./pages/Notifications"
import Grapsee from "./pages/Grapsee"
import CreatePost from "./pages/CreatePost"
import Settings from "./pages/Settings"
import Abouts from "./pages/Abouts"
import PageNotFound from "./pages/PageNotFound"
import Videos from "./pages/Videos"
import { WebSocketProvider } from "./contexts/WebSocketContext"
import { AppContextProvider } from "./contexts/AppContext"
import Peoples from "./pages/Peoples"
import ChatingMobile from "./pages/ChatingMobile"

const App = () => {
  return (
    <WebSocketProvider>
      <AppContextProvider>
        <HashRouter>
          <Routes>
            <Route path="chating_mobile" element={<ChatingMobile />} />
            <Route path="/" element={<Auth />}>
              <Route path="login" element={<Login />} />
              <Route path="create_new_account" element={<CreateNewAccount />} />
            </Route>
            <Route path="/" element={<Main />}>
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="peoples" element={<Peoples />} />
              <Route path="videos" element={<Videos />} />
              <Route path="messenger" element={<Messenger />} />
              <Route path="chating" element={<Chating />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="grapsee" element={<Grapsee />} />
              <Route path="new_post" element={<CreatePost />} />
              <Route path="abouts" element={<Abouts />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </HashRouter>
      </AppContextProvider>
    </WebSocketProvider>
  )
}

export default App