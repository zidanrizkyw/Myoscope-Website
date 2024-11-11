import SideBar from "../components/DashboardDoctor/SideBar";
import "../style/dashboarddoctor.css";
import Homepatient from "../components/DashboardPatient/Homepatient";
import { useState } from "react";

function DashboardPatient(){
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
            <Homepatient Toggle={Toggle}/>
        </div>

      </div>
    </div>
  );

}

export default DashboardPatient;