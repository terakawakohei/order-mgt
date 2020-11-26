<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          対戦予約受付
        </h1>
        <v-sheet
          cols="12"
          sm="12"
          md="12"
          lg="12"
          xl="12"
          height="150"
          rounded="xl"
          elevation="7"
          class="mx-auto"
        >
          <v-row class="text-center">
            <v-col class="">
              対戦を希望の方はこちらから予約をお願いします
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-btn color="success" @click.stop="dialog = true">
              開く
            </v-btn>
            <v-dialog v-model="dialog">
              <Registration v-on:clickClose="close" />
            </v-dialog>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
    <v-timeline align-top dense>
      <v-timeline-item class="">
        <v-row class="pt-1">
          <v-col cols="3">
            <strong>1st</strong>
          </v-col>
          <v-col>
            <strong>おだやかじんせい</strong>
            <div class="caption">
              おだやか
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-row class="justify-center">
        <v-col
          cols="12"
          sm="12"
          md="12"
          lg="12"
          xl="12"
          v-for="(item, index) in items"
          :key="item.id"
        >
          <v-timeline-item small class="">
            <v-row class="pt-1">
              <v-col cols="3">
                <strong>{{ index + 1 }}st</strong>
              </v-col>
              <v-col>
                <strong>{{ item.name }}</strong>
                <div class="caption">
                  {{ item.switchName }}:{{ item.numberOfTimes }}回め
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-col>
      </v-row>
    </v-timeline>
  </v-container>
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
      dialog: false,
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
    };
  },
  methods: {
    close() {
      this.dialog = false;
    },
  },
};
</script>
