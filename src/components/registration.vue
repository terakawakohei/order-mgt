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
              以下の企画への参加申請を行います
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
              getParticipated();
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
            <v-btn
              :disabled="firstTime"
              outlined
              text
              class="mr-3"
              @click="isFirstTime(true)"
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
                :items="participated"
                return-object
              />
            </v-col>
          </v-row>
        </template>

        <v-row justify="center">
          <v-btn
            rounded
            large
            color="indigo lighten-3"
            :disabled="!selected_ticket && !name"
            @click="e1 = 3"
            class="white--text"
          >
            次へすすむ
            <v-icon class="ml-2" dark>
              mdi-arrow-right-bold
            </v-icon>
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
          <v-col>
            youtubeアカウント名:{{ name }}、switchアカウント名:{{
              switchName
            }}で予約をします。
          </v-col>
        </v-row>
        <v-row v-else class="text-center">
          <v-col>
            youtubeアカウント名:
            <strong>
              {{ selected_ticket.name }}
            </strong>
            、switchアカウント名:
            <strong> {{ selected_ticket.switch_name }} </strong>で予約をします。
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            キャラリクエスト・ステージ希望などありましたらお書きください！
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <v-textarea v-model="comment" solo></v-textarea>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-btn
            rounded
            large
            color="indigo lighten-3"
            @click="book()"
            class="white--text"
          >
            予約する
            <v-icon class="ml-2" dark>
              mdi-arrow-right-bold
            </v-icon>
          </v-btn>
        </v-row>
        <v-row justify="end">
          <v-btn outlined text class="mr-3 py-7" @click="e1 = 2">
            戻る
          </v-btn>
        </v-row>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-row class="text-center">
          <v-col class="">
            <strong>予約完了！</strong>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            あなたは<span class="font-weight-bold">{{ this.queueNum + 1 }}</span
            >ばんめに予約されました。
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            およそ<span class="font-weight-bold">{{
              (this.queueNum + 1) * 3
            }}</span
            >分後に順番が回ってきます。それまでお待ちください！
          </v-col>
        </v-row>

        <v-row justify="center" class="my-7">
          <v-btn
            rounded
            large
            color="indigo lighten-3"
            @click="finishBook()"
            class="white--text"
          >
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
    queueNum: Number,
    comment: "",

    plans: [],
    participated: [],
    selected_plan: null,
    selected_ticket: null,
    firstTime: null,
    url: "https://order-mgt-api.herokuapp.com",
    // url: "http://localhost:3000",

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
      //DBにある企画(plans)を全取得
      this.plans = [];
      this.axios.get(`${this.url}/plans`).then((response) => {
        this.plans = response.data;
      });
    },

    getParticipated() {
      //selected_planに応じて、その企画の参加者のうちすでに参加を終えて終了済みとなっている者を取得

      //selected_planのidと一致、かつ削除ずみ（すでに参加して試合が終わっている）のticketを全取得
      this.participated = [];
      this.axios.get(`${this.url}/tickets`).then((response) => {
        for (let t of response.data) {
          if (t.plan_id == this.selected_plan.id && t.deleted_at != null) {
            this.participated.push(t);
          }
        }
        //待ち行列の数は、企画参加者全員から試合終了済みの数を引く
        this.queueNum = response.data.length - this.participated.length;
      });
    },

    isFirstTime(bool) {
      //初回入力（firstTime）なのかどうかを切り替え、入力欄のデータを消去
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

      this.participated = [];
      this.close();
    },

    book() {
      //データをDBにpostし、予約完了する

      if (this.selected_ticket) {
        //2回目の申請なら
        //論理削除から復帰させる
        this.axios
          .patch(
            `${this.url}/tickets/${this.selected_ticket.id}/ticket_restore`
          )
          .then(() => {
            const ticket = {
              plan_id: this.selected_plan.id,
              name: this.selected_ticket.name,
              switch_name: this.selected_ticket.switch_name,
              number_of_times: this.selected_ticket.number_of_times + 1,
              order: this.queueNum + 1,
              comment: this.comment,
              deleted_at: null,
            };

            this.axios
              .put(`${this.url}/tickets/${this.selected_ticket.id}`, ticket)
              .then(() => {
                //post処理が終わったら画面を進める
                this.e1 = 4;
              });
          });
      } else {
        const ticket = {
          plan_id: this.selected_plan.id,
          name: this.name,
          switch_name: this.switchName,
          number_of_times: 1,
          order: this.queueNum + 1,
          comment: this.comment,
          deleted_at: null,
        };

        this.axios.post(`${this.url}/tickets`, ticket).then(() => {
          //post処理が終わったら画面を進める
          this.e1 = 4;
        });
      }
    },
  },
};
</script>
