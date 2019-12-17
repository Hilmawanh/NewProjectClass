import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { connect } from "react-redux";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Notification } from "./../redux/actions";

class Cart extends Component {
  state = {
    datacart: null,
    modaldetail: false,
    indexdetail: 0
  };

  componentDidMount() {
    console.log(this.props.userId);
    Axios.get(`${APIURL}orders?_expand=movie&UserId=${this.props.userId}&bayar=false`) //apiurl dari orders yg memiliki userId(...) ditambah movienya, dan yg bayarnya = false
      .then(res => {
        var datacart = res.data;
        var qtyArr = []; //berisi jumlah tiket per orderId
        res.data.forEach(element => {
          qtyArr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`));
        });
        var qtyArrFinal = [];
        Axios.all(qtyArr)
          .then(res1 => {
            res1.forEach(val => {
              qtyArrFinal.push(val.data);
            });
            // console.log(qtyArrFinal)
            var datafinal = [];
            datacart.forEach((val, index) => {
              datafinal.push({ ...val, qty: qtyArrFinal[index] });
            });
            console.log(datafinal);
            this.setState({ datacart: datafinal });
            // this.props.Notification(datafinal.length)
          })
          .catch(err => {});
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderCart = () => {
    if (this.state.datacart !== null) {
      // this.props.Notification(this.state.datacart.length);
      if (this.state.datacart.length === 0) {
        return (
          <tr>
            <td>Belum ada pesanan di Cart</td>
          </tr>
        );
      }

      return this.state.datacart.map((val, index) => {
        return (
          <tr key={index} scope="row">
            <td style={{ width: 100 }}>{index + 1}</td>
            <td style={{ width: 300 }}>{val.movie.title}</td>
            <td style={{ width: 100 }}>{val.jadwal}</td>
            <td style={{ width: 100 }}>{val.qty.length}</td>
            <td style={{ width: 100 }}>
              <button  className="btn btn-outline-primary" onClick={()=>this.setState({modaldetail:true,indexdetail:index})}>Detail</button>
            </td>
          </tr>
        );
      });
    }
  };

  render() {
    console.log("datacart", this.state.datacart);
    if (this.props.userId) {
      return (
        <div>
          <Modal
            isOpen={this.state.modaldetail}
            toggle={() => {
              this.setState({ modaldetail: false });
            }}
          >
            <ModalHeader>Details</ModalHeader>
            <ModalBody>
              <Table >
                <tbody>
                  <tr>
                    <th>No.</th>
                    <th>Bangku</th>
                  </tr>
                </tbody>
                <tbody>
                  {this.state.datacart !== null && this.state.datacart.length !== 0
                    ? this.state.datacart[this.state.indexdetail].qty.map((val, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{"abcdefghijklmnopqrstuvwxyz".toUpperCase()[val.row] + [val.seat + 1]}</td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </Table>
            </ModalBody>
          </Modal>
          <center>
            <Table className='table' style={{ width: 1100 }}>
              <thead className='thead-light'>
                <tr>
                  <th scope="col" style={{ width: 100 }}>No.</th>
                  <th scope="col" style={{ width: 300 }}>Title</th>
                  <th scope="col" style={{ width: 100 }}>Jadwal</th>
                  <th scope="col" style={{ width: 100 }}> quantity</th>
                  <th scope="col" style={{ width: 100 }}>Detail</th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
              <tfoot  >
                <button className="btn btn-success">Checkout</button>
              </tfoot>
            </Table>
          </center>
        </div>
      );
    }
    return <div>404 not found</div>;
  }
}

const MapStateToProps = state => {
  return {
    AuthLog: state.Auth.login,
    userId: state.Auth.id
  };
};

export default connect(MapStateToProps, { Notification })(Cart);
