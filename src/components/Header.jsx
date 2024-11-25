import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';  // Importing the menu and close icons
import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div id="menu" onClick={toggleMenu}>
        {isMenuOpen ? (
          <FaTimes size={30} />  // Display the close icon (FaTimes) when the menu is open
        ) : (
          <FaBars size={30} />  // Display the menu icon (FaBars) when the menu is closed
        )}
      </div>

      <nav className={`navbar ${isMenuOpen ? 'show' : ''}`}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
