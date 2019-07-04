<template>
  <div class="pd-panel-block">
    <el-row>
      <el-col :span="24" class="pd-panel-block-title"> {{title}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="pd-panel-block-content">
          <el-tag
              v-for="tag in tags"
              :key="tag.value"
              class="pd-panel-block-tag"
              closable
              @close="handleClose(tag)">
            {{tag.label}}
          </el-tag>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      tags: Array,
    },
    methods: {
      handleClose: function (tag) {
        /*this.tags.splice(this.tags.indexOf(tag), 1);*/
        this.$emit('tagRemove', tag);
      }
    }
  }
</script>

<style scoped>
  .pd-panel-block {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    /*border-color: #ddd;*/
  }

  .pd-panel-block-title {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
  }

  .pd-panel-block-content {
    padding: 5px 10px;
    min-height: 80px;
    /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);*/
  }

  .pd-panel-block-tag {
    margin-right: 5px;
  }
</style>