import SideBarAdmin from "../components/DashboardAdmin/SidebarAdmin";
import HomeAddDoctor from "../components/AddDoctor/HomeAddDoctor";
import "../style/dashboarddoctor.css";
import { useState } from "react";

function AddDoctor() {
    const [toggle, setToggle] = useState(false)
    const Toggle = () => {
        setToggle(!toggle)
    }
  return (
    <div className="container-fluid bg-danger min-vh-100">
      <div className="row">
        { toggle && <div className="col-4 col-md-2 bg-white vh-100 position-fixed">
          <SideBarAdmin />
        </div>}
        { toggle && <div className="col-4 col-md-2"></div>}
        <div className="col">
            <HomeAddDoctor Toggle={Toggle}/>
        </div>

      </div>
    </div>
  );
}

export default AddDoctor;
