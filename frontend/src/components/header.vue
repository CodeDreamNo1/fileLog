<template>
  <header data-loader-label="数据下载中，请稍后..." data-loader-background="rgba(16,16,16,.8)">
      <div class="header">
           <div><a href='/'>Handy埋点数据查询系统</a></div>
           <ul class="mode_info">
             <li ><a href='/#/'>首页</a> </li>
             <li ><a href='/#/modeInfo'>模块信息</a> </li>
             <li ><a href='/#/userUseTime'>用户使用信息</a> </li>
           </ul>   
          <button class="nv-btn nv-btn--primary" @click="exports">导出数据</button>
      </div>
  </header>
</template>

<script>
import bus from '../../unitl/bus.js'
import ex from 'js-export-excel'
export default {
   mounted() {
    let selfs = this;
    let option={};
    bus.$on('readyData', (res) => {   
        if (!res.title > 0) {
            alert('暂无数据')
            return;
          }
          if (!res.isnotTime) {
            res.data.forEach(item => {
                item.time = selfs.getTime(item.time);
            });
          }
          
          option.fileName = 'handy埋点数据'
          option.datas=[
            {
              sheetData: res.data,
              sheetName:'sheet',
              sheetHeader:  res.title,
              columnWidths: [10, 10, 10, 10, 10, 10, 10]
            }
          ];
         
            var toExcel=new ex(option);
            toExcel.saveExcel();
      })
   },
   methods:{
      exports() {
        bus.$emit('exportData')
      },
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
       }
   },
    destoryed() {
     Bus.$off('readyData')
   }
   
}
</script>

<style lang="less">
.header{
      background: rgba(0,0,0,.8);
      font-size: 18px;
      color: white;
      padding: 20px;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      button{
        float: right;
        position: absolute;
        right: 30px;
      }
  }
  .mode_info{
    margin: 0 100px;
    display: flex;
    flex-direction: row;
    li {
      padding: 0 30px;
      list-style: none;
      // background: rgba(255,255,255,.2)
    }
  }
</style>>
