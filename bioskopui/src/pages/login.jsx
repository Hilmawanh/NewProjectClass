import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { connect } from "react-redux";
import { LoginSuccessAction } from "./../redux/actions";
// import Loader from "react-loader-spinner";

class Login extends Component {
  state = {
    error: "",
    loading: false
  };

 

  onLoginClick = () => {
    var username = this.refs.username.value;
    var password = this.refs.password.value;
    this.setState({ loading: true });
    Axios.get(`${APIURL}users?username=${username}&password=${password}`)
      .then(res => {
        if (res.data.length) {
          window.location.reload();
          localStorage.setItem("user", res.data[0].id);
          this.props.LoginSuccessAction(res.data[0]); //ini buat masukin parameter di AuthAction, yg nantinya dipake di reducers
        } else {
          this.setState({ error: "salah pass" });
        }
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
    // window.location<Redirect to={"/"}/>
  };
  //   onClickRefresh=()=>{
  //     <Redirect to={"/"} />
  //  window.location.reload()
  // }

  render() {
    if (this.props.AuthLog) {
      return <Redirect to={"/"} />;
    }
    return (
      // <div>
      //   <div className="mt-3 d-flex justify-content-center">
      //     <div style={{ width: "500px", border: "1px solid black" }} className="rounded p-2">
      //       <h1>Login</h1>
      //       <div className="p-1" style={{ borderBottom: "1px solid black" }}>
      //         <input type="text" className="username" style={{ border: "transparent", width: "100%", fontSize: "20px" }} ref="username" placeholder="username" />
      //       </div>
      //       <div className="p-1" style={{ borderBottom: "1px solid black" }}>
      //         <input type="password" className="username" style={{ border: "transparent", width: "100%", fontSize: "20px" }} ref="password" placeholder="password" />
      //       </div>
      //       {this.state.error === "" ? null : (
      //         <div className="alert alert-danger mt-2">
      //           {this.state.error}
      //           <span onClick={() => this.setState({ error: "" })} className="float-right font-weight-bold">
      //             X
      //           </span>
      //         </div>
      //       )}
      //       <div className="mt-4">
      //         {this.state.loading ? (
      //           <Loader
      //             type="Ball Triangle"
      //             color="#00BFFF"
      //             height={100}
      //             width={100}
      //             timeout={3000} //3 secs
      //           />
      //         ) : (
      //           <button className="btn btn-primary" onClick={this.onLoginClick}>
      //             Login
      //           </button>
      //         )}
      //       </div>
      //       <div className="mt-2">
      //         belum ada akun?<Link to={'/register'}> Register</Link> dulu cuk
      //       </div>
      //     </div>
      //   </div>
      // </div>

      <div className="limiter m-b-60">
        <div className="container-login100">
          <div className="wrap-login100 p-t-50 p-b-90">
            <form className="login100-form validate-form flex-sb flex-w">
              <span className="login100-form-title p-b-51">Login</span>

              <div
                className="wrap-input100 validate-input m-b-16"
                // data-validate="Username is required"
              >
                <input
                  className="input100"
                  type="text"
                  name="username"
                  placeholder="Username"
                  ref="username"
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
                  ref="password"
                />
                <span className="focus-input100"></span>
              </div>

              <label class="txt1">
                Didn't have Account?{" "}
                <Link to={"/register"} style={{ fontSize: "20px" }}>
                  {" "}
                  Register{" "}
                </Link>{" "}
              </label>

              <div className="container-login100-form-btn">
                <button
                  class="login100-form-btn mt-2"
                  type="button"
                  onClick={this.onLoginClick}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const MapStateToProps = state => {
  return {
    AuthLog: state.Auth.login
  };
};

export default connect(MapStateToProps, { LoginSuccessAction })(Login);
