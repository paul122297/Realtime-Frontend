<template>
  <v-row>
      
    <v-dialog v-model="dialog" persistent max-width="700px">

      <v-card>
        <v-card-title>
          <span class="headline">Update Product</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <form>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="form.name"
                            v-validate="'required'"
                            :error-messages="errors.collect('name')"
                            label="Product Name"
                            data-vv-name="name"
                            required
                        ></v-text-field>
                    </v-col>
                
                    <v-col cols="12">
                        <v-textarea
                            v-model="form.description"
                            v-validate="'required'"
                            :error-messages="errors.collect('description')"
                            label="Product Description"
                            data-vv-name="description"
                            required
                        ></v-textarea>
                    </v-col>

                    <v-col cols="6">
                        <v-text-field
                            v-model="form.price"
                            v-validate="'required'"
                            :error-messages="errors.collect('price')"
                            label="Product Price"
                            data-vv-name="price"
                            required
                            type="number"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6">
                        <v-text-field
                            v-model="form.quantity"
                            v-validate="'required'"
                            :error-messages="errors.collect('quantity')"
                            label="Product Quantity"
                            data-vv-name="quantity"
                            required
                            type="number"
                        ></v-text-field>
                    </v-col>
                </v-row>

            </form>
          </v-container>
        </v-card-text>
        <v-card-actions v-if="!loading">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
          <v-btn color="primary" :disabled="validated" @click="addProduct">Save</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-progress-linear
            v-if="loading"
            rounded
            indeterminate
            color="primary"
          ></v-progress-linear>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import bus from '../../event_bus'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'
  import { mapGetters } from 'vuex'
  Vue.use(VeeValidate)
  export default {
    components: {
        
    },
    $_veeValidate: {
      validator: 'new',
    },
    data() {
        return {
            snackbar: false,
            loading: false,
            isLoading: false,
            dialog: false,
            form: {
                id: '',
                name: '',
                description: '',
                price: '',
                quantity: ''
            },
            dictionary: {
                attributes: {
                    name: 'Product Name',
                    description: 'Product Description',
                    price: 'Product Price',
                    quantity: 'Product Quantity'
                },
            },
        }
    },
    mounted () {
      this.$validator.localize('en', this.dictionary)
      var vm = this
      bus.$on('editProduct', function (value) {
        vm.dialog = true
        vm.form = value
      })
    },
    methods: {
      closeDialog() {
        this.dialog = false
        this.loading = false
        this.form = {}
        this.$validator.reset()
      },
        addProduct(){
          //console.log(this.form)
          this.loading = true
            this.$store.dispatch('updateProduct', this.form)
                .then((response) => {
                    this.dialog = false
                    this.loading = false
                    this.closeDialog()
                    console.log(response)
                }).catch(error => {
                    console.log(error)
                })
        },
    },
      computed: {
        validated(){
          if (!Object.keys(this.fields).some(key => this.fields[key].invalid)) return false
          else return true
        },
      },
  }
</script>