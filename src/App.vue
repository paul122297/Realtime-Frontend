<template>
  <v-app >
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>RealTime</span>
        <span class="font-weight-light">CRUD</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn
        text
      >
        <span class="mr-2">Latest Release</span>
      </v-btn> -->
    </v-app-bar>

    <v-content>
      <Product/>
    </v-content>
  </v-app>
</template>

<script>
import Product from './components/Product';

export default {
  name: 'App',
  components: {
    Product,
  },
  data: () => ({
    //
  }),
};
</script>
