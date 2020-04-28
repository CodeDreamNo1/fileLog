<template>
	<div class="contain" v-loader="loading" data-loader-label="加载中，请稍后..." data-loader-background="rgba(16,16,16,.8)">
      <breads></breads> 
	    <tables @changes='changes' @sorts="sorts" :tableConfig="tableConfig"></tables>  
	</div>
</template>
<script>
import tables from '@/components/table.vue'
import breads from '@/components/breadCrumb.vue'
import bus from '../../../unitl/bus.js'

export default {
  name: 'user',
  components:{
    tables,
    breads
  },
  data () {
    return {
      list: '',
      loading: true,
      tableConfig: {
        ths:[
          {name: '手机串号'},
          {name: '手机型号'},
          {name: '手机系统'},
          {name: '节点'},
          {name: '位置'},
          {name: '更新时间', sort: {type: 'time', status: 0}}, //0代表未排序 1代表升序 -1 代表降序
          {name: '模块使用总量', sort: {type: 'count', status: -1}}
        ],
        list: [],
        currentPage: 1,
        limit: 10,
        total: 1,
      }
    }
  },
  methods:{
   	getList(isdownLoad){
     this.loading = true
     let sort =this.tableConfig.ths.filter((item) => {return item.sort && item.sort.status != 0 })[0].sort;
  		this.$axios({method: 'post',
        url: 'api/users',
        data: {
          currentPage: this.tableConfig.currentPage,
          limit: this.tableConfig.limit,
          sort: {[sort.type]: sort.status},
          isdownLoad: isdownLoad
        }}).then(res=>{
        if (!isdownLoad) {
           this.tableConfig.list = res.data.data
            this.tableConfig.total = +res.data.total;
            this.tableConfig.currentPage = +res.data.currentPage;
        } else {
          setTimeout(function() {
            bus.$emit('readyData', {data: res.data, title: ['手机串号','模块使用总量','位置','手机型号', '手机系统', '节点',  '更新时间']})
          }, 100)
        }
       this.loading = false;
  		}).catch(err=>{
  			console.log(err)
  		})
    },
    changes(val) {
      this.tableConfig.currentPage = +val.index
      this.tableConfig.limit = +val.limit
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
    }
  },
  created(){
    this.getList();
  },
  mounted() {
    bus.$on('exportData', () => {
        this.getList(true);
    })
  },
   beforeDestroy() {
     bus.$off('exportData')
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.contain{
    width: 100%;
    min-height: calc(100vh - 56px);
    padding: 20px;
}
</style>