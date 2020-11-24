<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          対戦管理画面
        </h1>

        <p class="subheading font-weight-regular">
          このページから順番の変更などを行えます
        </p>
      </v-col>
    </v-row>

    <draggable :options="options" element="v-row" class="justify-center">
      <v-col v-for="item in items" :key="item.id">
        <v-card style="overflow:scroll;">
          <v-card-title>
            {{ item.name }}
          </v-card-title>
          <v-card-text class="feed-body">
            <ul class="feed-items">
              <li class="feed-list">
                aaaa
              </li>
            </ul>
          </v-card-text>
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
      items: [
        { id: 1, name: "name01" },
        { id: 2, name: "name02" },
        { id: 3, name: "name03" },
        { id: 4, name: "name04" },
        { id: 5, name: "name05" },
      ],
    };
  },
  methods: {},
};
</script>
