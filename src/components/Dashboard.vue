<template>
    <main id="dashboard" class="has-header-offset">
        <section class="dash">
          <div class="grid-lg">
            <div class="dash__grid">
              <aside class="dash__aside">
                <div class="profile">
                  <header class="profile__header">
                    <h5 class="profile__title">{{ userProfile.name }}</h5>
                    <p class="profile__user-title">{{ userProfile.title }}</p>
                  </header>
                  <div class="create-post">
                    <p>create a post</p>
                    <form @submit.prevent>
                      <label class="create-post__label">Post Title</label>
                      <input v-model.trim="post.title"></input>
                      <br/>
                      <label class="create-post__label">Post Content</label>
                      <textarea v-model.trim="post.content"></textarea>
                      <br />
                      <button
                        @click="createPost"
                        :disabled="post.content == ''"
                        class="btn is-block"
                        >post
                      </button>
                    </form>
                  </div>
                </div>
              </aside>
              <div class="dash__main">
                <transition name="fade">
                  <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
                    <p>
                      Click to show <span class="new-posts">{{ hiddenPosts.length }}</span>
                      new <span v-if="hiddenPosts.length > 1">posts</span><span v-else>post</span>
                    </p>
                  </div>
                </transition>
                <div v-if="posts.length">
                  <article v-for="post in posts" class="post">
                    <h1 class="post__title">{{ post.title }}</h1>
                    <div class="post__metas">
                      <span>Posted by </span>
                      <span class="post__author">{{ post.userName }}</span>
                      <span class="post__date">{{ post.createdOn | formatDate }}</span>
                    </div>
                    <div class="post__content">
                      <p>{{ post.content | trimLength }}</p>
                    </div>
                    <footer class="post__footer">
                      <ul class="post__footer-metas">
                        <li><a @click="openCommentModal(post)">comments {{ post.comments }}</a></li>
                        <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a></li>
                        <li><a @click="viewPost(post)">view full post</a></li>
                      </ul>
                    </footer>
                  </article>
                </div>
                <div v-else>
                  <p class="no-results">There are currently no posts</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- comment modal -->
        <transition name="fade">
          <div v-if="showCommentModal" class="c-modal">
            <div class="c-container">
              <a @click="closeCommentModal">X</a>
              <p>add a comment</p>
              <form @submit.prevent>
                <textarea v-model.trim="comment.content"></textarea>
                <button @click="addComment" :disabled="comment.content == ''" class="button">add comment</button>
              </form>
            </div>
          </div>
        </transition>

        <!-- post modal -->
        <transition name="fade">
          <div v-if="showPostModal" class="p-modal">
            <div class="p-container">
              <a @click="closePostModal" class="close">X</a>
              <article class="post">
                <h5>{{ fullPost.userName }}</h5>
                <span>{{ fullPost.createdOn | formatDate }}</span>
                <h1>{{ fullPost.title }}</h1>
                <p>{{ fullPost.content }}</p>
                <ul>
                  <li><a>comments {{ fullPost.comments }}</a></li>
                  <li><a>likes {{ fullPost.likes }}</a></li>
                </ul>
              </article>
              <div v-show="postComments.length" class="comments">
                <div v-for="comment in postComments" class="comment">
                  <p>{{ comment.userName }}</p>
                  <span>{{ comment.createdOn | formatDate }}</span>
                  <p>{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
    </main>
</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    const fb = require('../firebaseConfig.js')

    export default {
      data() {
        return {
          post: {
            title: '',
            content: ''
          },
          comment: {
            postId: '',
            userId: '',
            content: '',
            postComments: 0
          },
          showCommentModal: false,
          showPostModal: false,
          fullPost: {},
          postComments: []
        }
      },
      computed: {
        ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts'])
      },
      methods: {
        createPost() {
          fb.postsCollection.add({
              createdOn: new Date(),
              title: this.post.title,
              content: this.post.content,
              userId: this.currentUser.uid,
              userName: this.userProfile.name,
              comments: 0,
              likes: 0
          }).then(ref => {
              this.post.title = '',
              this.post.content = ''
          }).catch(err => {
              console.log(err)
          })
        },
        showNewPosts() {
          let updatedPostsArray = this.hiddenPosts.concat(this.posts)
          // clear hiddenPosts array and update posts array
          this.$store.commit('setHiddenPosts', null)
          this.$store.commit('setPosts', updatedPostsArray)
        },
        openCommentModal(post) {
          this.comment.postId = post.id
          this.comment.userId = post.userId
          this.comment.postComments = post.comments
          this.showCommentModal = true
        },
        closeCommentModal() {
          this.comment.postId = ''
          this.comment.userId = ''
          this.comment.content = ''
          this.showCommentModal = false
        },
        addComment() {
          let postId = this.comment.postId
          let postComments = this.comment.postComments

          fb.commentsCollection.add({
            createdOn: new Date(),
            content: this.comment.content,
            postId: postId,
            userId: this.currentUser.uid,
            userName: this.userProfile.name
          }).then(doc => {
            fb.postsCollection.doc(postId).update({
              comments: postComments + 1
            }).then(() => {
              this.closeCommentModal()
            })
          }).catch(err => {
            console.log(err)
          })
        },
        likePost(postId, postLikes) {
          let docId = `${this.currentUser.uid}_${postId}`

          fb.likesCollection.doc(docId).get().then(doc => {
            if (doc.exists) { return }

            fb.likesCollection.doc(docId).set({
              postId: postId,
              userId: this.currentUser.uid
            }).then(() => {
              // update post likes
              fb.postsCollection.doc(postId).update({
                likes: postLikes + 1
              })
            })
          }).catch(err => {
            console.log(err)
          })
        },
        viewPost(post) {
          fb.commentsCollection.where('postId', '==', post.id).get().then(docs => {
            let commentsArray = []

            docs.forEach(doc => {
              let comment = doc.data()
              comment.id = doc.id
              commentsArray.push(comment)
            })

            this.postComments = commentsArray
            this.fullPost = post
            this.showPostModal = true
          }).catch(err => {
            console.log(err)
          })
        },
        closePostModal() {
          this.postComments = []
          this.showPostModal = false
        }
    },
    filters: {
      formatDate(val) {
        if (!val) { return '-' }
        let date = val.toDate()
        return moment(date).fromNow()
      },
      trimLength(val) {
        if (val.length < 200) { return val }
        return `${val.substring(0, 200)}...`
      }
    }
  }
</script>


<style lang="scss">
@import '../assets/scss/config';

  .post {
    &__title {
      display: block;
      margin-bottom: $pad-xxs;
      font-size: $font-xl;
    }

    &__metas {
      display: block;
      margin-bottom: $pad-xs;
      color: $color-grey-mid;
      font-size: $font-sm;
      text-transform: none;
    }

    &__author{
      color: $color-alpha;
    }

    &__content {
      display: block;
      padding: $pad-xs 0;

      p {
        font-size: 1.1em;
      }
    }

    &__footer {
      display: block;
      padding: $pad-sm 0 $pad-xs;

      a {
        font-size: 1.1em;
      }
      ul {
        list-style: none;
        margin: 1rem 0 0;
        padding: 0;

        li {
          display: inline-block;
          margin-right: 1em;
        }
      }
    }
  }

  .profile {
    &__header {
      display: block;
      margin-bottom: $pad-sm;
    }

    &__title {
      font-size: $font-med
    }
  }
</style>
