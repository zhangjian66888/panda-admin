<script>
  let permissions = [];
  exports.install = function (Vue, options) {
    Vue.prototype.pset = function (array) {
      permissions = array;
    };
    Vue.prototype.phas = function (value) {
      if (permissions.indexOf("ALL") > -1
        || permissions.indexOf(value) > -1) {
        return true;
      }
      return false;
    }
  }
</script>