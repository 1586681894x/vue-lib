
export default {}.install = (Vue, options = {}) => {
  // auto
  function autoHeight(el){
    return ()=>{
      //console.log('resize',el)
      if(el && el.getRootNode().nodeName == '#document'){
        let h = el.offsetHeight - 55 + el.offsetValue;
        el.firstChild.style.height = `${h}px`;
      }
    }
  }


  Vue.directive('tableHeight', {
    bind(el,binding ) {
      el.offsetValue = Number(binding.value) || 0;
      el.autoHeight = autoHeight.exe = autoHeight(el);
    },
    inserted: function(el,binding){ //console.log('inserted',el)
      _.delay(()=>{ autoHeight.exe() },300)
      window.addEventListener('resize',autoHeight.exe)
    },
    componentUpdated: function(el,binding){ //console.log('componentUpdated',el)
      //window.addEventListener('resize',autoHeight.exe)
    },
    unbind: function(el,binding){ //console.log('unbind',el)
      window.removeEventListener('resize',autoHeight.exe)
    }
  })
}
