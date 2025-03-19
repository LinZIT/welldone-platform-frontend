import { Theme, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { themeLight, themeDark } from "./common/theme";
import { Profile } from "./pages/profile/Profile";
import { CreateNewTicket } from "./pages/tickets/CreateNewTicket";
import { Tickets } from "./pages/tickets/Tickets";
import { TicketView } from "./pages/tickets/TicketView";
import { useUserStore } from "./store/user/UserStore";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";

const useGetTheme = () => {
  const user = useUserStore((state) => state.user);
  const [theme, setTheme] = useState<Theme>(themeLight)
  useEffect(() => {
    if (user?.theme === 'dark') {
      setTheme(themeDark);
    } else {
      setTheme(themeLight);
    }
  }, [user?.theme])
  return theme
}
function App() {
  const theme = useGetTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/tickets' element={<Tickets />} />
          <Route path='/ticket/new' element={<CreateNewTicket />} />
          <Route path='/ticket/:id' element={<TicketView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
