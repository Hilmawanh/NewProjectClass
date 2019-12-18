import React, { Component } from "react";
import "./App.css";
import Header from "./components/header";
import Home from "./pages/home";
import { Switch, Route } from "react-router-dom";
import ManageAdmin from "./pages/manageadmin";
import ManageStudio from './pages/managestudio'
import Moviedetail from "./pages/movie-detail";
import Login from "./pages/login";
import { connect } from "react-redux";
import { LoginSuccessAction } from "./redux/actions";
import Axios from "axios";
import { APIURL } from "./support/ApiUrl";
import Belitiket from "./pages/belitiket";
import Register from "./pages/register";
import Cart from "./pages/cart";
import { Notification } from "./redux/actions";
// import SimpleSlider from "./components/carousel";
import Footer from "./components/footer";
import Ganemu from "./pages/ganemu";
import Resetpass from "./pages/resetPass";
import Carouselhome from './components/carousel'

class App extends Component {
  state = {
    loading: true,
    datacart: []
  };

  componentDidMount() {
    var id = localStorage.getItem("user");
    console.log("id", id);
    Axios.get(`${APIURL}users/${id}`)
      //ini maksud id nya tug gimana?
      .then(res => {
        this.props.LoginSuccessAction(res.data);
        Axios.get(
          `${APIURL}orders?_expand=movie&UserId=${this.props.userId}&bayar=false`
        )
          .then(res1 => {
            var datacart = res1.data;
            console.log(res1);
            this.setState({
              datacart: datacart,
              loading: false
            });
          })
          .catch(err1 => {
            console.log(err1);
          });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    {
      this.props.Notification(this.state.datacart.length);
    }
    console.log(this.props.Notification);
    return (
      <div>
        <Header />
        <Switch>
          <Route path={"/"} exact>
            <Carouselhome/>
            <Home />
          </Route>
          <Route exact path={"/manageadmin"} component={ManageAdmin} />
          <Route exact path={"/managestudio"} component={ManageStudio} />
          <Route exact path={"/moviedetail/:id"} component={Moviedetail} />
          <Route exact path={"/belitiket"} component={Belitiket} />
          <Route exact path={"/login"} component={Login} />
          <Route exact path={"/register"} component={Register} />
          <Route exact path={"/cart"} component={Cart} />
          <Route exact path={"/resetpass"} component={Resetpass} />
          <Route exact path="/*" component={Ganemu} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const MapStateToProps = state => {
  return {
    AuthLog: state.Auth.login,
    userId: state.Auth.id
  };
};

export default connect(MapStateToProps, { LoginSuccessAction, Notification })(
  App
);

