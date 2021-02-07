<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          管理画面
        </h1>

        <p class="subheading font-weight-regular">
          このページから順番の変更などを行えます(ドラッグで順番を入れ替えられます)
        </p>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col class="">
        <strong>
          以下から企画名を選択してください
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

    <v-row justify="center" class="my-5">
      <v-btn color="orange" class="white--text" @click="update()"
        >変更を反映する</v-btn
      >
    </v-row>

    <draggable
      :options="options"
      v-model="participants"
      element="v-row"
      class="justify-center "
    >
      <v-col v-for="(p, index) in participants" v-bind:key="index">
        <v-card style="overflow:scroll;">
          <v-card-title>
            {{ p.name }}
            <v-row>
              <v-col class="text-right pt-0">
                <v-chip class="ma-2" color="grey" text-color="white">
                  {{ p.order }}ばんめ
                </v-chip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="feed-body">
            <v-row>
              <v-col class="text-left">
                <v-text class="">{{ p.comment }}</v-text>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  v-if="index == 0"
                  @click="finishGame(p.id)"
                  color="red"
                  dark
                  rounded
                >
                  終了済みにする
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </draggable>
    <v-row justify="center" class="mt-12">
      <v-dialog v-model="createDialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            企画を追加する
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">新規作成</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="企画名"
                    v-model="planName"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    :items="['1on1', '2on2']"
                    label="対戦人数"
                    v-model="matchStyle"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="createDialog = false">
              閉じる
            </v-btn>
            <v-btn
              outlined
              :disabled="!planName || !matchStyle"
              color="blue darken-1"
              text
              @click="createPlan"
            >
              作成
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center" class="my-7">
      <v-dialog v-model="deleteDialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red" dark v-bind="attrs" v-on="on">
            企画を削除する
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">削除</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="plans"
                    label="企画名"
                    item-text="name"
                    return-object
                    v-model="selectedDeletePlan"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="deleteDialog = false">
              閉じる
            </v-btn>
            <v-btn
              :disabled="!selectedDeletePlan"
              outlined
              color="blue darken-1"
              text
              @click="deletePlan()"
            >
              削除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import draggable from "vuedraggable";

export default {
  name: "Home",
  components: {
    draggable,
  },
  data() {
    return {
      //企画作成ダイアログ用
      createDialog: false,
      planName: "",
      matchStyle: "",
      //企画削除ダイアログ用
      deleteDialog: false,
      selectedDeletePlan: null,
      options: {
        animation: 200,
      },
      participants: [],
      plans: [],
      doneParticipants: [],
      selected_plan: null,
      url: "https://order-mgt-api.herokuapp.com",
      // url: "http://localhost:3000",
    };
  },
  created() {
    this.getPlans();
  },
  watch: {
    //企画が選択されたことを監視、変更があったらその企画に応じた参加者を取得する
    selected_plan: function() {
      this.getParticipant();
    },
    //新たに追加された企画をplansに追加する（更新する）
    createDialog: function() {
      this.getPlans();
    },
  },
  methods: {
    getPlans() {
      //DBにある企画(plans)を全取得
      this.plans = [];
      this.axios.get(`${this.url}/plans`).then((response) => {
        this.plans = response.data;
      });
    },

    getParticipant() {
      //selected_planに応じて、その企画の参加者をparticipansに入れる

      //selected_planのidと一致、かつ順番待ち状態（deleted_atがnull）のticketを全取得
      this.participants = [];
      this.axios.get(`${this.url}/tickets`).then((response) => {
        for (let t of response.data) {
          if (t.plan_id == this.selected_plan.id && t.deleted_at == null) {
            this.participants.push(t);
          }
        }
        //orderでソートする
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
      });
    },

    changeOrder() {
      //participantsのインデックス0〜末尾までの順番で、orderを更新する
      //participants全てにputを行うまで処理を待つように、Promiseを用いる
      return new Promise((resolve) => {
        for (let i = 0; i < this.participants.length; i++) {
          this.axios
            .put(`${this.url}/tickets/${this.participants[i].id}`, {
              order: i + 1,
            })
            .then(() => {
              if (i == this.participants.length - 1) {
                //全てのparticipantsに更新をかけたら、完了とみなす
                resolve();
              }
            });
        }
      });
    },

    async update() {
      //参加者の情報をアップデートする
      await this.changeOrder();
      this.getParticipant();
    },

    finishGame(id) {
      //試合が終わったことにする
      this.axios.delete(`${this.url}/tickets/${id}`).then(() => {
        this.getParticipant();
        this.update();
      });
    },

    createPlan() {
      //企画を作成する
      this.axios
        .post(`${this.url}/plans`, {
          name: this.planName,
          match_type: this.matchStyle,
        })
        .then(() => {
          this.planName = "";
          this.matchStyle = "";
          this.createDialog = false;
        });
    },

    deletePlan() {
      //企画を削除する
      this.axios
        .delete(`${this.url}/plans/${this.selectedDeletePlan.id}`)
        .then(() => {
          this.selectedDeletePlan = null;
          this.deleteDialog = false;
          this.getPlans();
        });
    },
  },
};
</script>
