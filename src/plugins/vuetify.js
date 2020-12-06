import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            background: "#F1F8E9",
            secondary: "#9FA8DA"
          }
        }
      }
});
