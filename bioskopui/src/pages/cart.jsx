import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { connect } from "react-redux";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Redirect } from "react-router-dom";
import { Notification } from "./../redux/actions";

class Cart extends Component {
  state = {
    datamovie: {},
    datacart: null,
    loading: true,
    AuthId: "",
    modaldetail: false,
    modalindex: "",
    modaldelete: false,
    datadelete: {},
    indexdetail: 0,
    modalcheckout: false,
    hargacheckout: 0
  };

  componentDidMount() {
    console.log(this.props.userId);
    Axios.get(
      `${APIURL}orders?_expand=movie&UserId=${this.props.userId}&bayar=false`
    ) //apiurl dari orders yg memiliki userId(...) ditambah movienya, dan yg bayarnya = false
      .then(res => {
        var datacart = res.data;
        var qtyArr = []; //berisi jumlah tiket per orderId
        res.data.forEach(element => {
          qtyArr.push(
            Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`)
          );
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
            <td>Belum ada pesanan</td>
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
            <td style={{ width: 100 }}>Rp.{val.totalharga}</td>
            <td style={{ width: 100 }}>
              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  this.setState({ modaldetail: true, indexdetail: index })
                }
              >
                Detail
              </button>
              <button
                className="mt-2 mb-2 btn btn-outline-danger"
                onClick={() =>
                  this.setState({ modaldelete: true, datadelete: val })
                }
              >
                Delete
              </button>
            </td>
          </tr>
        );
      });
    }
  };

  deletedatapesanan = () => {
    console.log(1);
    Axios.delete(`${APIURL}orders/${this.state.datadelete.id}`)
      .then(res => {
        console.log(2);
        Axios.delete(
          `${APIURL}ordersDetails?orderId=${this.state.datadelete.id}`
        )
          .then(res => {
            console.log(3);
          })
          .catch(err => {
            console.log(err);
          });
        this.componentDidMount();
        this.setState({ modaldelete: false, datadelete: {} });
      })
      .catch(err => {
        console.log(err);
      });
  };

  detailhead = () => {
    return (
      <div>
        Detail orderan no. {this.state.datacart[this.state.modalindex].id}{" "}
      </div>
    );
  };

  totalcheckout = () => {
    var pesanan = this.state.datacart;
    for (var i = 0; i < pesanan.length; i++) {
      this.state.hargacheckout += pesanan[i].totalharga;
    }

    return this.state.hargacheckout;
  };

  bayarcheckout = () => {
    var pesanan = this.state.datacart;
    var userId = this.props.userId;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var tanggal = dd + "/" + mm + "/" + yyyy;
    for (var i = 0; i < pesanan.length; i++) {
      var data = {
        userId,
        movieId: pesanan[i].movieId,
        jadwal: pesanan[i].jadwal,
        totalharga: pesanan[i].totalharga,
        bayar: true,
        tanggal,
        id: pesanan[i].id
      };
      var id = data.id;
      // console.log(data)
      Axios.put(`${APIURL}orders/${id}`, data)
        .then(res => {
          this.componentDidMount();
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.setState({ modalcheckout: false });
  };

  btnDetails = index => {
    console.log(this.state.datacart[index].id);
    var id = this.state.datacart[index].id;
    // console.log(this.state.datacart[index])
    Axios.get(`${APIURL}ordersDetails?orderId=${id}`).then(res => {
      var detailfilm = res.data;
      var seat = [];
      var row = [];
      detailfilm.map((val, index) => {
        seat.push(val.seat);
        row.push(val.row);
      });
      var alp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var posisi = [];
      for (var i = 0; i < seat.length; i++) {
        for (var j = 0; j < alp.length; j++) {
          if (row[i] === j) {
            posisi.push(String(alp[j]) + (seat[i] + 1));
          }
        }
      }
      this.setState({ detail: posisi });
      this.setState({ modaldetail: true });
    });
  };

  render() {
    if (this.props.Auth.role !== "user") {
      return <Redirect to={"/ganemu"} />;
    }
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
              <Table>
                <tbody>
                  <tr>
                    <th>No.</th>
                    <th>Bangku</th>
                    <th>Harga</th>
                  </tr>
                </tbody>
                <tbody>
                  {this.state.datacart !== null &&
                  this.state.datacart.length !== 0
                    ? this.state.datacart[this.state.indexdetail].qty.map(
                        (val, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {"abcdefghijklmnopqrstuvwxyz".toUpperCase()[
                                  val.row
                                ] + [val.seat + 1]}
                              </td>
                              <td style={{ width: 100 }}>
                                {this.setState.totalharga}
                              </td>
                            </tr>
                          );
                        }
                      )
                    : null}
                </tbody>
              </Table>
            </ModalBody>
          </Modal>

          <center>
            <Modal
              isOpen={this.state.modaldelete}
              toggle={() => this.setState({ modaldelete: false })}
              size="sm"
            >
              <ModalBody>Yakin nih mau hapus?</ModalBody>
              <ModalFooter>
                <button
                  className="mt-2 mb-2 btn btn-warning"
                  onClick={() =>
                    this.setState({ modaldelete: false, datadelete: {} })
                  }
                >
                  Tidak Jadi
                </button>
                <button
                  className="mt-2 mb-2 btn btn-primary"
                  onClick={this.deletedatapesanan}
                >
                  Yakin
                </button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={this.state.modalcheckout}
              toggle={() =>
                this.setState({ modalcheckout: false, hargacheckout: 0 })
              }
              size="l"
            >
              {this.state.modalcheckout ? (
                <ModalBody>
                  Total harga pesanan anda adalah : Rp. {this.totalcheckout()}
                </ModalBody>
              ) : null}

              <ModalFooter>
                <button
                  className="mt-2 mb-2 btn btn-primary"
                  onClick={this.bayarcheckout}
                >
                  Bayar
                </button>
              </ModalFooter>
            </Modal>
            <Table className="table" style={{ width: 1100 }}>
              <thead className="thead-light">
                <tr>
                  <th scope="col" style={{ width: 100 }}>
                    No.
                  </th>
                  <th scope="col" style={{ width: 300 }}>
                    Title
                  </th>
                  <th scope="col" style={{ width: 100 }}>
                    Jadwal
                  </th>
                  <th scope="col" style={{ width: 100 }}>
                    {" "}
                    quantity
                  </th>
                  <th scope="col" style={{ width: 100 }}>
                    Harga
                  </th>
                  <th scope="col" style={{ width: 100 }}>
                    {" "}
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
              <tfoot>
                <button
                  className="mt-2 mb-2 btn btn-success"
                  onClick={() => this.setState({ modalcheckout: true })}
                >
                  Checkout
                </button>
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
    userId: state.Auth.id,
    Auth: state.Auth
  };
};

export default connect(MapStateToProps, { Notification })(Cart);
