<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1" color="indigo lighten-3">
        参加回数
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2" color="indigo lighten-3">
        名前入力
      </v-stepper-step>

      <v-divider></v-divider>
      <v-stepper-step :complete="e1 > 3" step="3" color="indigo lighten-3">
        キャラリク・ステージ希望など
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="4" color="indigo lighten-3">
        予約完了
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row class="text-center">
          <v-col class="">
            <strong>
              以下の企画への参加申請を行います >
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
        <v-row justify="center">
          <v-btn
            rounded
            large
            color="indigo lighten-3"
            :disabled="!selected_plan"
            @click="
              e1 = 2;
              getParticipant();
            "
            class="white--text"
          >
            次へすすむ
            <v-icon class="ml-2" dark>
              mdi-arrow-right-bold
            </v-icon>
          </v-btn>
        </v-row>

        <v-row justify="end" class="py-7">
          <v-btn outlined text class="mr-3" @click="close()">
            予約をやめる
          </v-btn>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-row class="text-center">
          <v-col>
            <strong>本日何回目の参加ですか？</strong>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <v-btn outlined text class="mr-3" @click="isFirstTime(true)"
              >1回目</v-btn
            >
          </v-col>
          <v-col>
            <v-btn outlined text class="mr-3" @click="isFirstTime(false)"
              >２回以上</v-btn
            >
          </v-col>
        </v-row>
        <template v-if="firstTime != null && firstTime == true">
          <v-row class="text-center">
            <v-col>
              <strong>・youtubeアカウントの名前</strong>
              <span class="text-caption">
                (コメント欄で表示される自分の名前)
              </span>
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col>
              <strong>・使用するスイッチの名前</strong>
              <span class="text-caption">
                (専用部屋に入った時に表示される自分の名前)
              </span>
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col>
              を入力してください。
            </v-col>
          </v-row>
          <v-row justify="center" class="my-5">
            <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
              <v-text-field
                label="youtubeアカウントの名前（コメント欄に表示される名前）"
                v-model="name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
              <v-text-field
                v-model="switchName"
                label="使用するスイッチの名前（専用部屋に入った時に表示される自分の名前）"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-if="firstTime != null && firstTime == false">
          <v-row class="text-center">
            <v-col class="">
              <strong>
                ※2回目以降の方はこちらから選択してください
              </strong>
            </v-col>
          </v-row>
          <v-row justify="center" class="my-5">
            <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
              <v-select
                v-model="selected_ticket"
                item-text="name"
                :items="participants"
                return-object
              />
            </v-col>
          </v-row>
        </template>

        <v-row justify="center">
          <v-btn
            :disabled="!selected_ticket && !name"
            outlined
            text
            class="mr-3 py-7"
            @click="e1 = 3"
          >
            次へ
          </v-btn>
        </v-row>
        <v-row justify="end">
          <v-btn outlined text class="mr-3 py-7" @click="e1 = 1">
            戻る
          </v-btn>
        </v-row>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-row v-if="!selected_ticket" class="text-center">
          <v-col> {{ name }}({{ switchName }})で予約をします。 </v-col>
        </v-row>
        <v-row v-else class="text-center">
          <v-col>
            {{ selected_ticket.name }}({{
              selected_ticket.switch_name
            }})で予約をします。
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            キャラリクエスト・ステージ希望などありましたらお書きください！
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <v-textarea
              v-model="comment"
              solo
              name="input-7-4"
              label="Solo textarea"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-btn outlined text class="mr-3 py-7" @click="book()">
            予約する
          </v-btn>
        </v-row>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-row class="text-center">
          <v-col class="">
            <strong>予約完了</strong>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            あなたは<span class="font-weight-bold">{{
              this.participants.length + 1
            }}</span
            >ばんめに予約されました。
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            およそ<span class="font-weight-bold">{{
              (this.participants.length + 1) * 3
            }}</span
            >分後に順番が回ってきます。それまでお待ちください！
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-btn outlined text class="mr-3" @click="finishBook()">
            閉じる
          </v-btn>
        </v-row>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  name: "Registration",

  data: () => ({
    name: "",
    switchName: "",
    comment: "",

    plans: [],
    participants: [],
    selected_plan: null,
    selected_ticket: null,
    firstTime: null,
    url: "http://localhost:3000",

    e1: 1,
  }),
  props: {},
  created() {
    this.getPlans();
  },
  methods: {
    close() {
      //親コンポーネント（Home.vue）にダイアログを閉じるような処理をお願いする
      this.$emit("clickClose");
    },
    getPlans() {
      this.plans = [];
      this.axios.get(`${this.url}/plans`).then((response) => {
        this.plans = response.data;
      });
    },
    getParticipant() {
      //selected_planのidと一致するplan_idを持つticketを全取得
      this.participants = [];
      this.axios.get(`${this.url}/tickets`).then((response) => {
        for (let t of response.data) {
          if (t.plan_id == this.selected_plan.id) {
            this.participants.push(t);
          }
        }
        console.log(this.participants);
        console.log(this.plans);
      });
    },
    isFirstTime(bool) {
      this.firstTime = bool;
      this.selected_ticket = null;
      this.name = "";
      this.switchName = "";
    },

    finishBook() {
      //ステッパーを最初の画面に戻して、予約画面を閉じる.
      this.e1 = 1;
      this.name = "";
      this.switchName = "";
      this.selected_ticket = null;
      this.selected_plan = null;
      this.comment = "";

      this.participants = [];
      this.plans = [];
      this.close();
    },

    book() {
      //データをDBにpostし、予約完了する

      if (this.selected_ticket) {
        //2回目の申請なら

        this.axios
          .put(`${this.url}/tickets/${this.selected_ticket.id}`, {
            number_of_times: this.selected_ticket.number_of_times + 1,
            order: this.participants.length + 1,
            comment: this.comment,
          })
          .then(() => {
            //post処理が終わったら画面を進める
            this.e1 = 4;
          });
      } else {
        const ticket = {
          plan_id: this.selected_plan.id,
          name: this.name,
          switch_name: this.switchName,
          number_of_times: 1,
          order: this.participants.length + 1,
          comment: this.comment,
        };
        console.log(ticket);
        this.axios.post(`${this.url}/tickets`, ticket).then(() => {
          //post処理が終わったら画面を進める
          this.e1 = 4;
        });
      }
    },
  },
};
</script>
