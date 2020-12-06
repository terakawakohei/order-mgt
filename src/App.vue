<template>
  <v-app :style="{ background: $vuetify.theme.themes.light.background }">
    <v-row
      :color="$vuetify.theme.themes.light.secondary"
      style="height: auto;"
      justify="center"
      align-content="center"
    >
      <v-col>
        <v-main>
          <router-view />
        </v-main>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
