import React, { Component } from "react";
// import { Button, Form } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
// import Slide from "react-reveal/Slide";
import Axios from "axios";
import { APIURL } from '../support/ApiUrl'
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { ResetpassAction } from '../redux/actions'

class Resetpass extends Component {
  state = {
    keHome: false
  };

  handleChangePassClick = () => {
    var oldPass = this.refs.oldpass.value;
    var newPass = this.refs.newpass.value;
    var password = this.refs.confpass.value;
    var updatePass = {
      password,
      username: this.props.usernamelog,
      role: this.props.role
    };
    console.log(updatePass);
    if (oldPass === "" || newPass === "" || password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Gaboleh Kosong!"
      });
    } else if (oldPass === newPass) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Baru tidak boleh sama dgn password lama"
      });
    } else if (oldPass !== this.props.passuser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password yang anda masukkan salah"
      });
    } else if (newPass !== password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "New Password dan konfirmasi password harus sama"
      });
    } else {
      Axios.put(`${APIURL}users/${this.props.userid}`, updatePass)
        .then(res => {
          // console.log(res.data);
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes"
          }).then(result => {
            if (result.value) {
              this.props.ResetpassAction(res.data);
              this.setState({ keHome: true });
              Swal.fire({
                icon: "success",
                title: "Your password has been Updated!",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.keHome || this.props.userlog === false) {
      return <Redirect to="/" />;
    }
    return (
      <div className="limiter m-b-60">
        <div className="container-login100">
          <div className="wrap-login100 p-t-50 p-b-90">
            <form className="login100-form validate-form flex-sb flex-w">
              <span className="login100-form-title p-b-51">Reset Password</span>

              <div
                className="wrap-input100 validate-input m-b-16"
                // data-validate="Username is required"
              >
                <input
                  className="input100"
                  type="text"
                  name="username"
                  placeholder="Username"
                  defaultValue={this.props.usernamelog}
                  ref="user"
                />
                <span className="focus-input100"></span>
              </div>

              <div
                className="wrap-input100 validate-input m-b-16"
                // data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  // name="pass"
                  placeholder="Password"
                  ref="oldpass"
                />
                <span className="focus-input100"></span>
              </div>

              <div
                className="wrap-input100 validate-input m-b-16"
                // data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  // name="pass"
                  placeholder="Confirm Password"
                  ref="newpass"
                />
                <span className="focus-input100"></span>
              </div>

              <div
                className="wrap-input100 validate-input m-b-16"
                // data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  // name="pass"
                  placeholder="Confirm Password"
                  ref="confpass"
                />
                <span className="focus-input100"></span>
              </div>

              <div className="container-login100-form-btn">
                <button
                  class="login100-form-btn mt-2"
                  type="button"
                  onClick={this.handleChangePassClick}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    usernamelog: state.Auth.username,
    userlog: state.Auth.login,
    userid: state.Auth.id,
    passuser: state.Auth.password,
    role: state.Auth.role
  };
};

export default connect(MapstateToprops, { ResetpassAction })(Resetpass);
