import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { LogoutSuccessAction } from "./../redux/actions";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Badge from "@material-ui/core/Badge";
// import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import { FaUserCircle } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";

const LogoutSuccess = () => {
  localStorage.clear();
  LogoutSuccessAction();
};

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand
          href="/"
          style={{ fontWeight: "bold", fontSize: 22, color: "#41aaa8" }}
        >
          Book Your Ticket &nbsp;
          <MdEventSeat style={{ fontSize: 28 }} />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {/* ========= kalo belom login== */}
            {props.namauser === "" ? (
              <NavItem>
                <Link
                  to={"/login"}
                  style={{ color: "white" }}
                  className="nav-link btn btn-info"
                >
                  Login
                </Link>
              </NavItem>
            ) : null}
            {/* ============= nama user/admin === */}
            {props.namauser === "" ? null : (
              <NavItem className='mt-4 mr-10"' style={{ color: "#41aaa8" }}>
                <FaUserCircle style={{ fontSize: 22 }} />
                {props.namauser}
              </NavItem>
            )}
            &nbsp;&nbsp;
            {/* ========= kalo masuk role admin keluar manageadmin== */}
            {props.role === "admin" ? (
              <NavItem className="manageadmin mt-3 mr-2">
                <Link
                  to={"/manageadmin"}
                  style={{ color: "#41aaa8", fontSize: 20 }}
                >
                  Manage Admin &nbsp;
                </Link>
                <Link
                  to={"/managestudio"}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "50px"
                  }}
                >
                  <span>Manage Studios</span>
                </Link>
              </NavItem>
            ) : null}
            {/* ========= kalo masuk role user keluar shoppingcart == */}
            {props.role === "user" ? (
              <NavItem className="mr-3 mt-4">
                <Link to={"/cart"}>
                  <Badge badgeContent={props.notif} color="secondary">
                    <FaShoppingCart
                      style={{ color: "#41aaa8", fontSize: 25 }}
                    />
                  </Badge>
                </Link>
              </NavItem>
            ) : null}
            &nbsp;
            {props.role === "user" ? (
              <NavItem
                className="mr-3 mt-3"
                style={{ fontWeight: "bold", fontSize: 22, color: "#41aaa8" }}
              >
                <Link to="/resetpass"> Change Password </Link>
              </NavItem>
            ) : null}
            {/* ========= kalo udah login== */}
            {props.namauser === "" ? null : (
              <NavItem>
                <NavLink
                  href="/"
                  onClick={() => LogoutSuccess()}
                  className="nav-link btn btn-info mt-3"
                >
                  Logout
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

const MapStateToProps = state => {
  return {
    namauser: state.Auth.username,
    role: state.Auth.role,
    login: state.Auth.login,
    notif: state.NotifReducer
  };
};

export default connect(MapStateToProps, { LogoutSuccessAction })(Header);
