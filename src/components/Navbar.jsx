import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <a href="/">
        <img src={Logo} alt="logo" />
      </a>

      <ul>
        <li>
          <a href="/">HOME</a>
        </li>

        <li>
          <a href="/notes">NOTES</a>
        </li>
        <li>
          <a href="/about">ABOUT</a>
        </li>
        <li>
          <a href="/contact">CONTACT</a>
        </li>
      </ul>

      <div className="navbar_right">
        {user ? (
          <a href="/create-listing" className="host">
            Become A Host
          </a>
        ) : (
          <a href="/login" className="host">
            Become A Host
          </a>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={user.profileImagePath}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Home
            </Link>
            <Link to="/notes" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Notes
            </Link>
            <Link to="/about" onClick={() => setDropdownMenu(!dropdownMenu)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Contact
            </Link>
            <Link to="/login" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Sign Up
            </Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link
              to="/create-listing"
              nClick={() => setDropdownMenu(!dropdownMenu)}
            >
              Become A Host
            </Link>
            <Link to="/" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Home
            </Link>
            <Link to="/notes" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Notes
            </Link>
            <Link to="/about" onClick={() => setDropdownMenu(!dropdownMenu)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setDropdownMenu(!dropdownMenu)}>
              Contact
            </Link>
            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
