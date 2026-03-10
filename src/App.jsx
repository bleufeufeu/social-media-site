import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Loading from "./components/Loading/Loading";

function App() {  
  const { loggedIn, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  return (
    <div className={`${loggedIn ? 'grid grid-cols-[1fr_4fr_1fr]' : ''}`}>
        {loggedIn && <Sidebar />}
        <div className="">
            <Outlet />
        </div>
    </div>
  );
}

export default App;