import React, { Component } from 'react';
import {Link,Redirect} from 'react-router-dom'
import Axios from 'axios'
import { APIURL } from "../support/ApiUrl";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2'


class Register extends Component {
    state = { 
        error:'',
        loading: false,
        register:false
     }

    onRegisterClick=()=>{
        var username = this.refs.username.value
        var password = this.refs.password.value
        var confpass=this.refs.confpass.value
        var role="user"
        var dataregister={
            username,password,role
        }
        Axios.get(`${APIURL}users?username=${username}`)
        .then(res=>{
          if(res.data.length===0){
            if (password!==confpass ) {
              this.setState({error:'Password tidak sesuai'})
            }else{
              Axios.post(`${APIURL}users`,dataregister)
              .then(()=>{
                this.setState({register:true})
                this.setState({loading:true})
                Swal.fire({
                  icon: 'success',
                  title: 'Register Success', 
                })
              }).catch((err)=>{
                console.log(err)
              })
              }
            }else{
                this.setState({error:'Username sudah terdaftar'})
            }
        }).catch(err=>{
          console.log(err)
        })
    }

    render() { 
      if(this.state.register){
        return  <Redirect to={'/login'}/>
      }
        return ( 
      //       <div>
      //   <div className="mt-3 d-flex justify-content-center">
      //     <div style={{ width: "500px", border: "1px solid black" }} className="rounded p-2">
      //       <h1>Register</h1>
      //       <div className="p-1" style={{ borderBottom: "1px solid black" }}>
      //         <input type="text" className="username" style={{ border: "transparent", width: "100%", fontSize: "20px" }} ref="username" placeholder="Username" />
      //       </div>
      //       <div className="p-1" style={{ borderBottom: "1px solid black" }}>
      //         <input type="password" className="username" style={{ border: "transparent", width: "100%", fontSize: "20px" }} ref="confpass" placeholder="Confirm Passord" />
      //       </div>
      //       <div className="p-1" style={{ borderBottom: "1px solid black" }}>
      //         <input type="password" className="username" style={{ border: "transparent", width: "100%", fontSize: "20px" }} ref="password" placeholder="Password" />
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
      //         <button className="btn btn-primary" onClick={this.onRegisterClick}>
      //             Register
      //           </button>
      //       </div>
      //       <div className="mt-2">
      //         sudah punya akun kembali ke<Link to={'/login'}> Login</Link> 
      //       </div>
      //     </div>
      //   </div>
      // </div>

      <div className="limiter m-b-60">
      <div className="container-login100">
        <div className="wrap-login100 p-t-50 p-b-90">
          <form className="login100-form validate-form flex-sb flex-w">
            <span className="login100-form-title p-b-51">Register</span>

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
                onClick={this.onRegisterClick}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
         );
    }
}
 
export default Register;
