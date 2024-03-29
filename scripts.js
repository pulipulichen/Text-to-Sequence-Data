/* global VueHelper, Vue, DownloadHelper, UploadHelper */
Vue.config.productionTip = false

let app = {
  el: '#app',
  data: {
    input: '',
    fileType: 'ods',
    uploadFilename: '',
    configExportColHeaders: ['id', 'seq', 'events'],
    configMountData: ['fileType'],
    configLoadData: './data.txt',
    configWidgetName: 'Text2Seq'
  },
  mounted() {
    VueHelper.mount(this, this.configMountData)
  },
  computed: {
    output: function () {
      return TextToSequenceData(this.input, {
        'subSep': ' '
      })
    },
    outputContent: function () {
      return CSVHelper.arrayToCSVString(this.configExportColHeaders, this.output)
    },
    outputTitle: function () {
      if (typeof(this.uploadFilename) !== 'string' 
              || this.uploadFilename.trim() === '') {
        return this.configWidgetName + '-' + DateHelper.getCurrentTimeString()
      }
      else {
        return this.uploadFilename
      }
    }
  },
  created: function () {
    $(this.$refs.modal).find('.ui.dropdown').dropdown()
    
    // 載入檔案
    if (typeof(this.configLoadData) === 'string') {
      $.get(this.configLoadData, (data) => {
        this.input = data
      })
    }
    
    UploadHelper.initDropUpload((filename, content) => {
      this.upload(filename, content)
    })
  },
  methods: {
    persist: function () {
      VueHelper.persist(this, this.configMountData)
    },
    reset: function () {
      this.input = ''
    },
    copy: function () {
      ClipboardHelper.copyRichFormat(this.output)
    },
    triggerUpload: function (e) {
      UploadHelper.triggerUpload(e)
    },
    upload: function (filename, content) {
      if (typeof(filename) === 'object') {
        UploadHelper.upload(filename, true, (filename, content) => {
          this.upload(filename, content)
        })
      }
      else {
        this.input = content
        this.uploadFilename = filename
      }
    },
    download: function () {
      let filetypeExt = this.fileType
      
      let filename = this.outputTitle + '.' + filetypeExt
      
      if (filetypeExt === 'csv') {
        DownloadHelper.downloadAsFile(filename, this.outputContent)
      }
      else if (filetypeExt === 'html') {
        let html = CSVHelper.arrayToCSVTableHTML(this.output)
        DownloadHelper.downloadAsHTMLFile(filename, html)
      }
      else if (filetypeExt === 'ods') {
        
        let data = {}
        data[this.outputTitle] = []
        let fieldList = this.configExportColHeaders
        this.output.forEach((row) => {
          let line = {}
          row.forEach((col, i) => {
            let fieldName = fieldList[i]
            line[fieldName] = col
          })
          data[this.outputTitle].push(line)
        })
        
        xlsx_helper_ods_download(filename, data)
      }
    }
  }
}

app = new Vue(app)
