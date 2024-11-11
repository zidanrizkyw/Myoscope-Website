import SideBarAdmin from "../components/DashboardAdmin/SidebarAdmin";
import HomeListDoctor from "../components/ListDoctor/HomeListDoctor";
import "../style/dashboarddoctor.css";
import { useState } from "react";

function ListDoctor() {
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
            <HomeListDoctor Toggle={Toggle}/>
        </div>

      </div>
    </div>
  );
}

export default ListDoctor;
