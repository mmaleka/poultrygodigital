import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router/index.js'
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    authorization: '',
    jwt: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    username2: '',
    endpoints: {
      obtainJWT: 'api-food_delivery/api/token/',
      refreshJWT: 'api-food_delivery/api/token/refresh/',
      // baseURL: 'http://127.0.0.1:8000/',
      baseURL: 'https://try-coding.herokuapp.com/',
    },
    loggedIn: '',
    registered: '',
    categories_data: [],
    products_data: [],
    product_detail_data: [],
  },
  mutations: {
    updateToken(state, newToken) {
      localStorage.setItem('token', newToken);
      state.jwt = newToken;
    },
    removeToken(state) {
      localStorage.removeItem('token');
      state.jwt = null;
    },
    updateUsername(state, username) {
      localStorage.setItem('username', username);
      state.jwt = username;
    },
    loginSuccess(state, username) {
      state.loggedIn = true;
      state.username = username;
      state.jwt = localStorage.getItem('token');
    },
    loginFailure(state) {
      state.loggedIn = false;
      state.username = null;
    },
    registerSuccess(state) {
      state.registered = true;
      state.jwt = localStorage.getItem('token');
    },
    registerFailure(state) {
      state.registered = false;
    },
    nullShit() {
    },
    authHeader(state) {
      let token = localStorage.getItem('token');
      let username = localStorage.getItem('username');
      if (username && token) {
        state.authorization = 'Bearer ' + token
      } else {
        state.authorization = '';
      }
    },
    addCategories(state, cat_data) {
      state.categories_data = cat_data;
    },
    addProducts(state, prod_data) {
      state.products_data = prod_data;
    },
    addProductDetail(state, prod_detail_data) {
      state.product_detail_data = prod_detail_data
    },
    

  },
  getters: {
    isLoggedIn: state => !!state.jwt,
    userName: state => state.username2,
    userjwt: state => state.jwt,
    userName1: state => state.username,
    loggedIn: state => state.loggedIn,

    all_categories: state => state.categories_data,
    all_products: state => state.products_data,
    product_detail: state => state.product_detail_data,
  },
  actions: {
    obtainToken({ commit }, user) {
      const username = user.username
      console.log("user: ", user);
      axios.post(this.state.endpoints.baseURL + this.state.endpoints.obtainJWT, user)
        .then((res) => {
          commit('updateToken', res.data.access);
          commit('updateUsername', username);
          const token = res.data.token;
          axios.defaults.headers.common['Authorization'] = token
          this.state.username2 = username
          commit('loginSuccess', username)
          router.push('/');
          console.log("token: ", token);
          Vue.$toast.open("Login successful", {
            timeout: 2000
          });
        })
        .catch(err => {
          commit('loginFailure')

          if (err.response.data.username) {
            Vue.$toast.error(err.response.data.username[0], {
              timeout: 2000
            });
          } else if (err.response.data.email) {
            Vue.$toast.error(err.response.data.email[0], {
              timeout: 2000
            });
          } else if (err.response.data.password) {
            Vue.$toast.error(err.response.data.password[0], {
              timeout: 2000
            });
          } else if (err.response.data.detail) {
            Vue.$toast.error(err.response.data.detail, {
              timeout: 2000
            });
          } else {
            Vue.$toast.error(err.response.data, {
              timeout: 2000
            });
          }


        })
    },
    newRegister({ commit }, registerdata) {
      const { username, first_name, email, password, password_confirm } = registerdata;
      axios.post(this.state.endpoints.baseURL + 'api-food_delivery/auth/accounts/register/', {
        username,
        first_name,
        email,
        password,
        password_confirm
      })
        .then(res => {
          console.log("can register");
          this.dispatch('obtainToken', { username, password });
          this.state.username2 = username;
          console.log(res);
          commit('registerSuccess');
          // router.push('/');
          Vue.$toast.open("Registration successful", {
            timeout: 2000
          });
        })
        .catch(err => {
          this.commit('registerFailure')
          console.log("err: ", err);

          if (err.response.data.username) {
            Vue.$toast.error(err.response.data.username[0], {
              timeout: 2000
            });
          } else if (err.response.data.email) {
            Vue.$toast.error(err.response.data.email[0], {
              timeout: 2000
            });
          } else if (err.response.data.password) {
            Vue.$toast.error(err.response.data.password[0], {
              timeout: 2000
            });
          } else if (err.response.data.password_confirm) {
            Vue.$toast.error(err.response.data.password_confirm[0], {
              timeout: 2000
            });
          } else {
            Vue.$toast.error(err.response.data, {
              timeout: 2000
            });
          }
        })
    },


    async sendOrderEmail({ commit }, orderDetails) {
      commit('nullShit');
      // get the owner using user id
      let order_id = orderDetails.orderNo
      console.log("order_id: ", order_id);
      const res_email = await axios.get(this.state.endpoints.baseURL + 'api-shopping_cart3/api_shopping_userEmail/?cart_id=' + order_id)
      console.log("res_email: ", res_email);
    },


    async fetchProfile({ commit }, user_id) {
      // get the owner using user id
      const res_profile = await axios.get(
        this.state.endpoints.baseURL + 'api-accounts_profile/accounts_profile_detail/?search=' + user_id)
      let res_profile_id = res_profile.data[0].id

      const url = this.state.endpoints.baseURL + 'api-accounts_profile/accounts_profile_detail/' + res_profile_id + '/'
      const resupdateProfile = await axios.get(url)
      console.log("resupdateProfile.data: ", resupdateProfile.data);
      commit('addProfile', resupdateProfile.data)

    },



    async fetchCatergories({ commit }) {
      const response = await axios.get(
        this.state.endpoints.baseURL + 'api-poultrygodigital/poultry_category/'
      )
      console.log("response.data: ", response.data);
      commit('addCategories', response.data)
    },


    async fetchProductList({ commit }) {

      const responseProducts = await axios.get(
        this.state.endpoints.baseURL + 'api-food_delivery/api_food_delivery_productList/')

      commit('addProducts', responseProducts.data)

    },

    async fetchProductDetail({ commit }, product_id) {

      const responseProductDetail = await axios.get(
        this.state.endpoints.baseURL + 'api-poultrygodigital/poultry_products_detail/' + product_id)

      commit('addProductDetail', responseProductDetail.data)

    },


    async SendQuoatationRequest({ commit }, quotation_data) {
      console.log("commit: ", commit);
      console.log("quotation_data: ", quotation_data);

      // const url = this.state.endpoints.baseURL + 'api-analytics/api_user_product_view/'
      const url = this.state.endpoints.baseURL + 'api-poultrygodigital/quotationrequests/'
      axios.post(url, {
        prod_id: quotation_data.prod_id,
        user_id: quotation_data.user_id,
        user_quantity: quotation_data.user_quantity,
        cell_number: quotation_data.cell_number,
        first_name: quotation_data.first_name,
        date: quotation_data.date
      })
        .then(res_userproductview => {
          console.log(res_userproductview);
          Vue.$toast.open("Thank you. We will get in touch soon", {
            timeout: 4000
          });
        })
        .catch(err => console.error(err));

    },


  },
  modules: {
  }
})
