import React, { useState, useEffect } from "react";
import icons from "../../contents/Icons";
import { SiBuildkite } from "react-icons/si";
import './TopBar.css'
import logo from '../../assets/img/logo.png'
import { RemoveUserLocalStorage } from "../../utils/utils";
import { useNavigate } from "react-router";
export default function TopBar() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    // Check for saved dark mode preference on mount
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode);
    }
  }, []);

  useEffect(() => {
    // Apply or remove dark mode class on the body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Theme menu handler
  const handleThemeChange = (color) => {
    document.documentElement.style.setProperty("--primary-color", color);
    localStorage.setItem("primaryColor", color);
    setIsThemeMenuOpen(false);
  };

  useEffect(() => {
    // Check for saved primary color preference on mount
    const savedColor = localStorage.getItem("primaryColor");
    if (savedColor) {
      document.documentElement.style.setProperty("--primary-color", savedColor);
    }
  }, []);

  const handleMenuClick = (menu) => {
    setIsNotificationsMenuOpen(menu === 'notifications' ? !isNotificationsMenuOpen : false);
    setIsProfileMenuOpen(menu === 'profile' ? !isProfileMenuOpen : false);
    setIsThemeMenuOpen(menu === 'theme' ? !isThemeMenuOpen : false);
  };

  return (
    <header className="z-40 py-4 shadow-bottom dark:bg-gray-800">
      <div className="container-fluid flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        <div className="inline-flex items-center">
          {/* <img src={logo} alt="proz erp logo" width="30px"/>
          <h1 className="font-medium text-2xl ml-2">ProZ ERP</h1> */}
          {/* <SiBuildkite className={`text-primary-500 text-4xl rounded cursor-pointer`} /> */}
        </div>
        {/* Search input */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {icons.searchIcon}
            </span>
            <input className="pl-10 pr-4 py-1 rounded-full" type="text" placeholder="Search..." />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li className="flex">
            <button
              className="rounded-md "
              onClick={toggleDarkMode}
              aria-label="Toggle color mode"
            >
              {isDarkMode ? (
                <span className="w-5 h-5 text-xl moon" aria-hidden="true">{icons.moon}</span>
              ) : (
                <span className="w-5 h-5 text-xl sun" aria-hidden="true">{icons.sun}</span>
              )}
            </button>
          </li>

          {/* Theme switcher dropdown */}
          <li className="relative">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={() => handleMenuClick('theme')}
              aria-label="Theme Switcher"
              aria-haspopup="true"
            >
              <span className="w-5 h-5 text-xl" aria-hidden="true">{icons.palette}</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 w-48 p-2 mt-2 rounded-lg shadow-md darkCardBg">
                <div className="py-2">
                  {/* Color options */}
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleThemeChange("#4CAF50")} 
                  >
                    <span className="inline-block w-4 h-4 mr-2" style={{ backgroundColor: "#4CAF50" }}></span>
                    Green Color
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleThemeChange("#7b57e0")} // Dark Color
                  >
                    <span className="inline-block w-4 h-4 mr-2" style={{ backgroundColor: "#7b57e0", color: "#fff" }}></span>
                    Dark Color
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleThemeChange("#3b82f6")} 
                  >
                    <span className="inline-block w-4 h-4 mr-2" style={{ backgroundColor: "#3b82f6" }}></span>
                    Base Color
                  </button>
                  
                </div>
              </div>
            )}
          </li>

          {/* Notifications menu */}
          <li className="relative">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={() => handleMenuClick('notifications')}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <span className="w-5 h-5 text-xl" aria-hidden="true">{icons.bell}</span>
            </button>
            {isNotificationsMenuOpen && (
              <div className="absolute right-0 w-48 p-2 mt-2 darkCardBg rounded-lg shadow-md dark:bg-gray-800">
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                    New Notification
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                    Another Notification
                  </a>
                </div>
              </div>
            )}
          </li>

          {/* Profile menu */}
          <li className="relative">
            <button
              className="button rounded-full h-8 w-8 flex items-center justify-center text-white-500"
              onClick={() => handleMenuClick('profile')}
              aria-label="Account"
              aria-haspopup="true"
            >
              A
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 w-48 p-2 mt-2 darkCardBg rounded-lg shadow-md dark:bg-gray-800">
                <div className="py-2">
                  <a href="#" className="flex items-center px-4 py-2 text-m hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span className="me-3">{icons.settingIcon}</span> Settings
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-m hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span className="me-3">{icons.profileIcon}</span> Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-m hover:bg-gray-100 dark:hover:bg-gray-600" onClick={()=>{RemoveUserLocalStorage(); navigate('/')}}>
                    <span className="me-3">{icons.logoutIcon}</span> Logout
                  </a>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
