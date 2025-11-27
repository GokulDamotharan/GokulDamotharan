import React, { useState, useEffect, useMemo } from "react";
import Axios from "axios";
import Trie from "./Trie.js";
import specialization from "./specialization";
import { Link } from "react-router-dom";
import { Search as SearchIcon, User, Phone, DollarSign, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const memoized_trie = useMemo(() => {
    const trie = new Trie();
    for (let i = 0; i < specialization.length; i++) {
      trie.insert(specialization[i]);
    }
    return trie;
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/doctors/`);
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  function onTextChanged(e) {
    let value = e.target.value;
    setText(value);
    value = value.toLowerCase();
    if (value !== "") setSuggestions(memoized_trie.find(value));
    else setSuggestions([]);

    // Real-time filtering if empty
    if (value === "") setFilteredDoctors(doctors);
  }

  function suggestionSelected(value) {
    setText(value);
    setSuggestions([]);
    UpdateDisplay(value);
  }

  const UpdateDisplay = (searchText) => {
    if (!searchText) {
      setFilteredDoctors(doctors);
      return;
    }
    const filtered = doctors.filter(
      (doctor) => doctor.specialization.toLowerCase() === searchText.toLowerCase()
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="position-relative mb-4 z-index-10">
        <div className="input-group glass-panel p-2">
          <div className="input-group-prepend">
            <span className="input-group-text bg-transparent border-0">
              <SearchIcon className="text-primary" size={20} />
            </span>
          </div>
          <input
            type="text"
            className="form-control bg-transparent border-0"
            placeholder="Search by specialization (e.g., Cardiologist)"
            value={text}
            onChange={onTextChanged}
            style={{ boxShadow: 'none' }}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary-gradient px-4"
              onClick={() => UpdateDisplay(text)}
            >
              Search
            </button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="list-group position-absolute w-100 shadow-lg mt-2 rounded-lg overflow-hidden"
            style={{ zIndex: 1000, top: '100%' }}
          >
            {suggestions.map((item) => (
              <li
                className="list-group-item list-group-item-action cursor-pointer border-0"
                onClick={() => suggestionSelected(item)}
                key={item}
                style={{ cursor: 'pointer' }}
              >
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      <div className="flex-grow-1 overflow-auto pr-2 custom-scrollbar">
        <div className="row">
          <AnimatePresence>
            {filteredDoctors.map((doc, index) => (
              <motion.div
                key={doc._id}
                className="col-lg-6 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="glass-panel p-4 h-100 d-flex flex-column hover-lift transition-all">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-3 mr-3">
                      <User className="text-primary" size={24} />
                    </div>
                    <div>
                      <h5 className="font-weight-bold mb-0 text-primary text-uppercase">{doc.name}</h5>
                      <span className="badge badge-pill badge-primary bg-primary-gradient border-0 px-3 py-1 mt-1">
                        {doc.specialization}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 flex-grow-1">
                    <div className="d-flex align-items-center mb-2 text-secondary">
                      <Phone size={16} className="mr-2" />
                      <span>{doc.phoneNumber}</span>
                    </div>
                    <div className="d-flex align-items-center text-secondary">
                      <DollarSign size={16} className="mr-2" />
                      <span>Fees: ₹{doc.feesPerSession} / Session</span>
                    </div>
                  </div>

                  <Link
                    to={{ pathname: "/patient/selectdate", doctor: { doctor: doc } }}
                    className="btn btn-outline-primary rounded-pill w-100 d-flex align-items-center justify-content-center group-hover-text-white"
                  >
                    Book Appointment <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDoctors.length === 0 && (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No doctors found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
