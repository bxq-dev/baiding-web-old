<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else v-show="!isChildActived()">

      <div class="block content">
        <div class="title">
          <h1>{{itemInfo.current.subject}}</h1>
          <div class="talk-info">
            <div class="author-info">
              <img
                class="avatar avatar-round avatar-25"
                :src="itemInfo.course.speaker && itemInfo.course.speaker.coverUrl || '/assets/img/zaojiu-logo.jpg'"
                alt="发布人头像"
              >
              <span
                class="nick">{{itemInfo.course.speaker && itemInfo.course.speaker.subject ? itemInfo.course.speaker.subject : '造就'}}</span>
            </div>

            <time>{{itemInfo.current.publishAtParsed.format('YYYY年MM月DD日')}}</time>
          </div>
        </div>

        <div class="article article-content" v-html="itemInfo.current.content"></div>

      </div>

      <div id="comments" class="comments block" v-if="showComment">
        <h2>评论</h2>

        <div v-if="comments">
          <div class="comment" v-for="comment in comments" :key="comment.id">
            <div class="header" v-once>
              <div class="author-info">
                <img class="avatar avatar-round avatar-25" :src="comment.user?comment.user.avatar:''" alt="用户头像">
                <span class="nick">{{comment.user?comment.user.nick:''}}</span>
                <time>{{comment.createdAtParsed.format('MM月DD日 HH:mm')}}</time>
              </div>
            </div>
            <!-- 不要换行，避免出现换行符 -->
            <div class="comment-content" v-once>
              <div class="quote" v-if="comment.parent"><span class="nick">{{comment.parent.user.nick}}:</span>{{comment.parent.content}}
              </div>
              <div>{{comment.content}}</div>
            </div>
          </div>
        </div>

        <bd-loading class="comment-loading" v-if="isCommentLoading"></bd-loading>
        <error class="comment-error" v-else-if="isCommentError" @retry="fetchComments()"></error>
        <div class="no-comments" v-else-if="!comments.length"><i class="bi bi-no-comment"></i> 暂无评论</div>
        <div class="no-more-comments" v-else-if="isCommentOnLatest">到底咯~</div>
        <div class="more-comments" v-else @click="fetchComments()">加载更多评论</div>
        <div ref="bottom"></div>
      </div>
      <footer class="tool-bar"
              ref="toolBar"
              v-if="showComment"
              :class="{'footer-show': isToolbarShow,'footer-hide': !isToolbarShow}">
        <div class="icon" @click="togglePraise()" :class="{'active': isPraised}">
          <div class="font-content"><i class="bi bi-new-praise"></i></div>
          <div>
            <span>点赞 <!--隐藏数量{{itemInfo.current.praisedTotal}}--></span>
          </div>
        </div>
        <div class="icon" @click="goComment">
          <div class="font-content"><i class="bi bi-new-comment"></i></div>
          <div><span>评论 <!--隐藏数量{{itemInfo.current.commentTotal}}--></span></div>
        </div>
      </footer>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    overflow: hidden;
  }

  .main {
    position: relative;
    height: 100vh;
    overflow: auto;
    background-color: $color-gray5;

    .tool-bar {
      position: fixed;
      width: 100%;
      max-width: 1024px;
      bottom: 0;
      display: flex;
      height: 50px;
      background-color: rgb(10, 10, 23);
      display: -webkit-box;
      display: -ms-flexbox;
      z-index: 1;
      margin: 0 auto;

      .icon {
        flex: 1;
        line-height: 1em;
        font-size: $font-size-14;
        color: $color-w;
        display: flex;
        flex-direction: column;
        div {
          text-align: center;
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          span {
            font-size: 12px;
          }
        }
        .font-content {
          flex: 3;
          font-size: 20px;
        }

        &.active {
          color: $color-brand;
        }

        .bi {
          margin-top: 3px;
        }

        .bi-praise {
          font-size: $font-size-18;
        }

        .bi-favorite {
          font-size: $font-size-18;
        }

        .bi-comment2 {
          font-size: $font-size-16;
        }
      }

      .view {
        flex-grow: 1;

        .bi {
          font-size: 16px;
        }
      }
    }

    .block {
      box-shadow: 0 2px 2px rgb(236, 236, 236);
      margin-bottom: 3px;
      background-color: $color-w;
    }

    .content {
      padding: 20px 0;
    }

    .title {
      padding: 0 20px 30px;

      h1 {
        font-size: 24px;
        line-height: 1.25em;
        color: $color-dark-gray;
        padding-bottom: 15px;
        font-weight: 500;
        word-break: break-all;
      }

      .talk-info {
        display: flex;
        align-items: center;
        overflow: hidden;

        .author-info {
          flex-grow: 1;
          overflow: hidden;
          display: flex;
          align-items: center;

          .avatar {
            flex-shrink: 0;
            margin-right: 5px;
          }

          .nick {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            color: $color-dark-gray;
            line-height: 1em;
          }
        }

        time {
          font-size: 14px;
          color: rgb(144, 144, 144);
          line-height: 1em;
        }
      }
    }

    .article {
      margin: 0 20px;
    }

    .info {
      margin-top: 14px;
      padding: 12px;

      ul {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        li {
          display: flex;
          align-items: center;
          font-size: 17px;
          line-height: 1em;
          color: $color-dark-gray;

          &:last-child {
            &:after {
              display: none;
            }
          }

          &:after {
            margin-left: 6px;
            margin-right: 6px;
            content: ">";
            font-size: 20px;
          }
        }
      }

      .tags {
        display: flex;
        flex-wrap: wrap;

        small {
          flex-shrink: 0;
          min-width: 48px;
          padding: 9px 18px;
          margin-right: 10px;
          margin-top: 10px;
          border-radius: 4px;
          font-size: 12px;
          background-color: rgb(239, 239, 239);
          color: $color-dark-gray;
          line-height: 1em;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .comments {
      padding: 15px 15px 65px 15px;
      box-shadow: none;
      margin-bottom: 0;

      h2 {
        font-size: 18px;
        line-height: 1em;
        color: $color-dark-gray;
        font-weight: normal;
      }

      .comment {
        margin-top: 20px;

        .header {
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-bottom: 6px;

          .author-info {
            flex-grow: 1;
            display: flex;
            align-items: center;
            overflow: hidden;

            .avatar {
              flex-shrink: 0;
              margin-right: 6px;
            }

            .nick {
              font-size: 14px;
              color: $color-dark-gray;
              line-height: 1em;
              font-weight: bold;
            }

            time {
              margin-left: 10px;
              flex-shrink: 0;
              font-size: 12px;
              color: rgb(144, 144, 144);
              line-height: 1em;
            }
          }

          .reply {
            line-height: 1em;
            padding: 5px;
            font-size: 12px;
            color: $color-gray;

            .bi-reply-comment {
              margin-right: 5px;
            }
          }
        }

        .comment-content {
          margin-left: 31px;
          font-size: 14px;
          color: $color-dark-gray;
          line-height: 1.57em;
          white-space: pre-wrap;
          word-break: break-all;

          .quote {
            background-color: rgb(237, 237, 237);
            padding: 10px;
            margin-bottom: 6px;
            white-space: pre-wrap;
            word-break: break-all;

            .nick {
              font-weight: bold;
              margin-right: 6px;
            }
          }
        }
      }

      .no-comments, .more-comments, .comment-loading, .comment-error, .no-more-comments {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        .bi-no-comment {
          font-size: 16px;
          margin-right: 8px;
        }
      }

      .no-comments, .no-more-comments {
        color: $color-gray;
      }

      .no-comments {
        font-size: 16px;
      }

      .more-comments {
        color: $color-dark-gray;
        font-size: 14px;
      }
    }

    .payment {
      position: fixed;
      width: 100%;
      max-width: 1024px;
      bottom: 0;
      background-color: $color-w;
      display: flex;

      .button {
        border-radius: 0;
        height: 50px;
        line-height: 50px;
      }

      .button-primary {
        flex-grow: 1;
      }

      .button-outline {
        width: 40%;
      }
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getCourseItemDetail, praise, unpraise} from '../../shared/api/course.api';
  import {CourseItemDetail, CourseItemCommentModel} from "../../shared/api/course.model";
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {setTitle} from '../../shared/utils/title';
  import {listComments} from '../../shared/api/course.api';
  import {UserInfoModel} from '../../shared/api/user.model';

  const COMMENT_COUNT = 20;

  @Component({})
  export default class ContentComponent extends Vue {
    id = '';
    originY = 0;
    coverUrl = '';
    defaultCoverUrl = '/assets/img/default-cover.jpg';
    itemInfo = new CourseItemDetail({});
    isLoading = false;
    isError = false;
    isPraised = false;
    isComment = false;
    isChangeItem = true;
    isFavorited = false;

    comments: CourseItemCommentModel[] = [];
    isCommentLoading = false;
    isCommentError = false;
    isCommentOnLatest = false;

    userInfo: UserInfoModel;
    isToolbarShow = false;
    marker = '';
    showComment = false;

    created() {
      this.itemChanged();
    }

    destroyed() {
    }


    @Watch('$route')
    itemChanged() {
      this.id = this.$route.params['id'];
      this.initData();
      if (this.isChangeItem) {
        this.isChangeItem = false;
        this.initComments(false);
      } else {
        this.initComments(true);
      }
    }

    async initData() {

      this.isLoading = true;
      this.isError = false;

      try {
        this.itemInfo = await getCourseItemDetail(this.id);
        this.isPraised = this.itemInfo.current.currentUserInfo.praised;
      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isLoading = false;
      }
      this.coverUrl = this.itemInfo.current.cover169Url;
      if (!this.isChildActived()) setTitle(this.itemInfo.current.subject);
    }

    async initComments(needScroll: boolean) {
      if (this.showComment){
        return;
      }
      this.comments = [];
      await this.fetchComments();
      if (needScroll) {
        (this.$refs['bottom'] as HTMLElement).scrollIntoView(true);
      }
    }

    async fetchComments() {
      this.isCommentLoading = true;
      this.isCommentError = false;

      // try {
      //   const lastMarker = this.marker;
      //   const commentsData = await listComments(this.id, COMMENT_COUNT, lastMarker);
      //   const comments = commentsData.comments;
      //   this.marker = commentsData.marker;
      //   this.isCommentOnLatest = !this.marker;
      //   this.comments.push(...comments);
      // } catch (e) {
      //   this.isCommentError = true;
      //   throw e;
      // } finally {
      //   this.isCommentLoading = false;
      // }
    }


    async togglePraise() {
      let oldStatus = this.isPraised;
      try {
        this.isPraised = !this.isPraised;
        this.itemInfo.current.praisedTotal = oldStatus ? this.itemInfo.current.praisedTotal - 1 : this.itemInfo.current.praisedTotal + 1;
        const promise = (!oldStatus) ? praise(this.id) : unpraise(this.id);
        await promise;
      } catch (e) {
      }
    }

    goComment(id: string, nick: string, content: string) {

      this.userInfo = getUserInfoCache(true);

      const query: { [key: string]: string } = {title: encodeURIComponent(this.itemInfo.current.subject)};

      if (id && nick && content) {
        query['request'] = encodeURIComponent(JSON.stringify({
          id: id,
          nick: nick,
          content: content,
          originalPage: 'item'
        }));
      } else {
        query['request'] = encodeURIComponent(JSON.stringify({
          originalPage: 'item'
        }));
      }

      this.$router.push({path: `/app_course/item/${this.id}/post-comment`, query: query});
    }

    isChildActived() {
      return this.$router.currentRoute.name !== 'appCourseItem.main';
    }

  }
</script>
