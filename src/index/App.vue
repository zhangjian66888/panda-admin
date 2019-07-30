<template>
  <div id="app">
    <Index :menusList="menusList"></Index>
  </div>
</template>

<script>
  import Index from '@/components/Index.vue';
  import RouterTable from '@/components/RouterTable.vue';
  import _util from '@/assets/js/util';

  export default {
    data() {
      return {
        menusList: [],
      }
    },
    mounted: function () {
      _util.requestGet(this, '/panda/core/resources', {}, (data) => {
        this.menusList = data.menuItems;
        RouterTable.dynamicRouter(this.menusList.map(item => item.url));
        this.pset(data.permissions);
      });
    },
    components: {
      Index
    }
  };
</script>
<style lang="less">
  body {
    margin: 0px;
  }
</style>
