import React, { Component } from "react";
import Axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from "@material-ui/core";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Fade from "react-reveal";
import { MdLibraryAdd } from "react-icons/md";
import { FiEdit, FiPlusSquare } from "react-icons/fi";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class ManageAdmin extends Component {
  state = {
    dataFilm: [],
    datastudio: [],
    readmoreselected: -1,
    modalad: false,
    modaledit: false,
    indexedit: 0,
    jadwal: [12, 14, 16, 18, 20, 22]
  };

  componentDidMount() {
    Axios.get(`${APIURL}movies`)
      .then(res => {
        Axios.get(`${APIURL}studios`)
          .then(res1 => {
            this.setState({
              dataFilm: res.data,
              datastudio: res1.data
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  splitini = (a = "") => {
    var b = a.split("").filter((val, index) => index <= 50);
    return b;
  };

  onUpdateDataClick = () => {
    var jadwaltempelate = this.state.jadwal;
    var jadwal = [];
    var id = this.state.dataFilm[this.state.indexedit].id;
    for (var i = 0; i < jadwaltempelate.length; i++) {
      if (this.refs[`editjadwal${i}`].checked) {
        jadwal.push(jadwaltempelate[i]);
      }
    }
    var iniref = this.refs;
    var title = iniref.edittitle.value;
    var image = iniref.editimage.value;
    var sinopsis = iniref.editsinopsis.value;
    var sutradara = iniref.editsutradara.value;
    var genre = iniref.editgenre.value;
    var durasi = iniref.editdurasi.value;
    var trailer = iniref.edittrailer.value;
    var studioId = iniref.editstudio.value;
    var produksi = "RANS";
    var data = {
      title: title,
      image,
      sinopsis,
      sutradara,
      genre,
      durasi,
      produksi,
      jadwal,
      trailer,
      studioId
    };

    if (
      title === "" ||
      image === "" ||
      sinopsis === "" ||
      sutradara === "" ||
      genre === "" ||
      durasi === ""
    ) {
      alert(" tidak bisaa... anda belom isi semua");
    } else {
      Axios.put(`${APIURL}movies/${id}`, data)
        .then(() => {
          Axios.get(`${APIURL}movies/`)
            .then(res => {
              this.setState({ dataFilm: res.data });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
      this.setState({ modaledit: false });
    }
  };

  onSaveAddClick = () => {
    var jadwaltempelate = [12, 14, 16, 18, 20];
    var jadwal = [];
    for (var i = 0; i < jadwaltempelate.length; i++) {
      if (this.refs[`jadwal${i}`].checked) {
        jadwal.push(jadwaltempelate[i]);
      }
    }
    var iniref = this.refs;
    var title = iniref.title.value;
    var image = iniref.image.value;
    var sinopsis = iniref.sinopsis.value;
    var sutradara = iniref.sutradara.value;
    var genre = iniref.genre.value;
    var durasi = iniref.durasi.value;
    var trailer = iniref.trailer.value;
    var studioId = iniref.studio.value;
    var produksi = "RANS";
    var data = {
      title: title,
      image,
      sinopsis,
      sutradara,
      genre,
      durasi,
      produksi,
      jadwal,
      trailer,
      studioId
    };

    if (
      title === "" ||
      image === "" ||
      sinopsis === "" ||
      sutradara === "" ||
      genre === "" ||
      durasi === ""
    ) {
      alert(" tidak bisaa... anda belom isi semua");
    } else {
      Axios.post(`${APIURL}movies`, data)
        .then(() => {
          Axios.get(`${APIURL}movies`)
            .then(res => {
              this.setState({ dataFilm: res.data, modalad: false });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
      this.setState({ modaladd: false });
    }
  };

  renderMovies = () => {
    return this.state.dataFilm.map((val, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.title}</TableCell>
          <TableCell>
            <img src={val.image} alt={"gambar"} height="200px" />
          </TableCell>
          {this.state.readmoreselected === index ? (
            <TableCell>
              {val.sinopsis}
              <span
                style={{ color: "red" }}
                onClick={() => this.setState({ readmoreselected: -1 })}
              >
                (Read Less)
              </span>
            </TableCell>
          ) : (
            <TableCell>
              {this.splitini(val.sinopsis)}
              <span onClick={() => this.setState({ readmoreselected: index })}>
                {" "}
                (Read more)
              </span>
            </TableCell>
          )}
          <TableCell>{val.jadwal}</TableCell>
          <TableCell>{val.sutradara}</TableCell>
          <TableCell>{val.genre}</TableCell>
          <TableCell>{val.durasi}</TableCell>
          <TableCell>
            <button
              className="btn btn-outline-primary mr-1"
              onClick={() =>
                this.setState({ modaledit: true, indexedit: index })
              }
            >
              Edit
            </button>
            <button className="btn btn-outline-danger">Delete</button>
          </TableCell>
        </TableRow>
      );
    });
  };

  renderAddCheckBoc = () => {
    return this.state.jadwal.map((val, index) => {
      return (
        <div key={index}>
          <input type="checkbox" ref={`jadwal${index}`} />
          <span className="mr-2">{val}.00</span>
        </div>
      );
    });
  };

  renderEditCheckbox = indexedit => {
    var indexarr = [];
    var datafilmedit = this.state.dataFilm[indexedit].jadwal;
    // datafilmedit.forEach(val => {
    //   indexarr.push(this.state.jadwal.indexOf(val))
    // });
    for (var i = 0; i < datafilmedit.length; i++) {
      for (var j = 0; j < this.state.jadwal.length; j++) {
        if (datafilmedit[i] === this.state.jadwal[j]) {
          indexarr.push(j);
        }
      }
    }
    console.log(datafilmedit);
    var checkbox = this.state.jadwal;
    var checkboxnew = [];
    checkbox.forEach(val => {
      checkboxnew.push({ jam: val, tampiledit: false });
    });
    indexarr.forEach(val => {
      checkboxnew[val].tampiledit = true;
    });
    return checkboxnew.map((val, index) => {
      if (val.tampiledit) {
        return (
          <div key={index}>
            <input
              type="checkbox"
              defaultChecked
              ref={`editjadwal${index}`}
              value={val.jam}
            />
            <span className="mr-2">{val.jam}.00 </span>
          </div>
        );
      } else {
        return (
          <div key={index}>
            <input type="checkbox" ref={`editjadwal${index}`} value={val.jam} />
            <span className="mr-2">{val.jam}.00 </span>
          </div>
        );
      }
    });
  };

  render() {
    const { dataFilm, indexedit } = this.state;
    const { length } = dataFilm;

    if (this.props.Auth.role !== "admin") {
      return <Redirect to={"/ganemu"} />;
    }

    if (length === 0) {
      return <div>Loading...</div>;
    }
    //harus pake loading karena datafilm di array awalnya masih kosong, jadi haus pake laoding dulu
    return (
      <div className="mx-3">
        <Modal
          isOpen={this.state.modaladd}
          toggle={() => this.setState({ modaladd: false })}
        >
          <ModalHeader>
            add data
            <FiPlusSquare className="mb-2 ml-1" />{" "}
          </ModalHeader>
          <ModalBody>
            <input
              type="text"
              ref="title"
              placeholder="title"
              className="form-control mt-3"
            />
            <input
              type="text"
              ref="image"
              placeholder="image"
              className="form-control mt-3"
            />
            <input
              type="text"
              ref="sinopsis"
              placeholder="sinopsis"
              className="form-control mt-3"
            />
            Jadwal:
            <div className="d-flex">{this.renderAddCheckBoc()}</div>
            <input
              type="text"
              ref="trailer"
              placeholder="trailer"
              className="form-control mt-2"
            />
            <select ref="studio" className="form-control mt-2">
              {this.state.datastudio.map(val => {
                return <option value={val.id}>{val.nama}</option>;
              })}
            </select>
            <input
              type="text"
              ref="sutradara"
              placeholder="sutradara"
              className="form-control mt-3"
            />
            <input
              type="number"
              ref="durasi"
              placeholder="durasi"
              className="form-control mt-3"
            />
            <input
              type="text"
              ref="genre"
              placeholder="genre"
              className="form-control mt-3"
            />
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={this.onSaveAddClick}>
              Save
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modaladd: false })}
            >
              Cancel
            </button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modaledit}
          toggle={() => this.setState({ modaledit: false })}
        >
          <ModalHeader>
            Edit Data {dataFilm[indexedit].title} <FiEdit className="mb-2" />
          </ModalHeader>
          <ModalBody>
            <input
              type="text"
              defaultValue={dataFilm[indexedit].title}
              ref="edittitle"
              placeholder="title"
              className="form-control mt-3"
            />
            <input
              type="text"
              defaultValue={dataFilm[indexedit].image}
              ref="editimage"
              placeholder="image"
              className="form-control mt-3"
            />
            <textarea
              type="text"
              rows="5"
              defaultValue={dataFilm[indexedit].sinopsis}
              ref="editsinopsis"
              placeholder="sinopsis"
              className="form-control mt-3"
            />
            Jadwal:
            <div className="d-flex">{this.renderEditCheckbox(indexedit)}</div>
            <input
              type="text"
              ref="edittrailer"
              defaultValue={dataFilm[indexedit].trailer}
              placeholder="trailer"
              className="form-control mt-2"
            />
            <select ref="editstudio" className="form-control mt-2">
              <option value="1"> Studio 1</option>
              <option value="2"> Studio 2</option>
              <option value="3"> Studio 3</option>
            </select>
            <input
              type="text"
              ref="editsutradara"
              defaultValue={dataFilm[indexedit].sutradara}
              placeholder="sutradara"
              className="form-control mt-3"
            />
            <input
              type="number"
              ref="editdurasi"
              defaultValue={dataFilm[indexedit].durasi}
              placeholder="durasi"
              className="form-control mt-3"
            />
            <input
              type="text"
              ref="editgenre"
              defaultValue={dataFilm[indexedit].genre}
              placeholder="genre"
              className="form-control mt-3"
            />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={this.onUpdateDataClick}
            >
              Save
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modaledit: false })}
            >
              Cancel
            </button>
          </ModalFooter>
        </Modal>

        <Fade>
          <button
            className="btn btn-success mt-2"
            onClick={() => this.setState({ modaladd: true })}
          >
            <MdLibraryAdd style={{ fontSize: 20 }} /> &nbsp; Add Movie
          </button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Sinopsis</TableCell>
                <TableCell>Jadwal</TableCell>
                <TableCell>Sutradara</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Durasi</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderMovies()}</TableBody>
          </Table>
        </Fade>
      </div>
    );
  }
}

const MapStateToProps = state => {
  return {
    Auth: state.Auth
  };
};

export default connect(MapStateToProps)(ManageAdmin);
