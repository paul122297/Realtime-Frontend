<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-flex>
<v-snackbar
        v-model="snackbar"
        :color="color"
        multi-line
        right
        :timeout="6000"
        top
      >
      <v-icon large left>check_circle</v-icon>
        <span> {{msg}} </span>
        <v-btn
          dark
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
 <v-card>
    <v-card-title>
      <Create/>
      <GenerateReport/>
      <div class="flex-grow-1"></div>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="products"
      :search="search"
    >
    <template v-slot:item.action="{ item }">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn @click="updateProduct(item)" color="primary"  text fab small dark v-on="on">
                        <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <span>Edit Product</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn @click="deleteProduct(item)" color="red"  text fab small dark v-on="on">
                        <v-icon small>delete</v-icon>
                    </v-btn>
                </template>
                <span>Delete Product</span>
            </v-tooltip>
        </template>
    </v-data-table>
  </v-card>
  <Update/>
  <Delete/>
    </v-flex>
    
    </v-layout>
  </v-container>
</template>

<script>
import GenerateReport from './options/GenerateReport'
import Create from './options/Create'
import Update from './options/Update'
import Delete from './options/Delete'
import bus from '../event_bus'
export default {
  components: {
    GenerateReport,
    Create,
    Update,
    Delete
  },
 data() {
   return {
     loading: false,
     snackbar: false,
     msg: '',
     color: '',
     search: '',
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Quantity', value: 'quantity' },
          { text: 'Price', value: 'price' },
          { text: 'Action', value: 'action' },
        ],
   }
 },
 created() {
   this.loading = true
   this.$store.dispatch('retrieveProducts')
      .then((res) => {
        this.loading = false
      })

  window.Echo.channel('product-crud')
    .listen('ProductEventCreated', (e) => {
        console.log(e);
        this.$store.commit('pushProduct', e.product)
        this.snackbar = true
        this.color = 'success'
        this.msg = 'Product Successfully Created'
    })
    .listen('ProductEventUpdated', (e) => {
        console.log(e);
        this.$store.commit('updateProduct', e.product)
        this.snackbar = true
        this.color = 'warning'
        this.msg = 'Product Successfully Updated'
    })
    .listen('ProductEventDeleted', (e) => {
        console.log(e);
        this.$store.commit('deleteProduct', e.product)
        this.snackbar = true
        this.color = 'red'
        this.msg = 'Product Successfully Deleted'
    });
 },
 methods: {
  updateProduct(item) {
        bus.$emit('editProduct', item)
    },
  deleteProduct(item) {
        bus.$emit('productDelete', item)
    },
 },
 computed: {
   products() {
     return this.$store.getters.retrieveProducts
   }
 }
}
</script>
