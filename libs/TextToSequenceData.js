/**
 * 
 * @param {type} text
 * @param {type} options
 * @returns {Array|TextToSequenceData.output|String}
 */
let TextToSequenceData = function (text, options) {
  
  let loadOption = (key, defaultValue) => {
    if (typeof(options) === 'object' && typeof(options[key]) !== 'undefined') {
      return options[key]
    }
    else {
      return defaultValue
    }
  }
  
  let subSep = loadOption('subSep')
  
  // ----------------------------
  
  let output = []
  
  if (typeof(text) !== 'string') {
    return ''
  }
  
  text.trim().split('\n').forEach((lineString, rowNum) => {
    let id = (rowNum+1)
    lineString = lineString.trim()
    //let outputLine = []
    if (subSep !== undefined) {
      lineString.split(subSep).forEach( (lineSegString, segNum) => {
        id = (rowNum+1) + '_' + (segNum+1)
        lineSegString = lineSegString.trim()
        for (let i = 0; i < lineSegString.length; i++) {
          let char = lineSegString.slice(i, i+1)
          output.push([id, (i+1), char])
        }
      })
    }
    else {
      for (let i = 0; i < lineString.length; i++) {
        let char = lineString.slice(i, i+1)
        output.push([id, (i+1), char])
      }
    }
  })
  
  console.log(output)
  
  return output
}

window.TextToSequenceData = TextToSequenceData