
<template>
    <div class="doc-row">
        <div class="doc-row__body">
            <table class="nv-table nv-table--striped">
                <thead>
                    <tr>
                       <th v-for="(item, index) in tableConfig.ths" :key="index"><div class="nv-table__cell" @click="sort(item)"><span>{{item.name}}</span><span v-if="item.sort" class="sort-span"><i :class="{'nv-icon-caret-top': true, 'black_i': item.sort.status == 1}" ></i><i :class="{'nv-icon-caret-bottom': true, 'black_i': item.sort.status == -1}"></i></span></div></th>
                    </tr>  
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableConfig.list" :key='index'>
                        <td><div class="nv-table__cell  links" ><a target="_blank" :href="item._id | gethr">{{item._id}}</a></div></td>
                        <td><div class="nv-table__cell">{{item.phone_type}}</div></td>
                        <td><div class="nv-table__cell">{{item.phone_version}}</div></td>
                        <td><div class="nv-table__cell">{{item.node}}</div></td>
                        <td><div class="nv-table__cell">{{item.phone_position}}</div></td>
                        <td><div class="nv-table__cell">{{item.time | getTime}}</div></td>
                        <td><div class="nv-table__cell">{{item.count}}</div></td>
                    </tr>
                </tbody>    
            </table>
            <div class="page">
               <nv-pagination :total="tableConfig.total" :index="tableConfig.currentPage" :limit='tableConfig.limit' layout="total,sizes,prev,pager,next" @change="onPageChange"></nv-pagination>            
            </div>  
        </div>
    </div>  
</template>
<script>
export default {
   name: 'tables',
   props:{
        tableConfig: {
            type: Object,
            default: {},
		}
   },
   computed: {
       
   },
   mounted() {

    //    console.log(this.tableConfig)
   },
   data() {
       return {
         hr: ''
       }
   },
   methods: {
    onPageChange(index, limit, pages) { //当前页 每页显示条数 总共多少页
        console.log(index,limit, pages)
        this.$emit('changes', {index: index, limit: limit, pages: pages})
    },
    sort(item) {
      this.$emit('sorts', item, item.sort.status)
    },
    hr(id) { 
        return '#/clickInfo/' + id; 
    },
     clickInfo(id) {
        this.$router.push({
          path: `/clickInfo/${id}`,
        })
    }
   },
   filters: {
       getTime(val) {
          var s = '';
          var d = new Date(+val)
          var mouth = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1));
            var day = d.getDate() >= 10 ? d.getDate() : ('0'+d.getDate());
            var hours = d.getHours() >= 10 ? d.getHours() : ('0' + d.getHours());
            var min = d.getMinutes() >= 10 ? d.getMinutes() : ('0' + d.getMinutes());
            var sec =  d.getSeconds() >= 10 ? d.getSeconds() : ('0' + d.getSeconds());
            s += d.getFullYear() + '-'; // 获取年份。
            s += mouth + "-"; // 获取月份。
            s += day; // 获取日。
            s += (' ' + hours + ':' + min  + ':' + sec);
            return (s); // 返回日期。
       },
        gethr(id) {
         return '#/clickInfo/' + id; 
       }    
   }
}
</script>


<style lang="less">
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
 .links{
     cursor: pointer;
    color: #5196f2;
 }
 
</style>

