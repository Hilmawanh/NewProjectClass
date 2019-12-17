import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Fade from "react-reveal";

class Moviedetail extends Component {
  state = {
    datadetailfilm: {},
    traileropen: false,
    notloginyet: false,
    kelogin: false,
    belitiketok: false,
    ProteksiAdmin: false
  };

  componentDidMount() {
    console.log("role", this.props.roleadmin);
    console.log("movie detail", this.props);
    // console.log(this.props.match.params.id);
    Axios.get(`${APIURL}movies/${this.props.match.params.id}`) // ini isinya = http://localhost:2000/movies/1, dan link ini isinya berupa object informasi dari film yg di pilih
      .then(res => {
        this.setState({ datadetailfilm: res.data }); // datadetailfilm diisi dengan object film yg dipilih
      })
      .catch(err => {
        console.log(err);
      });
  }

  onBeliTicketClick = () => {
    if (this.props.roleadmin === "admin") {
      this.setState({ ProteksiAdmin: true, belitiketok: false });
    } else if (this.props.AuthLog && this.props.roleadmin === "user") {
      this.setState({ belitiketok: true });
    } else {
      this.setState({ notloginyet: true });
    }
  };

  render() {
    // console.log(this.props.match.params); //ini object id
    // console.log(this.props.match.params.id)//ini buat dapeting angka id nya
    // console.log("ini render");

    if (this.state.kelogin) {
      return <Redirect to={"/login"} />;
    }

    if (this.state.belitiketok) {
      return <Redirect to={{ pathname: "/belitiket", state: this.state.datadetailfilm }} />; // ini nge redirect dan juga membawa data this.state.datadetailfilm(object dari film yg di klik)
    }
    return (
      <div>
        {/* =========== modal trailer==== */}
        <Modal isOpen={this.state.traileropen} size="lg" toggle={() => this.setState({ traileropen: false })} contentClassName="trailer">
          <ModalBody className="p-0 bg-transparent trailer">
            <iframe
              width="100%"
              height="100%"
              title={this.state.datadetailfilm.title}
              src={this.state.datadetailfilm.trailer}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </ModalBody>
        </Modal>
        {/* ========== modal kalo belom login ==== */}
        <Modal isOpen={this.state.notloginyet} toggle={() => this.setState({ notloginyet: false })}>
          <ModalBody>Antum belum login</ModalBody>
          <ModalFooter>
            <button className="btn btn-warning">
              <Link to={"/login"}>Login</Link>
            </button>
          </ModalFooter>
        </Modal>
        {/* ============= modal proteksi admin ==== */}
        <Fade>
          <Alert className='alert alert-danger' isOpen={this.state.ProteksiAdmin} toggle={() => this.setState({ ProteksiAdmin: false })}>
            beli tiket hanya untuk user
            {/* <button className="btn btn-success" onClick={() => this.setState({ ProteksiAdmin: false })}>
            {" "}
            Ok
          </button> */}
          </Alert>
        </Fade>

        <div className="row p-3 mx-3 my-4 movie-detail">
          <div className="mr-5">
            <div className="mt-3" style={{ fontSize: "30px" }}>
              {this.state.datadetailfilm.title}
            </div>
            <img src={this.state.datadetailfilm.image} height="max-content" alt="film" />
          </div>
          <div className="pt-5 mr-5">
            <div className="mt-1"  style={{fontWeight:'bold'}}>
              Title <span>:</span>
            </div>
            <div className="mt-1" style={{fontWeight:'bold'}}>
              Sionpsis <span>:</span>
            </div>
          </div>

          <div className="pt-5 sinopsis">
            <div className="mt-1">{this.state.datadetailfilm.title}</div>
            <div className="mt-1">{this.state.datadetailfilm.sinopsis}</div>
            <div className="mt-3">
              <button className="mr-3 btn btn-primary" onClick={this.onBeliTicketClick}>
                Beli tiket
              </button>
              <button className="mr-3 btn btn-warning" onClick={() => this.setState({ traileropen: true })}>
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const MapStateToProps = state => {
  return {
    AuthLog: state.Auth.login,
    roleadmin: state.Auth.role
  };
};

export default connect(MapStateToProps)(Moviedetail);
