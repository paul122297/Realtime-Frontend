import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    orders: []
  },
  getters: {
    retrieveProducts(state) {
      return state.products
    },
    retrieveGeneratedItems(state) {
      return state.orders
  },
  },
  mutations: {
    retrieveProducts(state, payload) {
      state.products = payload
    },
    pushProduct(state, payload) {
      state.products.push(payload)
    },
    updateProduct(state, payload){
      let updateIndex = state.products.findIndex(item => item.id === payload.id);
      Vue.set(state.products, updateIndex, payload)
    },
    deleteProduct(state, id){
      let deleteIndex = state.products.findIndex(item => item.id === id);
      state.products.splice(deleteIndex, 1)
  },
    retrieveGeneratedItems(state, payload){
      state.orders = payload
    },
    clearData(state) {
        state.orders = []
    }
  },
  actions: {
    retrieveProducts(context){
      return new Promise((resolve, reject) => {
          axios.get(`/api/product/index`)   
          .then(response => {
            context.commit('retrieveProducts' , response.data)
            resolve(response)
          })
          .catch(error => {
            reject(error)
         })
     })
    },
    addProduct(context, form){
      return new Promise((resolve, reject) => {
          console.log(form)
          axios.post('/api/product/store', form)
          .then(response => {
              //context.commit('pushProduct' , response.data)
              resolve(response)
          })
          .catch(error => {
              console.log(error)
              reject(error)
          })
      })
  },
  updateProduct(context, form){
    return new Promise((resolve, reject) => {
        axios.put(`/api/product/update/${form.id}`, form)
        .then(response => {
            //context.commit('updateProduct' , response.data)
            resolve(response)
        })
        .catch(error => {
            console.log(error)
            reject(error)
        })
    })
  },
  deleteProduct(context, id) {
    return new Promise((resolve, reject) => {
        axios.delete(`/api/product/delete/${id}`)   
        .then(response => {
            resolve(response)
            //context.commit('deleteProduct' , id)
        })
        .catch(error => {
            console.log(error)
            reject(error)
        })
    })
},

retrieveReport(context, params){
  return new Promise((resolve, reject) => {
      axios.get(`/api/generate/orders/${params.start}/${params.end}`)
      .then(response => {
          context.commit('retrieveGeneratedItems', response.data)
          resolve(response)
      })
      .catch(error => {
          reject(error)
      })
  }) 
},
clearReport(context) {
  return new Promise((resolve, reject) => {
      context.commit('clearData')
      resolve('clear')
  }) 
}
  }
})
