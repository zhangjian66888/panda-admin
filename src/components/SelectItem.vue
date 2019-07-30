<script>
  import _util from '@/assets/js/util';

  function staticSelectItem(obj, type, all = false) {
    _util.requestGet(obj,
      "/panda/core/selectItem/static", {"type": type, "all": all},
      (data) => {
        obj[type + 's'] = data;
      });
  }

  function businessLineSelectItem(obj, all = false) {
    _util.requestGet(obj,
      "/panda/core/selectItem/businessLine", {"all": all},
      (data) => {
        obj.businessLines = data;
      });
  }

  function appSelectItem(obj, params = {}, all = false) {
    _util.requestGet(obj,
      "/panda/core/selectItem/app", {"all": all, ...params},
      (data) => {
        obj.apps = data;
      });
  }

  function envSelectItem(obj, all = false) {
    _util.requestGet(obj,
      "/panda/core/selectItem/env", {"all": all},
      (data) => {
        obj.envs = data;
      });
  }

  function groupSelectItem(obj, params = {}, all = false) {
    _util.requestGet(obj,
      "/panda/core/selectItem/group", {"all": all, ...params},
      (data) => {
        obj.groups = data;
      });
  }


  export default {
    staticSelectItem,
    businessLineSelectItem,
    appSelectItem,
    envSelectItem,
    groupSelectItem,
  }
</script>
