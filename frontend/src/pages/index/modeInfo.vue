<template>
	<div class="contain" v-loader="loading" data-loader-label="加载中，请稍后..." data-loader-background="rgba(16,16,16,.8)">
      <breads :bread="bread"></breads> 
	    <div class="doc-row">
            <div class="doc-row__body">
                <table class="nv-table nv-table--striped">
                    <thead>
                        <tr>
                          <th v-for="(item, index) in tableConfig.ths" :key="index"><div class="nv-table__cell" @click="sorts(item, item.sort.status)"><span>{{item.name}}</span><span v-if="item.sort" class="sort-span"><i :class="{'nv-icon-caret-top': true, 'black_i': item.sort.status == 1}" ></i><i :class="{'nv-icon-caret-bottom': true, 'black_i': item.sort.status == -1}"></i></span></div></th>
                        </tr>  
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableConfig.list" :key='index'>
                            <td><div class="nv-table__cell">{{item._id | getMode}}</div></td>
                            <td><div class="nv-table__cell">{{item.count}}</div></td>
                            <td><div class="nv-table__cell">{{item.userNum}}</div></td>
                        </tr>
                    </tbody>    
                </table>
                <div class="page">
                <nv-pagination :total="tableConfig.total" :index="tableConfig.currentPage" :limit='tableConfig.limit' layout="total,sizes,prev,pager,next" @change="changes"></nv-pagination>            
                </div>  
            </div>
        </div>    
	</div>
</template>
<script>
import tables from '@/components/table.vue'
import breads from '@/components/breadCrumb.vue'
import bus from '../../../unitl/bus.js'
import trackInfo from '../../../unitl/track-info.js'
export default {
  name: 'modeInfo',
  components:{
    tables,
    breads
  },
  data () {
    return {
    //   select: {screenList: '屏体列表',
    //      moreSplice: '多屏拼接',
	// 	 convententControl: '快捷方式',
	// 	 screenSet: '屏幕状态控制',
	// 	 brightnessControl: '亮度控制',
	// 	 timedRestart: '定时重启',
	// 	 receiveCardConfig: '接收卡配置',
	// 	 videoControl: '视频控制',
	// 	 screenInfo: '终端信息',
	// 	 pro_: '编辑节目',
	// 	 advancedSet: '高级设置',
	// 	 netSet: '网络设置',
	// 	 monitor: '监控',
	// 	 playManage: '播放管理',
	// 	 cloundCtr: '远程管理',
	// 	 system_: '系统设置'
    //     },
      bread: [ //面包屑
        {name: '首页', url: '/'},
        {name: '模块信息'}
      ],
      list: '',
      id: '',
      loading: true,
      tableConfig: {
        ths:[
          {name: '功能模块'}, //0代表未排序 1代表升序 -1 代表降序
          {name: '用户使用总量',  sort: {type: 'count', status: -1}},
          {name: '模块使用用户数'},
        ],
        list: [],
        currentPage: 1,
        limit: 100,
        total: 1,
      }
    }
  },
  created() {
    this.loading = false;
    this.getList();
  },
  methods:{
   	getList(isdownLoad){
     this.loading = true
     let sort =this.tableConfig.ths.filter((item) => {return item.sort && item.sort.status != 0 })[0].sort;
  		this.$axios({method: 'post',
        url: 'api/users/modeInfo',
        data: {
          currentPage: this.tableConfig.currentPage,
          limit: this.tableConfig.limit,
          sort: {[sort.type]: sort.status},
          isdownLoad: isdownLoad,
        }}).then(res=>{
        if (!isdownLoad) {
           this.tableConfig.list = res.data.data
            this.tableConfig.total = +res.data.total;
            this.tableConfig.currentPage = +res.data.currentPage;
        } else { 
            setTimeout(function() {
            bus.$emit('readyData', {data: res.data.data, title: ['功能模块','用户使用总量', '模块使用用户数'] , isnotTime: true})
            }, 100) 
        }
       this.loading = false;
  		}).catch(err=>{
  			console.log(err)
  		})
    },
    changes(index, limit, pages) {
      this.tableConfig.currentPage = +index
      this.tableConfig.limit = +limit
      this.getList();
    },
    sorts(item, val) {
      this.tableConfig.ths.forEach((items, index) => {
          if (items.sort) { //如果存在排序+
             if (item.name == items.name) { //
               this.tableConfig.ths[index].sort.status = val == 1? -1 : 1
             } else {
               this.tableConfig.ths[index].sort.status = 0
             }
          }
      });
      this.getList();
    },
  },
  filters: {
       getMode(val) {
           return trackInfo[val];
       }  
   },
    beforeDestroy() {
     bus.$off('exportData')
   },
   mounted() {
    bus.$on('exportData', () => {
        this.getList(true);
    })
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.contain{
    width: 100%;
    min-height: calc(100vh - 56px);
    padding: 20px;
}
.page{
    float: right
}
 .doc-row__body{
     overflow: hidden
 }
 th{
   .nv-table__cell {
     display: flex !important;
     flex-flow: row !important;
     cursor: pointer;
     align-items: center !important;
     justify-content: flex-start !important;
     .sort-span{
         display: flex;
         flex-flow: column;
         margin-left: 5px;
         i{
             font-size: 9px;
             color: #ccc
         }
         .black_i{
             color: #000;
         }
     }
   }

 }
</style>

