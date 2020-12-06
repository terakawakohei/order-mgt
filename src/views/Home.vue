<template>
  <div>
    <v-row align="center" justify="center">
      <v-col cols="5" class="pr-0">
        <v-hover v-slot="{ hover }">
          <v-sheet
            :elevation="hover ? 12 : 2"
            :color="$vuetify.theme.themes.light.secondary"
            @click.stop="registDialog = true"
          >
            <v-row row justify-center align-center>
              <v-col class="justify-center">
                <div
                  class=" centered-input text-center font-weight-bold headline light-green--text text--lighten-5"
                >
                  対戦予約する
                </div>
              </v-col>
            </v-row>
            <v-row row justify-center align-center>
              <v-col class="justify-center">
                <div
                  class=" centered-input text-center font-weight-bold headline indigo--text text--lighten-3"
                >
                  <v-icon large color="light-green lighten-5">
                    mdi-lead-pencil
                  </v-icon>
                </div>
              </v-col>
            </v-row>
          </v-sheet>
        </v-hover>
        <v-dialog v-model="registDialog">
          <Registration v-on:clickClose="close" />
        </v-dialog>
      </v-col>
      <v-col cols="5" class="pl-0">
        <v-hover v-slot="{ hover }">
          <v-sheet
            :elevation="hover ? 8 : 2"
            :color="$vuetify.theme.themes.light.background"
            @click.stop="queueDialog = true"
          >
            <v-row row justify-center align-center>
              <v-col class="d-flex justify-center">
                <div
                  class=" centered-input text-center font-weight-bold headline indigo--text text--lighten-3"
                >
                  順番を見る
                </div>
              </v-col>
            </v-row>
            <v-row row justify-center align-center>
              <v-col class="justify-center">
                <div
                  class=" centered-input text-center font-weight-bold headline indigo--text text--lighten-3"
                >
                  <v-icon large color="indigo lighten-3">
                    mdi-format-list-text
                  </v-icon>
                </div>
              </v-col>
            </v-row>
          </v-sheet>
        </v-hover>

        <v-dialog
          v-model="queueDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="indigo lighten-3">
              <v-btn icon @click="queueDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title></v-toolbar-title>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col class="text-left">
                  <v-timeline align-top dense>
                    <v-row class="justify-center">
                      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                        <v-timeline-item
                          color="indigo lighten-3"
                          small
                          v-for="(p, index) in participants"
                          :key="p.index"
                          fill-dot
                        >
                          <v-card>
                            <v-list-item three-line>
                              <v-list-item-content>
                                <v-list-item-title
                                  class="font-weight-bold mb-1"
                                >
                                  <v-row>
                                    <v-col class="text-left">
                                      <v-text class="">{{ p.Name }}</v-text>
                                    </v-col>
                                    <v-col class="text-right pt-0">
                                      <v-chip
                                        v-if="index == 0"
                                        class="ma-2"
                                        color="orange"
                                        text-color="white"
                                      >
                                        対戦中!
                                      </v-chip>
                                      <v-chip
                                        v-else
                                        class="ma-2"
                                        color="grey"
                                        text-color="white"
                                      >
                                        {{ index * 3 }}分待ち
                                      </v-chip>
                                    </v-col>
                                  </v-row>
                                </v-list-item-title>
                                <v-list-item-subtitle class="">
                                  <p>専用部屋での名前 : {{ p.SwitchName }}</p>
                                  本日{{
                                    p.NumberOfTimes
                                  }}回目</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                          </v-card>
                        </v-timeline-item>
                      </v-col>
                    </v-row>
                  </v-timeline>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-col>

      <router-link to="/management">管理画面へ</router-link>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src

import Registration from "../components/registration.vue";
export default {
  name: "Home",
  components: {
    Registration,
  },
  data() {
    return {
      registDialog: false,
      queueDialog: false,
      agreementDialog: false,
      options: {
        animation: 200,
      },
      items: [
        { numberOfTimes: 1, name: "ゆりまる", switchName: "黒月まる" },
        { numberOfTimes: 1, name: "oz_sho", switchName: "おずしょー" },
        { numberOfTimes: 1, name: "おだやかじんせい", switchName: "おだやか" },
        { numberOfTimes: 2, name: "きるりん", switchName: "きる" },
        { numberOfTimes: 1, name: "ともちん", switchName: "ともちん_GOD" },
      ],
      participants: [],
    };
  },
  created() {
    this.getParticipant();
  },
  methods: {
    close() {
      this.registDialog = false;
      this.getParticipant();
    },
    getParticipant() {
      this.participants = [];
      this.axios
        .get(`https://rokko-festival-server.herokuapp.com/book/all`)
        .then((response) => {
          // console.log(Object.entries(response.data)[0][1]);
          // console.log(typeof this.participants);
          Object.entries(response.data).forEach((elem) => {
            //対戦済みでない人を取得
            if (elem[1].Done == 0) {
              this.participants.push(elem[1]);
              console.log(elem[1]);
            }
          });
          function compare(a, b) {
            let comparison = 0;
            if (a.Order > b.Order) {
              comparison = 1;
            } else if (a.Order < b.Order) {
              comparison = -1;
            }
            return comparison;
          }

          this.participants.sort(compare);
        });
    },
  },
};
</script>
<style scoped>
.centered-input input {
  text-align: center;
}
</style>
