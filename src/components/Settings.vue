<template>
  <main class="has-header-offset">
    <section class="settings" id="settings">
      <div class="settings__box">
        <header class="settings__header">
          <h3 class="settings__title">Settings</h3>
          <p class="settings__text">Update your profile slowmie</p>
        </header>

        <transition name="fade">
          <p v-if="showSuccess" class="success">profile updated</p>
        </transition>

        <form @submit.prevent>
          <label class="settings__label" for="name">Name</label>
          <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />
          <br />
          <label class="settings__label" for="title">Job Title</label>
          <input v-model.trim="title" type="text" :placeholder="userProfile.title" id="title" />
          <br />
          <button @click="updateProfile" class="btn">Update Profile</button>
        </form>
      </div>
    </section>
  </main>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                name: '',
                title: '',
                showSuccess: false
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        methods: {
            updateProfile() {
                this.$store.dispatch('updateProfile', {
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    title: this.title !== '' ? this.title : this.userProfile.title
                })

                this.name = ''
                this.title = ''

                this.showSuccess = true

                setTimeout(() => { this.showSuccess = false }, 2000)
            }
        }
    }
</script>

<style lang="scss">
@import '../assets/scss/config';

.settings {
  position: relative;
  padding: $pad 0;

  &__header {
    position: relative;
    margin-bottom: $pad-sm;
  }

  &__box {
    position: relative;
    padding: $pad-sm;
    margin: 0 auto;
    max-width: 40em;
    background-color: $color-white;
    box-shadow: 0px 0px 2em .1em rgba(0,0,0,0.05);
  }

  &__title {
    font-size: $font-lg;
  }

  &__label {
    display: block;
    margin-bottom: 0.5em;
    font-size: $font-base;
  }
}

.success {
  color: $color-alpha;
  margin: 0.5rem 0 -2rem;
}

</style>
