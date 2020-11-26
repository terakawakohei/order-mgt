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
            <strong>
              本日何回目の対戦予約かを入力してください
            </strong>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col class="">
            <span class="text-caption">
              2回目以降は、初めて参加される方が優先されます
            </span>
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
          <v-btn
            rounded
            large
            color="primary"
            :disabled="!inputData.numberOfTimes"
            @click="e1 = 2"
          >
            次へすすむ
            <v-icon class="ml-2" dark>
              mdi-arrow-right-bold
            </v-icon>
          </v-btn>
        </v-row>

        <v-row justify="end">
          <v-btn outlined text class="mr-3" @click="close()">
            予約をやめる
          </v-btn>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="2">
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
              v-model="inputData.name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="10" md="8" lg="4" xl="3" class="mb-4">
            <v-text-field
              v-model="inputData.switchName"
              label="使用するスイッチの名前（専用部屋に入った時に表示される自分の名前）"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-btn
            rounded
            class="white--text"
            large
            color="orange"
            :disabled="!inputData.name"
            @click="e1 = 3"
          >
            予約する
            <v-icon class="ml-2">
              mdi-lead-pencil
            </v-icon>
          </v-btn>
        </v-row>
        <v-row justify="end">
          <v-btn outlined text class="mr-3" @click="e1 = 1">
            戻る
          </v-btn>
        </v-row>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-row class="text-center">
          <v-col class="">
            <strong>予約完了</strong>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            あなたは{{}}ばんめに予約されました。
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            およそ{{}}分後に順番が回ってきます。それまでお待ちください！
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-btn outlined text class="mr-3" @click="book()">
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
      numberOfTimes: null,
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
