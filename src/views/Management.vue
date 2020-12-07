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
    <v-row justify="center">
      <v-btn color="orange" class="white--text" @click="changeOrder()"
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
            {{ p.Name }}
          </v-card-title>
          <v-card-text class="feed-body">
            <ul class="feed-items">
              <li class="feed-list">{{ p.Order }}ばんめ</li>
            </ul>
            <ul class="feed-items">
              <li v-if="p.Done == 0" class="feed-list">待ち状態</li>
              <li v-else class="feed-list">終了済み</li>
            </ul>
          </v-card-text>
          <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="p.Done == 0"
              @click="changeDone(p.Name, 1)"
              color="red"
              outlined
              rounded
              text
            >
              終了済みにする
            </v-btn>
            <v-btn
              v-else
              @click="changeDone(p.Name, 0)"
              color="red"
              rounded
              text
            >
              待ち状態にさせる
            </v-btn>
          </v-card-actions> -->
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
      doneParticipants: [],
      items: [
        { id: 9, name: "name01" },
        { id: 2, name: "name02" },
        { id: 3, name: "name03" },
        { id: 4, name: "name04" },
        { id: 1, name: "name05" },
      ],
    };
  },
  created() {
    this.getParticipant();
    this.getDoneParticipant();
  },
  methods: {
    getParticipant() {
      this.participants = [];
      this.axios
        .get(`https://rokko-festival-server.herokuapp.com/book/all`)
        .then((response) => {
          Object.entries(response.data).forEach((elem) => {
            //対戦済みでない人を取得
            if (elem[1].Done == 0) {
              this.participants.push(elem[1]);
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
    getDoneParticipant() {
      this.doneParticipants = [];
      this.axios
        .get(`https://rokko-festival-server.herokuapp.com/book/all`)
        .then((response) => {
          Object.entries(response.data).forEach((elem) => {
            //対戦済みの人を取得
            if (elem[1].Done == 1) {
              this.doneParticipants.push(elem[1]);
              console.log(elem[1]);
            }
          });
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

      this.getParticipant();
    },
    changeDone(name, num) {
      this.axios.put(
        `https://rokko-festival-server.herokuapp.com/book/done/${name}/${num}`
      );
      this.getParticipant();
      this.changeOrder();
      console.log(this.participants);
    },
  },
};
</script>
