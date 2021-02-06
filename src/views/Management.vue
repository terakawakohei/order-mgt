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
      class="justify-center"
    >
      <v-col v-for="(p, index) in participants" v-bind:key="index">
        <v-card style="overflow:scroll;">
          <v-card-title>
            {{ p.name }}
          </v-card-title>
          <v-card-text class="feed-body">
            <ul class="feed-items">
              <li class="feed-list">{{ p.order }}ばんめ</li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="index == 0"
              @click="finishGame(p.id)"
              color="red"
              outlined
              rounded
              text
            >
              終了済みにする
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </draggable>
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
      dialog: false,
      agreementDialog: false,
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
    selected_plan: function() {
      this.getParticipant();
    },
  },
  methods: {
    getPlans() {
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
      });
    },
    //participantsの中での並び順でDBに更新をかける
    changeOrder() {
      return new Promise((resolve) => {
        for (let i = 0; i < this.participants.length; i++) {
          this.axios
            .put(`${this.url}/tickets/${this.participants[i].id}`, {
              order: i + 1,
            })
            .then(() => {
              if (i == this.participants.length - 1) {
                resolve();
              }
            });
        }
      });
    },
    async update() {
      await this.changeOrder();
      this.getParticipant();
    },
    switchCompleted(id) {
      console.log(id);
      console.log(new Date().toISOString());
      this.axios
        .put(`${this.url}/tickets/${id}`, {
          deleted_at: new Date().toISOString(),
        })
        .then(() => {
          this.getParticipant();
          console.log(this.participants);
        });
    },
    finishGame(id) {
      this.axios.delete(`${this.url}/tickets/${id}`).then(() => {
        this.getParticipant();
        console.log(this.participants);
      });
    },
  },
};
</script>
