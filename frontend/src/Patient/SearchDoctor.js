import React from "react";
import LeftsidePatient from "../Dashbaord/LeftsidePatient";
import Search from "../Doctor/Search";
import DashboardHeader from "../Dashbaord/components/DashboardHeader";

const SearchDoctor = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container-fluid flex-grow-1 p-0">
        <div className="row h-100 no-gutters">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-3 sticky-top vh-100">
            <LeftsidePatient />
          </div>
          <div className="col-md-9 col-lg-10 p-4 overflow-auto" style={{ height: '100vh' }}>
            {/* Header */}
            <DashboardHeader />
            
            <div className="glass-panel p-4">
              <h4 className="font-weight-bold mb-4 text-primary">Find a Specialist</h4>
              <Search />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDoctor;

