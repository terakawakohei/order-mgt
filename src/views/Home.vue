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
              <v-row class="text-center">
                <v-col class="">
                  <strong>
                    こちらから選んでください
                  </strong>
                </v-col>
              </v-row>
              <v-row justify="center" class="my-5">
                <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
                  <v-select
                    v-model="selected_plan"
                    item-text="name"
                    :items="plans"
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row v-if="nowDate != null" class="text-center">
                <v-col class="">
                  <strong>
                    {{ this.nowDate.getHours() }}時{{
                      this.nowDate.getMinutes()
                    }}分時点での順番（適度に更新してください）
                  </strong>
                </v-col>
              </v-row>
              <v-row v-if="nowDate != null" justify="center">
                <v-btn
                  color="orange"
                  class="white--text"
                  @click="getParticipant()"
                  >更新する</v-btn
                >
              </v-row>
              <v-row v-if="participants != null">
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
                                      <v-text class="">{{ p.name }}</v-text>
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
                                  <v-row>
                                    <v-col class="text-left">
                                      <v-text class=""
                                        >専用部屋での名前 :
                                        {{ p.switch_name }}</v-text
                                      >
                                    </v-col>
                                    <v-col class="text-right">
                                      <v-text class="">{{ p.comment }}</v-text>
                                    </v-col>
                                  </v-row>
                                  本日{{
                                    p.number_of_times
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
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="5" class="pr-0">
        <router-link to="/management" tag="div">
          <v-hover v-slot="{ hover }">
            <v-sheet
              :elevation="hover ? 12 : 2"
              :color="$vuetify.theme.themes.light.secondary"
            >
              <v-row row justify-center align-center>
                <v-col class="justify-center">
                  <div
                    class=" centered-input text-center font-weight-bold headline light-green--text text--lighten-5"
                  >
                    管理画面へ
                  </div>
                </v-col>
              </v-row>
              <v-row row justify-center align-center>
                <v-col class="justify-center">
                  <div
                    class=" centered-input text-center font-weight-bold headline indigo--text text--lighten-3"
                  >
                    <v-icon large color="light-green lighten-5">
                      mdi-account-cog-outline
                    </v-icon>
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
          </v-hover>
        </router-link>
      </v-col>
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
      //登録ダイアログ用
      registDialog: false,
      //順番確認ダイアログ用
      queueDialog: false,

      //表示している情報がいつ取得されたかを表示させる
      nowDate: null,

      plans: [],
      participants: [],
      selected_plan: null,
      url: "https://order-mgt-api.herokuapp.com",
      // url: "http://localhost:3000",
    };
  },
  created() {
    //ページが読み込まれた際に、データを取得
    this.getPlans();
  },
  methods: {
    close() {
      this.registDialog = false;
      this.getParticipant();
    },
    getPlans() {
      //DBにある企画(plans)を全取得
      this.plans = [];
      this.axios.get(`${this.url}/plans`).then((response) => {
        this.plans = response.data;
      });
    },
    getParticipant() {
      //selected_planのidと一致、かつ順番待ち状態（deleted_atがnull）のticketを全取得
      this.participants = [];
      this.axios.get(`${this.url}/tickets`).then((response) => {
        for (let t of response.data) {
          if (t.plan_id == this.selected_plan.id && t.deleted_at == null) {
            this.participants.push(t);
          }
        }
        function compare(a, b) {
          let comparison = 0;
          if (a.order > b.order) {
            comparison = 1;
          } else if (a.order < b.order) {
            comparison = -1;
          }
          return comparison;
        }

        this.participants.sort(compare);
        this.nowDate = new Date();
      });
    },
  },
  watch: {
    selected_plan: function() {
      this.getParticipant();
      this.nowDate = new Date();
    },
  },
};
</script>
<style scoped>
.centered-input input {
  text-align: center;
}
</style>
