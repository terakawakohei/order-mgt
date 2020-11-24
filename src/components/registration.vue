<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">
        参加回数
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">
        名前入力
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">
        予約完了
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row class="text-center">
          <v-col class="">
            本日何回目の対戦予約かを入力してください
          </v-col>
        </v-row>
        <v-row justify="center" class="my-5">
          <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
            <v-select
              v-model="inputData.numberOfTimes"
              :items="items"
              item-text="string"
              item-value="number"
              label=""
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-btn rounded large color="primary" @click="e1 = 2">
            次へすすむ
            <v-icon class="ml-2" dark>
              mdi-arrow-right-bold
            </v-icon>
          </v-btn>
        </v-row>

        <v-row justify="end">
          <v-btn outlined text @click="close()">
            予約をやめる
          </v-btn>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-row class="text-center">
          <v-col class="">
            youtubeアカウントの名前と使用するスイッチの名前（専用部屋に表示される名前）を入力してください
          </v-col>
        </v-row>
        <v-row justify="center" class="my-5">
          <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
            <v-text-field
              label="youtubeアカウントの名前（コメント欄に表示される名前）"
              v-model="inputData.name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
            <v-text-field
              v-model="inputData.switchName"
              label="Another input"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-btn
            rounded
            class="white--text"
            large
            color="orange"
            @click="e1 = 3"
          >
            予約する
            <v-icon class="ml-2">
              mdi-lead-pencil
            </v-icon>
          </v-btn>
        </v-row>
        <v-row justify="end">
          <v-btn outlined text @click="e1 = 1">
            戻る
          </v-btn>
        </v-row>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-row class="text-center">
          <v-col class="">
            予約完了
          </v-col>
        </v-row>
        <v-row class="pt-1">
          <v-col cols="3">
            <strong>4番目</strong>
          </v-col>
          <v-col>
            <strong>{{ inputData.name }}</strong>
            <div class="caption">
              {{ inputData.switchName }}
            </div>
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-btn outlined text @click="book()">
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
    inputData: {
      numberOfTimes: Number,
      name: "",
      swichName: "",
    },
    e1: 1,
    select: { string: "1回目", number: 1 },
    items: [
      { string: "1回目", number: 1 },
      { string: "2回目", number: 2 },
      { string: "3回目", number: 3 },
      { string: "4回目", number: 4 },
      { string: "5回目以上", number: 5 },
    ],
  }),
  props: {},
  methods: {
    close() {
      this.$emit("clickClose", this.returnData);
    },
    book() {
      this.e1 = 1;
      this.close();
      console.log(this.e1);
    },
  },
};
</script>
