<template>
  <v-row>
    
      <v-snackbar
        v-model="snackbar"
        :color="color"
        multi-line
        right
        :timeout="6000"
        top
      >
      <v-icon large left>check_circle</v-icon>
        <span class="text-center"> {{msg}} </span>
        <!-- <v-btn
          dark
          text
          @click="snackbar = false"
        >
          Close
        </v-btn> -->
      </v-snackbar>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn color="success" dark v-on="on">Generate Report</v-btn>
      </template>
      <v-card class="pb-12">
        
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Generate Report {{percentCompleted}}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-row>
              <v-col cols="6">
                <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    :return-value.sync="form.start"
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="form.start"
                        hide-details
                        label="Start Date"
                        single-line
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="form.start" scrollable>
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu1.save(form.start)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="form.end"
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="form.end"
                        hide-details
                        label="End Date"
                        single-line
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="form.end" scrollable>
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu2.save(form.end)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
              </v-col>
          </v-row>
          
          <v-toolbar-items>
              
            <v-btn dark @click="retrieveReport" :disabled="valid" text>Generate</v-btn>
          </v-toolbar-items>
        </v-toolbar>

 <v-card class="mx-12 mt-12">
    <v-card-title>
      <v-btn class="success" @click="exportExcel" :disabled="retrieveOrdersItem.length == 0">Export to Excel</v-btn>
      <v-btn class="red ml-2" dark @click="clearReport" :disabled="retrieveOrdersItem.length == 0">Clear Report</v-btn>
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
      :items="retrieveOrdersItem"
      :search="search"
    >
        <template v-slot:item.price="{ item }">
            PHP {{item.price}}
        </template>
    </v-data-table>
  </v-card>
  
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
var moment = require('moment')
  export default {
    data () {
      return {
          color: '',
          snackbar: false,
          msg: '',
          moment:moment,
        loading: false,
        dialog: false,
        menu1: false,
        menu2: false,
        form: {
            start: null,
            end: null
        },
        percentCompleted: 0,
        search: '',
        headers: [
          { text: 'Item Code', value: 'id' },
          { text: 'Product Name', value: 'name' },
          { text: 'Order Quantity', value: 'quantity' },
          { text: 'Price', value: 'price' },
          { text: 'Created At', value: 'created_at' },
        ],
      }
    },
    methods: {
        retrieveReport() {
            this.loading = true
            this.$store.dispatch('retrieveReport', this.form)
                .then((res) => {
                    this.loading = false
                    this.snackbar = true
                    this.color = 'success'
                    this.msg = 'You can now export it to Excel'
                })
        },
        clearReport() {
            this.loading = true
            this.$store.dispatch('clearReport', this.form)
                .then((res) => {
                    this.loading = false
                    
            })
        },
        exportExcel(){
          let config = {
                onDownloadProgress: progressEvent => {
                  this.percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                  // do whatever you like with the percentage complete
                  // maybe dispatch an action that will update a progress bar or something
                }
              }
            var start = moment(this.form.start).format('YYYY-MM-DD');
            var end = moment(this.form.end).format('YYYY-MM-DD');
            this.loading = true
            axios.get(`/api/export/report/${start}/${end}`, {responseType: 'arraybuffer'}, config)
            .then((response) => {   
                let blob = new Blob([response.data])
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                document.body.appendChild(link)
                link.download = 'Product_report_from_'+ start +'_to_'+ end +'.xlsx'
                link.click()
                this.color = 'success'
                this.snackbar = true
                this.msg = 'Export to excel successful'
                this.loading = false
            })
            .catch((error) => {
              this.loading = false
              this.color = 'red'
              this.snackbar = true
              this.msg = 'Something went wrong'
              this.errors = error.response.data.errors, 
              this.loading = false})
        },
    },
    computed:{
        ...mapGetters({
            retrieveOrdersItem:'retrieveGeneratedItems'
        }),
        valid() {
            if (this.form.start != null && this.form.end != null) {
                return false
            } else {
                return true
            }
        }
    },
  }
</script>