<template>
  <div class="container">

    <div v-if="isLoading" style="background-color: #fff;width: 100%;height: 100vh;position: fixed;top: 0;left: 0;z-index: 99999999;">
      <bd-loading class="abs-center" ></bd-loading>
    </div>
    <app-download-tips
      class="app-download-tips"
      v-if="isAppDownloadTipsShow"
      @close="isAppDownloadTipsShow = false"
    ></app-download-tips>
      <div class="top_info">

        <div class="con_info">
          <h3>#{{titItem}}</h3>
          <p class="fans"><i>{{favourite}}</i>粉丝</p>
         <div class="swiper-lab" v-show="tabs=='undefined'">
           <div class="width_auto" id="lab">
             <i
               v-for="(item,index) in tabs" class="tab" @click="getItem(item,item.id)"
              >#{{item.name}}</i>
           </div>
         </div>
          <span class="follow" @click="cliFollw()" :class="{yesFollow:!follow}">{{followTxt}}</span>
        </div>
      </div>
    <div class="content">
      <div class="items_tab">
        <div class="tabs" id="tab">
          <i
            v-for="(item,index) in tabsT" class="tab"
            :class="{active:index == num}"
            @click="tab(index,item.type,false)">{{item.name}}{{item.num}}</i>
        </div>
      </div>
      <div class="item_list" v-show=" num == 0">

        <div class="item" v-for="(item,index) in videoList" @click="enter(item.resourceId,0)">
          <div class="item_img item_img_a">
          <img class="cover" :src="item.image" alt="">
            <span></span>
          </div>
          <p>{{item.title}}</p>
          <div class="user">
            <img :src="item.speakerImage" alt="">
            <span class="user">{{item.speakerName}}</span>
          </div>
          <div class="laud" :class="{laudY:item.isFavourite==1}"  @click="like(item.resourceId,index)">
            <span>{{item.favourite}}</span>
          </div>

        </div>
      </div>

      <div class="item_list_video" v-show=" num == 1">
        <div class="item2" v-for="item in courseList" @click="enter(item.id,true)">
          <img :src="item.image" alt="">
          <div class="title">
            <h3>{{item.subject}}</h3>
            <p>{{item.speakerName}}</p>
            <span>{{(item.originalPrice)/100}}元 / 会员价{{(item.discountPrice)/100}}元</span>
          </div>
        </div>
      </div>

      <div class="item_list_video" v-show=" num == 2">
        <div class="item2" v-for="item in bookList" @click="enter(item.id,true)">
          <img :src="item.image" alt="">
          <div class="title">
            <h3>{{item.subject}}</h3>
            <p>{{item.speakerName}}</p>
            <span>{{(item.originalPrice)/100}}元 / 会员价{{(item.discountPrice)/100}}元</span>
          </div>
        </div>

      </div>
    </div>
    <div v-if="isVideo && num==0" class="noList">暂无相关短视频</div>
    <div v-if="isVideoLong && num==1" class="noList">暂无相关视频</div>
    <div v-if="isCourse && num==2" class="noList">暂无相关课程</div>
    <div v-if="isBook && num==3" class="noList">暂无相关听书</div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import jquery from 'jquery';
  import {listCourses,listCourses2} from '../../../shared/api/course.api';
  import {Course} from '../../../shared/api/course.model';
  import axios from 'axios';
  import {host} from "../../../env/environment";
  import {getUserInfoCache,getFollow,getLike} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model';
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from "../../../shared/utils/share";
  import {isInApp, isInWechat, isInWeiBo} from "../../../shared/utils/utils";
  import appDownloadTips from '../../../shared/app-download-tips.comp.vue';
  declare var $:any
  @Component({
    components: {
      appDownloadTips: appDownloadTips
    }
  })
  export default class EventListComponent extends Vue {
    userInfo: UserInfoModel | null = null;
    num=0;
    isLoading = true;
    titItem="";
    follow=true;
    followTxt='关注';

    videoList:any=[];//视频
    videoLongList:any=[];//视频
    courseList:any=[];//课程
    bookList:any=[];//听书

    isVideo=true;//是否有视频
    isVideoLong=true;//是否视频
    isCourse=true;//是否有课程
    isBook = true;//是否有听书
    data=[];//标签信息
    tabs=[];//标签关联标签信息
    pageIndex=0;//页码
    tabsT=[{'name':'短视频','num':0,'type':'200'},{'name':'视频','num':0,'type':'121'},{'name':'课程','num':0,'type':'120'},{'name':'听书','num':0,'type':'210'}];//标签资源类型与数量
    labelId='';//标签id
    labelType=[];//资源类型
    favourite=0;//粉丝
    id='1';
    likeVideo:any=[];//喜欢集合
    activeType=200;//当前类型
    pageSize=10;//
    dataLength=1;
    shareTitle='';
    isAppDownloadTipsShow = false;
    created() {

      if (!isInApp) {
        this.isAppDownloadTipsShow = true;
      }
      axios.defaults.withCredentials = true; //让ajax携带cookie

      this.initT();
      let _this = this;
      $(document).scroll(
        function() {
          if ($(document).scrollTop() + window.innerHeight == $(document).height()) {
            console.log(_this.videoList);
            if(_this.dataLength<_this.pageSize){
             return;
            }else{
              _this.pageIndex++;
              _this.tab(_this.num,_this.activeType,true);

            }


          }
        });
    }
    mounted() {

    }

    //获取标签数据
    initT(){

      this.id = this.$route.params['id'];
      let $this = this;
         //标签信息
         axios.get(`${host.io}/api/zj/tag/relateTags/`+$this.id).then(res=>{
           $this.data = res.data.results;
           let _data:any = $this.data;
           $this.tabs = _data.tags;
           console.log($this.tabs);
           this.favourite= res.data.results.favourite;
           this.titItem = res.data.results.name;
           $this.labelId = _data.Id;
           this.shareTitle = res.data.results.titItem;
           document.title=this.titItem +'-主页';
           //是否关注标签
           if(res.data.results.isAttention==1){
             this.follow=false;
             this.followTxt='已关注';
           }

         }).then(data =>{
           //标签相关资源
           //api/zj/tag/tagsResources/123
           axios.get(`${host.io}/api/zj/tag/tagsResources/`+$this.id).then(res=>{
             console.log(res.data.results)
             let type = res.data.results;
             for (let i=0;i<type.length;i++){
               if(type[i].type=='200'){
                 $this.tabsT[0].num = type[i].num
               }else if(type[i].type=='120') {
                 $this.tabsT[1].num = type[i].num
               }else if(type[i].type=='210'){
                 $this.tabsT[2].num = type[i].num
               }
             }



         }).then(data=>{
             //类型资源
             //api/zj/tag/tagResourceList/{id}?type=12
             //http://io.zaojiu.fm/api/zj/tag/tagResourceList/1?type=12
             axios.get(`${host.io}/api/zj/tag/tagResourceList/${$this.id}?type=200&pageSize=${this.pageSize}&pageIndex=0`).then(res=>{
               //res.data.results;
               this.dataLength = res.data.results.items.length;
               let data:any = res.data.results.items;
               $this.videoList=res.data.results.items;

               if(this.videoList != undefined){
                 $this.isVideo = false;
                 for (let i =0;i<data.length;i++){
                   this.likeVideo.push(data[i].isFavourite);//喜欢短视频集合(0,1)
                 }

               }

               this.isLoading = false;
             })
           })
         }).catch(err=>{
           console.log(err);
         })
      document.title = this.titItem;
    }
    //关注与取消
   async cliFollw(){
      this.userInfo =await getUserInfoCache();//获取用户信息
     try {
       await getFollow(this.$route.params['id'],0,this.follow);
       this.follow= !this.follow;
       if(this.follow){
         this.followTxt = '关注';
         this.favourite = this.favourite-1;
       }else{
         this.followTxt = '已关注';
         this.favourite = this.favourite+1;
       }
     }catch (e) {

     }
  }
    //短视频喜欢
    like(id:any,index:any){
      console.log(this.likeVideo);
      let isLike:any;
      if(this.likeVideo[index]==0){
        isLike = true;
      }else{
        isLike = false;
      }
      if(isLike==true){
        getLike(id,200,isLike);
        $('.laud').eq(index).addClass('laudY');

        this.likeVideo[index]=1;
      }else{
        getLike(id,200,isLike);
        $('.laud').eq(index).removeClass('laudY');
        let txt:any=$('.laud').eq(index).text();
        let likeNum =parseInt(txt);
        $('.laud').eq(index).text(likeNum-1);
        this.likeVideo[index]=0;
      }
    }


    getItem(item:any,id:any){
      this.titItem = item.name;
      this.$router.push({path: '/app/labelAd/'+id})
      this.initT();

    }

    //跳转详情
    enter(id:any,type:any){
      if(type==0){
        this.$router.push({path: `/items/smallVideo/${id}`})
      }else if(type==1){
        this.$router.push({path: `/items/video/${id}`})
      }else if(type==2){
        this.$router.push({path: `/app/course/${id}/cover`})
      }else if(type==3){
        this.$router.push({path: `/book/detail/${id}`})
      }

    }
    //切换 下标 类型 是否加载下一页
    tab(index:any,type:any,page:boolean) {
     if(!page){
        this.pageIndex=0;
     }
      this.num = index;
      this.activeType=type;//类型

      axios.get(`${host.io}/api/zj/tag/tagResourceList/${this.id}?type=${type}&pageSize=${this.pageSize}&pageIndex=${this.pageIndex}`).then(res=>{
        let data =res.data.results.items;
        this.dataLength = res.data.results.items.length;
        if(this.num==0){
          if(this.videoList != undefined){
            if(this.pageIndex==0){
              this.videoList=[];
            }
            for (let i =0;i<data.length;i++){
              this.videoList.push(data[i]);
            }
            this.isVideo = false;
          }
        }else if(this.num==1){
          if(this.videoLongList != undefined){
            if(this.pageIndex==0){
              this.videoLongList=[];
            }
            for (let i =0;i<data.length;i++){
              this.videoLongList.push(data[i]);
            }
            this.isVideoLong = false;
          }

        }else if(this.num==2){

          if(this.courseList != undefined){
            if(this.pageIndex==0){
              this.courseList=[];
            }
            for (let i =0;i<data.length;i++){
              this.courseList.push(data[i]);
            }
            this.isCourse = false;
          }
        }else if(this.num==3){
          if(this.bookList != undefined){
            if(this.pageIndex==0){
              this.bookList=[];
            }
            for (let i =0;i<data.length;i++){
              this.bookList.push(data[i]);
            }
            this.isBook = false;
          }

        }
      })
    }
    //分享
    async share() {

      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/app/UserAd/` + this.$route.params['id'];
        let title = this.shareTitle;

        setShareInfo(
          title,
          'www.zaojiu.com',
          'https://baiding-pub.zaojiu.com/zaojiuUNI@3x.png',
          url
        );
      }
    }

  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    padding: 10px 16px;
    .noList{
      position: fixed;
      top: 50%;
      left: 0;
      width: 100%; text-align: center;
      color: rgb(179,179,179);
      font-weight: 700;
      font-size: 16px;
      height: 50px;
      line-height: 50px;
      margin-top: -25px;
    }
    .top_info{
      margin: 12px 0 32px 0;
      img{
        width: 64px;
        height: 64px;
        border-radius: 50%;
        float: left;
      }
      .con_info{
        position: relative;
        h3{
          font-size: 20px;
          line-height: 24px;
          color: rgb(85,85,85);
          width: 191px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          margin: 8px 0 5px 0;
        }
        .fans{
          font-size: 12px;
          line-height: 16px;
          color: rgb(179,179,179);
          font-weight: 700;
          i{
            font-size: 14px;
            color: rgb(85,85,85);
            font-style: normal;
            font-weight: 700;
            margin-right: 4px;
          }
        }
        .swiper-lab{
          margin-top: 13px;
          overflow: auto;
          .width_auto{

            i{

              font-size: 12px;
              color: rgb(179,179,179);
              padding-right: 16px;
              font-weight: 700;
              font-style: normal;
            }
          }


        }
        .summary{
          margin: 8px 0 0 0;
          font-size: 12px;
          line-height: 18px;
          color: rgb(179,179,179);
        }
        ._hidden{
          height: 54px;
          overflow: hidden;
          position: relative;
          .shadow{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 18px;
            background: linear-gradient(to top, rgba(255,255,255,0.7) 0%,rgba(255,255,255,0) 100%);
            background-repeat: repeat-x;
          }
        }
        .follow{
          position: absolute;
          top: 5px;
          right: 5px;
          display: block;
          width: 56px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background-color: $color-brand;
          font-size: 12px;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
        }
        .yesFollow{
          background-color: rgb(239,239,239);
          color: rgb(179,179,179);
        }
      }
    }
    ::-webkit-scrollbar {
      display: none;
    }
    .content{
      .items_tab{
        width: 100%;
        overflow-x: scroll;
      .tabs{
       width: 100%;
        margin-bottom: 22px;
        .tab{
          font-size: 12px;
          padding: 6px 12px;
          margin-right: 8px;
          display: inline-block;
          color: rgb(178,178,178);
          font-weight: 700;
          font-style: normal;
        }
        .active{
          color: rgb(85,85,85);
          background-color: rgb(239,239,239);
          border-radius: 14px;
        }
      }
      }
    }
    .item_list{
      column-count: 2;
      .item{
        width: 98%;
        overflow: hidden;
        margin-bottom: 30px;
        break-inside: avoid;
        .item_img{
          position: relative;
          font-size: 0;

          overflow: hidden;
          .cover{
            width: 100%;
            height: 100%;
            border-radius: 4px;
            object-fit: cover;
          }
          span{
            position: absolute;
            top: 6px;
            right: 6px;
            display:block;
            width: 16px;
            height: 16px;
            background: url("assets/playImg.png") no-repeat center;
            background-size: 16px;
          }
        }
        .item_img_g{
          padding-top: 125%;
        }

        p{
          margin: 8px 0;
          font-size: 12px;
          color: rgb(85,85,85);
          font-weight: 700;
          line-height: 17px;
        }
        .user{
          float: left;
          img{
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            float: left;
            margin-right: 4px;
            object-fit: cover;
          }
          span{
            font-size: 12px;
            color: rgb(166,166,166);
            font-weight: 700;
            -webkit-transform : scale(0.84,0.84) ;
            *font-size:10px;
          }
        }
        .laud{
          float: right;
          font-size: 9px;
          color: rgb(179,179,179);
          padding-left: 15px;
          background: url("assets/groupN.png") no-repeat ;
          background-size: 12px 12px;
          background-position: left center;
          span{
            font-size: 12px;
            color: rgb(166,166,166);
            font-weight: 600;
            -webkit-transform : scale(0.84,0.84);
            *font-size:10px;

          }
        }
        .laudY{
          background: url("assets/groupY.png") no-repeat ;
          background-size: 12px 12px;
          background-position: left center;
        }

      }
      .item:nth-child(2n){
      }
    }
    .item_list_video{
      .item2 {
        margin-bottom: 28px;
        overflow: hidden;
        img {
          width: 80px;
          height: 113px;
          float: left;
          border-radius: 4px;
          object-fit: cover;
        }
        .title {
          margin-left: 92px;
          height: 113px;
          position: relative;
          h3 {
            font-size: 16px;
            color: rgb(85, 85, 85);
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          p {
            font-size: 12px;
            color: rgb(179, 179, 179);
            line-height: 14px;
            margin-top: 5px;
            font-weight: 700;
          }
          span {
            position: absolute;
            left: 0;
            bottom: 3px;
            color: rgb(85, 85, 85);
            font-size: 12px;
            line-height: 16px;
            font-weight: 700;
          }
        }
      }
    }

  }
</style>
