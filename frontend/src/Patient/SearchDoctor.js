import React from "react";
import Navbar from "../Basic/Navbar";
import LeftsidePatient from "../Dashbaord/LeftsidePatient";
import Search from "../Doctor/Search";
import { motion } from "framer-motion";

const SearchDoctor = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-0">
            <LeftsidePatient />
          </div>
          <div className="col-md-9 col-lg-10 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-4 h-100"
            >
              <h4 className="font-weight-bold mb-4 text-primary">Find a Specialist</h4>
              <Search />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDoctor;
