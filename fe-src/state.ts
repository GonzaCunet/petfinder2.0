const API_BASE_URL = process.env.API_BASE_URL;

const state = {
  data: {
    lat: 0,
    lng: 0,
    token: "",
    mail: "",
  },
  pets: [],
  myPets: [],
  petEdit: { photoURL: "", petId: "" },
  userEdit: { name: "", location: "" },

  listeners: [],
  init() {
    if (localStorage.getItem("mail") && localStorage.getItem("token")) {
      this.data.mail = localStorage.getItem("mail");
      this.data.token = localStorage.getItem("token");
    }
  },

  getState() {
    return this.data;
  },

  setState(state) {
    this.data = state;
    for (const cb of this.listeners) {
      cb();
    }
  },

  subscribe(cb: (any) => any) {
    this.listeners.push(cb);
  },

  async logout() {
    (this.data.lat = 0),
      (this.data.lng = 0),
      (this.data.token = ""),
      (this.data.mail = "");
    this.pets = [];
    this.myPets = [];
    (this.petEdit.photoURL = ""),
      (this.petEdit.petId = ""),
      (this.userEdit.name = ""),
      (this.userEdit.location = "");
    localStorage.removeItem("token");
    localStorage.removeItem("mail");
  },

  async reportNewPet(saveData) {
    return fetch(API_BASE_URL + "/pets", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        name: saveData.name,
        lastLocation: saveData.location,
        lat: saveData.lat,
        lng: saveData.lng,
        photoURL: saveData.photoURL,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  async sendPetInfo(petId, petInfo) {
    return fetch(API_BASE_URL + "/sendmail", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        petId: petId,
        name: petInfo.name,
        phone: petInfo.phone,
        textarea: petInfo.textarea,
      }),
    });
  },
  async logIn(email, password) {
    return fetch(API_BASE_URL + "/auth/token", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          const currentState = this.getState();
          currentState.token = data.token;
          currentState.mail = data.mail;
          this.setState(currentState);
          localStorage.setItem("token", data.token);
          localStorage.setItem("mail", email);
        }
        return data;
      });
  },

  async showMyPetsCreated() {
    return fetch(API_BASE_URL + "/petscreated", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `bearer ${state.data.token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        state.myPets = res;
      });
  },
  async editPets(petId, editData) {
    return fetch(API_BASE_URL + "/pet", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        petId: petId,
        name: editData.name,
        lastLocation: editData.location,
        photoURL: editData.photoURL,
        lat: editData.lat,
        lng: editData.lng,
      }),
    }).then((res) => {
      return res.json();
    });
  },
  async editUser(name, location) {
    return fetch(API_BASE_URL + "/user", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        name: name,
        location: location,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  async editPassword(password) {
    return fetch(API_BASE_URL + "/auth", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        password: password,
      }),
    }).then((res) => {
      return res.json();
    });
  },
  async deletePet(photoURL, id) {
    return fetch(API_BASE_URL + "/pet", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `bearer ${state.data.token}`,
      },
      body: JSON.stringify({ photoURL, id }),
    });
  },
  async userSignUp(email, password, name) {
    return fetch(API_BASE_URL + "/auth", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    }).then((res) => {
      return res.json();
    });
  },

  async getNearPets(lat, lng) {
    const queryParams = {
      lat: lat.toString(),
      lng: lng.toString(),
    };
    const queryString = new URLSearchParams(queryParams).toString();
    return fetch(API_BASE_URL + "/pets-cerca-de" + "?" + queryString, {
      method: "get",
      headers: { "Content-type": "application/json" },
    }).then((res) => {
      return res.json();
    });
  },
};

export { state };
