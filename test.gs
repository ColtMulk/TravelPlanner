function myFunction() {

  var url = "";
  var image = UrlFetchApp.fetch(url).getBlob();
  
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  body.clear();
  
  body.appendImage(image);
}
