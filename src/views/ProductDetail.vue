<template>
  <v-container class="grey lighten-5">
    <v-row
      class="mb-6"
      justify="center"
      no-gutters
    >
      <keep-alive>
      <v-col class="blue-grey--text">
        <v-card
        :loading="loading"
        class="mx-auto my-12"
        max-width="400"
        >

        <v-img
        height="250"
        v-bind:src = product_detail.image 
        ></v-img>

        <v-card-title>{{ product_detail.name }}</v-card-title>

        <v-card-text>
        <v-row
            align="center"
            class="mx-0"
        >
        <v-col
        align="center"
        >
            <!-- <p>Quantity: {{ value }}</p> -->
            <vue-number-input v-model="value" :min="1" :max="10" :inputtable="false" placeholder="Quantity" size="small" inline center controls></vue-number-input>
        </v-col>
        </v-row>


        <v-row align="center" justify="center">
            <v-col cols="12">
                <ValidationObserver ref="observer" v-slot="{ }">
                    <form>
                    <ValidationProvider>
                      <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="Date required"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </ValidationProvider>
                    <!-- <ValidationProvider v-slot="{ errors }" name="date_required" rules="required|max:50">
                        <v-text-field
                        v-model="date_required"
                        :counter="20"
                        :error-messages="errors"
                        label="date_required"
                        prepend-icon="mdi-calendar"
                        required
                        ></v-text-field>
                    </ValidationProvider> -->
                    <ValidationProvider v-slot="{ errors }" name="cell_number" rules="required|max:50">
                        <v-text-field
                        v-model="cell_number"
                        :counter="20"
                        :error-messages="errors"
                        label="cell_number"
                        prepend-icon="mdi-phone"
                        required
                        ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="first_name" rules="required|max:50">
                        <v-text-field
                        v-model="first_name"
                        :counter="20"
                        :error-messages="errors"
                        label="First Name"
                        prepend-icon="mdi-account"
                        required
                        ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="quantity" rules="required">
                        <v-text-field
                        v-model="quantity"
                        :error-messages="errors"
                        label="Quantity"
                        prepend-icon="mdi-pencil"
                        required
                        ></v-text-field>
                    </ValidationProvider>

                    <!-- <v-btn block type="submit" @click="Register" value="Submit" color="warning" dark>Register</v-btn> -->

                    
                    </form>
                </ValidationObserver>
            </v-col>
        </v-row>


        <v-row
            align="center"
        >
        <v-col cols="12" align="center">
            <v-btn block @click="AddtoCartNo1" :disabled="loading" color="warning" dark>
              Request Quatation
                <!-- <v-progress-circular
                  v-if=this.$store.getters.cart_loading
                  indeterminate
                  color="red"
                ></v-progress-circular> -->
            </v-btn>
        </v-col>

        </v-row>

        
        <v-row
            align="center"
        >
            <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
            ></v-rating>

            <div class="grey--text ml-4">4.5 (413)</div>
        </v-row>

        <!-- <div class="my-4 subtitle-1">
            R {{ product_detail.price }}
        </div> -->

        <div>{{ product_detail.description }}</div>
        </v-card-text>

        </v-card>
      </v-col>
      </keep-alive>
    </v-row>
   
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VueJwtDecode from 'vue-jwt-decode';
import router from '@/router/index.js'

import { required, email, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'


setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters',
})

extend('email', {
  ...email,
  message: 'Email must be valid',
})


export default {
    name: "ProductDetail",

    components: {
      ValidationProvider,
      ValidationObserver,
    },

    data: () => ({
      disabled: false,
      dense: true,
      twoLine: true,
      threeLine: false,
      shaped: false,
      flat: false,
      subheader: false,
      inactive: false,
      subGroup: false,
      nav: false,
      avatar: false,
      rounded: false,

      loading: false,
      addCartLoading: false,
      value: 1,

      cell_number: '',
      first_name: '',
      date_required: '',
      quantity: '',

      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,

    }),
    methods: {
      ...mapActions(['fetchProductDetail', 'AddtoCart', 'fetchCartDetails']),
      AddtoCartNo1(){
        let prod_id = this.$route.params.id
        // let user_id = VueJwtDecode.decode(this.$store.getters.userjwt).user_id
        let user_id = 2
        let user_quantity = this.quantity
        let cell_number = this.cell_number
        let first_name = this.first_name
        let date = this.date

        this.$store.dispatch('SendQuoatationRequest', { prod_id, user_id, user_quantity, cell_number, first_name, date })

      },
      CheckOutNo1() {
        router.push('/checkout')
      }
    },
    computed: mapGetters(['product_detail', 'userjwt', 'user_cart_sum']),
    created() {
      let prod_id = this.$route.params.id
      this.fetchProductDetail(this.$route.params.id);
      let user_id = VueJwtDecode.decode(this.$store.getters.userjwt).user_id
      // this.fetchCartDetails(user_id);
      
      // add the user and viewed product by user
      this.$store.dispatch('UserProductView', { prod_id, user_id })
    },
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>