<script>
  import _util from '../assets/js/util';

  function businessLineSelectItem(obj, all = false) {
    _util.requestGet(obj,
      "/panda/core/businessline/selectItem", {"all": all},
      (data) => {
        obj.businessLines = data;
      });
  }

  export default {
    businessLineSelectItem
  }

</script>
