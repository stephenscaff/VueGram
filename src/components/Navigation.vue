<template>
  <header class="app-header">
    <div class="app-header__grid">
      <router-link to="dashboard" class="app-header__brand">Nuesie</router-link>
      <nav class="app-header__tool is-right">
        <nav class="app-header__nav">
          <router-link to="dashboard" class="app-header__nav-link">Dashboard</router-link>
          <router-link to="settings" class="app-header__nav-link">Settings</router-link>
          <a @click="logout" class="app-header__link is-logout">Logout</a>
        </nav>
      </nav>
    </div>
  </header>
</template>

<script>
    const fb = require('../firebaseConfig.js')

    export default {
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss">
@import '../assets/scss/config';

.app-header {
  z-index: 9;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  height: $header-height-sm;
  width: 100%;
  color: $color-alpha;
  background-color: #fff;
  transition: background-color 0.2s ease;

  @media (min-width: $mq-med) {
    height: $header-height-lg;
  }

  &.is-fixed {
    position: fixed;
    height: $header-height-sm;
    background-color: $color-white;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1);
    animation: fade-down 0.5s ease;

    .menu-is-open & {
      background-color: $color-trans;
      box-shadow: none;
      transition: background-color 0.4s ease;
    }

    .menu-is-closing & {
      transition-delay: background-color 0.4s 0.4s ease;
    }
  }

  &__grid {
    display: flex;
    align-items: center;
    max-width: 95%;
    width: 95%;
    margin: 0 auto;
  }

  &__brand {
    position: relative;
    left: 0;
    right: 0;
    width: 3em;
    margin-right: auto;
    color: $color-grey-dark;
    font-size: 1.1em;
    font-weight: 700;

    svg path {
      fill: $color-alpha;
    }
  }

  &__nav {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-left: auto;
    color: $color-grey-dark;
    font-weight: 400;

    a {
      margin-left: 1em;
      color: $color-alpha;
    }
  }

  &__avatar-img {
    width: 2em;
    border-radius: 100%;

    @media (min-width: $mq-med) {
      width: 2.75em;
    }
  }
}

</style>
