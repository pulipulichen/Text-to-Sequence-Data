let VueHelper = {
  /**
   * 從localStorage掛載
   * @param {Object} vue "this" from Vue
   * @param {String} key data key
   */
  mount: function (vue, key) {
    if (Array.isArray(key)) {
      key.forEach(k => {
        this.mount(vue, k)
      })
      return
    }
    
    if (localStorage.getItem(key)) {
      try {
        vue[key] = localStorage.getItem(key)
      } catch(e) {
        console.trace('error: ' + e)
        localStorage.removeItem(key);
      }
    }
    return this
  },
  /**
   * 從localStorage讀取
   * @param {Object} vue "this" from Vue
   * @param {String} key data key
   */
  persist: function (vue, key) {
    if (Array.isArray(key)) {
      key.forEach(k => {
        this.persist(vue, k)
      })
      return this
    }
    
    localStorage.setItem(key, vue[key])
    return this
  }
}
window.VueHelper = VueHelper