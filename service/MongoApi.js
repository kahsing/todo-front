import axios from "axios";
const SERVER_URL = process.env.SERVER_URL;
const PORT = process.env.PORT;

const url = SERVER_URL + ":" + PORT;

var MongoApi = {
  getItemList: async function () {
    return axios
      .post(`${url}/api/todo/list`)
      .then((res) => res.data)
      .catch((error) => {
        return [{ uuid: "test1", desc: "test1", done: false }];
      });
  },
  addItem: async function (todo, setErrorMessage) {
    return await axios
      .post(`${url}/api/todo/add`, { todo })
      .then((res) => res.data)
      .catch((error) => {
        const {
          data: {
            error: { reason },
          },
        } = error.response;
        setErrorMessage(reason);
      });
  },
  removeItem: async function (todo, setErrorMessage) {
    const { uid } = todo;
    return await axios
      .delete(`${url}/api/todo/delete/${uid}`)
      .then((res) => res.data)
      .catch((error) => {
        const {
          data: {
            error: { reason },
          },
        } = error.response;
        setErrorMessage(reason);
      });
  },
  saveEditItem: async function (todo, setErrorMessage) {
    return await axios
      .put(`${url}/api/todo/edit`, { todo })
      .then((res) => res.data)
      .catch((error) => {
        const {
          data: {
            error: { reason },
          },
        } = error.response;
        setErrorMessage(reason);
      });
  },
};

module.exports = MongoApi;
