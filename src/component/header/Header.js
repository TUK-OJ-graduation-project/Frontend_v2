import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { links, social } from "./data";
import logo from "./signature.png";
import "./header.css";
import { Link } from "react-router-dom";

const Headerbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const [showSocial, setShowSocial] = useState(null);
  const [showProblemList, setShowProblemList] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false); 

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const handleProblemClick = () => {
    setShowProblemList(!showProblemList);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = "0px";
    }
  }, [showLinks]);

  return (
    <nav>
      <div className="nav-center">
        <div className="nav-header">
          <Link to="/">
            <img src={logo} className="logo" alt="logo" />
          </Link>
          <button className="nav-toggle" onClick={toggleLinks}>
            <FaBars />
          </button>
        </div>
        <div
          className="links-container"
          ref={linksContainerRef}
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave} 
        >
          <ul className="links" ref={linksRef}>
            {links.map((link) => {
              const { id, url, text } = link;
              return (
                <li key={id}>
                  {id === 3 ? (
                    <div
                      className="problem-dropdown"
                      onMouseEnter={handleProblemClick}
                      onMouseLeave={handleProblemClick}
                    >
                      <a 
                        href={url} 
                        className="problem-link" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleProblemClick();
                        }}
                      >
                        {text}
                      </a>
                      {showProblemList &&
                        isHovering && (
                          <ul className="problem-list">
                            <li>
                              <Link to="/codeproblemlist" className="list-text">
                                Code
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/selectproblemlist"
                                className="list-text"
                              >
                                Select
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/blankproblemlist"
                                className="list-text"
                              >
                                Blank
                              </Link>
                            </li>
                          </ul>
                        )}
                    </div>
                  ) : (
                    <Link to={url}>{text}</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <ul className="social-icons">
          {social.map((socialIcon) => {
            const { id, url, icon, text } = socialIcon;
            return (
              <li key={id}>
                <a
                  href={url}
                  onClick={() =>
                    setShowSocial((prevShowSocial) =>
                      prevShowSocial === id ? null : id
                    )
                  }
                >
                  {icon}
                  {showSocial && (
                    <ul className="social-list">
                      <li className="vertical-buttons">
                        <button>{text}</button>
                      </li>
                    </ul>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Headerbar;
