<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          対戦管理画面
        </h1>
        <v-btn @click="getParticipant()">
          テスト
        </v-btn>
        <v-btn
          :disabled="prevParticipants == participants"
          @click="changeOrder()"
        >
          更新
        </v-btn>
        <p class="subheading font-weight-regular">
          このページから順番の変更などを行えます
        </p>
        <p>{{ prevParticipants }}</p>
        <p>{{ participants }}</p>
      </v-col>
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
            {{ p.Name }}
          </v-card-title>
          <v-card-text class="feed-body">
            <ul class="feed-items">
              <li class="feed-list">{{ p.Order }}ばんめ</li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined rounded text>
              削除
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
      prevParticipants: [],
      items: [
        { id: 9, name: "name01" },
        { id: 2, name: "name02" },
        { id: 3, name: "name03" },
        { id: 4, name: "name04" },
        { id: 1, name: "name05" },
      ],
    };
  },
  methods: {
    getParticipant() {
      this.participants = [];
      this.axios
        .get(`https://rokko-festival-server.herokuapp.com/book/all`)
        .then((response) => {
          // console.log(Object.entries(response.data)[0][1]);
          // console.log(typeof this.participants);
          Object.entries(response.data).forEach((elem) => {
            this.participants.push(elem[1]);
            this.prevParticipants.push(elem[1]);
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
    changeOrder() {
      this.participants.forEach((elem, index) => {
        this.axios.put(
          `https://rokko-festival-server.herokuapp.com/book/${
            elem.Name
          }/${index + 1}`
        );
      });
    },
    delete(person) {
      this.axios.put(
        `https://rokko-festival-server.herokuapp.com/book/${elem.Name}/${index +
          1}`
      );
    },
  },
};
</script>
