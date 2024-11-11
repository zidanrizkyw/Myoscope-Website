import SideBar from "../components/DashboardDoctor/SideBar";
import Home from "../components/DashboardDoctor/Home";
import "../style/dashboarddoctor.css";
import { useState } from "react";

function DashboardDoctor() {
    const [toggle, setToggle] = useState(false)
    const Toggle = () => {
        setToggle(!toggle)
    }
  return (
    <div className="container-fluid bg-danger min-vh-100">
      <div className="row">
        { toggle && <div className="col-4 col-md-2 bg-white vh-100 position-fixed">
          <SideBar />
        </div>}
        { toggle && <div className="col-4 col-md-2"></div>}
        <div className="col">
            <Home Toggle={Toggle}/>
        </div>

      </div>
    </div>
  );
}

export default DashboardDoctor;
