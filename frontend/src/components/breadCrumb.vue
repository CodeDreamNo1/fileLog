
<template>
<div class="doc-row bread">
    <div class="doc-row__body">
        <ul class="nv-breadcrumb">
            <li v-for="item in bread" :key="item.name" class="nv-breadcrumb__item">
                <a :href="item.url ? item.url : 'javascript:viod(0)'">{{item.name}}</a>
            </li>
        </ul>  
    </div>
</div>
</template>

<script>
export default {
   name: 'breadCrumb',
   props: {
       bread: {
           type: Array,
           default() {
               return [
               {name: '首页', url: '/'}
               ]
           } 
       }
   }
}
</script>

<style lang="less">
.bread{
   padding: 10px;
   display: flex;
   align-items: flex-start;
   li:last-child{
       a{
           color: #b5b7bd !important;
           text-decoration: none;
           cursor: default
       }
   }
}

 
</style>

