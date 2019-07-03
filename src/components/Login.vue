<template>
  <section class="login" id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <div class="login__grid">
      <div class="login__col is-bg">
        <header class="login__header">
          <h1 class="login__title">VueGram on Fire!</h1>
        </header>
      </div>
      <div class="login__col">
        <div class="login__main">
          <div :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
            <form v-if="showLoginForm" @submit.prevent>
              <h1 class="signup-form__title">Welcome Back</h1>

              <label class="signup-form__label" for="email1">Email</label>
              <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />
              <br />
              <label class="signup-form__label" for="password1">Password</label>
              <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />
              <br />
              <button @click="login" class="btn">Log In</button>

              <div class="signup-form__extras extras">
                  <a @click="togglePasswordReset">Forgot Password</a>
                  <a @click="toggleForm">Create an Account</a>
              </div>
            </form>
            <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                <h1 class="signup-form__title">Get Started</h1>

                <label class="signup-form__label" for="name">Name</label>
                <input v-model.trim="signupForm.name" type="text" placeholder="Savvy Apps" id="name" />

                <label class="signup-form__label" for="title">Title</label>
                <input v-model.trim="signupForm.title" type="text" placeholder="Company" id="title" />

                <label class="signup-form__label" for="email2">Email</label>
                <input v-model.trim="signupForm.email" type="text" placeholder="you@email.com" id="email2" />

                <label class="signup-form__label" for="password2">Password</label>
                <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="password2" />

                <button @click="signup" class="btn">Sign Up</button>

                <div class="signup-form__extras extras">
                    <a @click="toggleForm">Back to Log In</a>
                </div>
            </form>
            <form v-if="showForgotPassword" @submit.prevent class="password-reset">
              <div v-if="!passwordResetSuccess">
                <h1 class="signup-form__title">Reset Password</h1>
                <p>We will send you an email to reset your password</p>

                <label class="signup-form__label" for="email3">Email</label>
                <input v-model.trim="passwordForm.email" type="text" placeholder="you@email.com" id="email3" />

                <button @click="resetPassword" class="btn">Submit</button>

                <div class="signup-form__extras extras">
                    <a @click="togglePasswordReset">Back to Log In</a>
                </div>
              </div>
              <div v-else>
                <h1 class="signup-form__title">Email Sent</h1>
                <p>check your email for a link to reset your password</p>
                <button @click="togglePasswordReset" class="btn">Back to login</button>
              </div>
            </form>
            <transition name="fade">
              <div v-if="errorMsg !== ''" class="error-msg">
                <p>{{ errorMsg }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const fb = require('../firebaseConfig.js')

export default {
    data() {
        return {
            loginForm: {
                email: '',
                password: ''
            },
            signupForm: {
                name: '',
                title: '',
                email: '',
                password: ''
            },
            passwordForm: {
                email: ''
            },
            showLoginForm: true,
            showForgotPassword: false,
            passwordResetSuccess: false,
            performingRequest: false,
            errorMsg: ''
        }
    },
    methods: {
        toggleForm() {
            this.errorMsg = ''
            this.showLoginForm = !this.showLoginForm
        },
        togglePasswordReset() {
            if (this.showForgotPassword) {
                this.showLoginForm = true
                this.showForgotPassword = false
                this.passwordResetSuccess = false
            } else {
                this.showLoginForm = false
                this.showForgotPassword = true
            }
        },
        login() {
            this.performingRequest = true

            // if (user && !user.uid) user = user.user

            fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
                this.$store.commit('setCurrentUser', user)
                this.$store.dispatch('fetchUserProfile')
                this.performingRequest = false
                this.$router.push('/dashboard')
            }).catch(err => {
                console.log(err)
                this.performingRequest = false
                this.errorMsg = err.message
            })
        },
        signup() {
            this.performingRequest = true

            fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                this.$store.commit('setCurrentUser', user.user)

                // create user obj
                fb.usersCollection.doc(user.uid).set({
                    name: this.signupForm.name,
                    title: this.signupForm.title
                }).then(() => {
                    this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false
                    this.$router.push('/dashboard')
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            }).catch(err => {
                console.log(err)
                this.performingRequest = false
                this.errorMsg = err.message
            })
        },
        resetPassword() {
            this.performingRequest = true

            fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                this.performingRequest = false
                this.passwordResetSuccess = true
                this.passwordForm.email = ''
            }).catch(err => {
                console.log(err)
                this.performingRequest = false
                this.errorMsg = err.message
            })
        }
    }
}
</script>
<style lang="scss">
@import '../assets/scss/config';
@import '../assets/scss/tools';

.login {
  position: relative;
  height: 100vh;
  width: 100%;

  &__grid {
    display: flex;

    @media (min-width: $mq-med) {
      height: 100vh;
    }
  }

  &__col {
    display: flex;
    align-items: center;
    background-color: $color-white;
    @include flex-col(100%,50%)
  }

  &__col.is-bg {
    background-color: $color-alpha;
  }

  &__header, &__main {
    max-width: 90%;
    min-width: 70%;
    margin: 0 auto;
  }

  &__title {
    font-size: $font-xl;
    text-align: center;
    color: $color-white;

  }
  &__subtitle {
    color: rgba($color-white, 0.7)
  }
}

.signup-form {
  &__title {
    margin-bottom: $pad-xs;
    font-size: $font-xl
  }
  &__label {
    display: block;
    margin-bottom: 0.2em;
    font-size: $font-med
  }
  &__extras {
    padding:$pad-sm 0;

    a {
      margin-right: 0.5em;
    }
  }
}
</style>
