<template>
  <v-layout justify-center>

    <v-dialog v-model="deleteDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="subtitle-1">Are you sure you want to delete this Product? </v-card-title>
        <v-divider></v-divider>
        <v-card-actions v-if="!isLoading">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteProduct">Yes</v-btn>
          <v-btn color="red" text @click="closeDialog">No</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
            <v-progress-linear
                color="primary"
                indeterminate
                rounded
                height="3"
            ></v-progress-linear>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import bus from '../../event_bus.js'
  export default {
    data () {
      return {
        deleteDialog: false,
        id: '',
        isLoading: false,
        snackbar: false,
        text: ''
      }
    },

    created () {
        var vm = this
        bus.$on('productDelete', function (value) {
            vm.deleteDialog = true
            vm.id = value.id
            console.log(value)
      })
    //   bus.$on('account', function (value) {
    //     vm.id = value.id
    //   })
    },
    methods: {
        closeDialog(){
            this.deleteDialog= false
        },
        deleteProduct() {
            this.isLoading = true
            this.$store.dispatch('deleteProduct', this.id)
              .then((response) => {
                this.isLoading = false
                this.deleteDialog = false
              })
        }
    }
  }
</script>