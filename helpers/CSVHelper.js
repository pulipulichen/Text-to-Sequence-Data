let CSVHelper = {
  arrayToCSVString: function (headings, ary) {
    let output = []
    
    output.push(headings.join(','))
    
    ary.forEach(item => {
      if (Array.isArray(item)) {
        item = item.map(field => {
          if (typeof(field) !== 'string') {
            return field
          }
          
          if (field.indexOf('"') > -1) {
            field = field.split('"').join('\\"')
            field = `"${field}"`
          }
          else if (field.indexOf("'") > -1) {
            field = `"${field}"`
          }
          return field
        })
        output.push(item.join(','))
      }
      else {
        output.push(item)
      }
    })
    
    return output.join('\n')
  },
  arrayToCSVTable: function (headings, ary) {
    
  }
}

window.CSVHelper = CSVHelper