/* global JSZipUtils */

let DownloadHelper = {
  downloadAsFile: function (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  },
  downloadAsHTMLFile: function (filename, content) {
    let title = filename
    if (title.indexOf('.') > -1) {
      title = title.slice(0, title.lastIndexOf('.')).trim()
    }
    
    let template = `<html>
  <head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    ${content}
  </body>
</html>`
    this.downloadAsFile(filename, template)
  },
  downloadFilesAsZip: function (filename, fileList, isAppendNumber) {

    /*
     fileList = [
     'https://lh3.googleusercontent.com/-no5awyU-ECs/VwtrrkPby_I/AAAAAAACuy0/hLILLVeBR8Y/s72-c/image_thumb%25255B16%25255D.png?imgmax=800',
     'http://lh6.ggpht.com/_yr4MQB4zDus/SSpR8qv9T4I/AAAAAAAAFCI/N6uBek4uy14/s72-c/image_thumb.png?imgmax=800',
     'https://lh3.googleusercontent.com/-0I1XB48chf0/WRF1OPkzeYI/AAAAAAADKzg/65fcQz8Og3MB_USXXSgloj37a02kfvOQACHM/s72-c/image_thumb%255B6%255D?imgmax=800',
     ]*/

    if (typeof (JSZipUtils) === 'undefined') {
      console.log('JSZipUtils is not loaded')
      return false
    }
    if (Array.isArray(fileList) === false) {
      console.log('fileList is not Array')
      return false
    }

    if (typeof (isAppendNumber) !== 'boolean') {
      isAppendNumber = true
    }

    console.log('prepare files: ' + fileList.length + ' files...')

    let zip = new JSZip();

    let loop = (i) => {
      if (i < fileList.length) {

        let url = fileList[i]


        let fileName = url
        if (fileName.lastIndexOf('/') > 0) {
          fileName = fileName.slice(fileName.lastIndexOf('/') + 1)
        }
        if (fileName.indexOf('?') > 0) {
          fileName = fileName.slice(0, fileName.indexOf('?'))
        }
        if (fileName.indexOf('.') === -1) {
          fileName = fileName + '.png'
        }

        console.log('start download file ' + (i + 1) + '/' + fileList.length + ' ' + fileName + ': ' + url)

        if (isAppendNumber === true) {
          fileName = (i + 1) + '-' + fileName
        }

        JSZipUtils.getBinaryContent(url, (err, data) => {
          if (err) {
            console.log('Problem happened when download img ' + (i + 1) + '/' + fileList.length + ': ' + url)
            loop(i)
            return false
          } else {
            zip.file(fileName, data, {binary: true});
            //deferred.resolve(zip);
          }

          setTimeout(() => {
            i++
            loop(i)
          }, 10)
        });
      } else {
        var generateOptions = {type: "blob",
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
        };

        zip.generateAsync(generateOptions).then(function (content) {
          saveAs(content, filename + '.zip');
          console.log('download finish: ' + filename + '.zip')
        });
      }
    }

    loop(0)
  },
  downloadByURL: function (filename, url) {

    if (typeof(filename) !== 'string') {
      filename = url.slice(url.lastIndexOf('/') + 1)
    }
  
    let link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete link;
  },
  downlaod: function (filename, content) {
    let blob = new Blob([content])
    saveAs(blob, filename)
  },
  
}

window.DownloadHelper = DownloadHelper

