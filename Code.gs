

var ui = DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
var status = PropertiesService.getUserProperties();
//opens the ui on the document
function onOpen() {
      // ui = DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    var  menu = ui.createMenu('travel planner');
      menu.addItem('Open Planner', 'openDialog').addToUi();
      menu.addItem('Open Translator', 'openSidebar').addToUi();
      
}
//create the dialog window for the UI
function openDialog() {
  Logger.clear();
    closeSidebar();
    var htmlTemplate  = HtmlService.createTemplateFromFile('Index')
    htmlTemplate  = htmlTemplate .evaluate()
                   .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                   .setWidth(1000)
                   .setHeight(500);
      
      ui.showModalDialog(htmlTemplate , 'Travel Planner');
  
      
     // createHeaders();      
}
//creates the sidebar window these days
function openSidebar() {
  var sidebarTemplate = HtmlService.createTemplateFromFile('Sidebar');
  
  sidebarTemplate = sidebarTemplate.evaluate()
                    .setTitle('Frank the Translator')
                    .setWidth(400);
  
  status.setProperty('sidebar', 'on');
  
  ui.showSidebar(sidebarTemplate);
}
//closing the sidebar when the translator is complete
function closeSidebar() {
  if (status.getProperty('sidebar') != 'off') {
    var html = HtmlService.createHtmlOutput("<script>google.script.host.close();</script>")
               .setTitle('THIS CODE MADE BY THE CHAD CODE GANG');
    ui.showSidebar(html);
    
    status.setProperty('sidebar', 'off');
  }
}


function getLonLat(destination){
 //takes in cityname and state and uses a geolocator to return the latitude and longitude in an array

     var geocode = UrlFetchApp.fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=AIzaSyA9GIyHdHeChd6GzibXThnVaBMW3yfiWSM");
   
    var geoObj = JSON.parse(geocode);
    var lat = geoObj.results[0].geometry.location.lat;
    var lng = geoObj.results[0].geometry.location.lng;
    
    return [lat, lng];
}

function basicNearbySearch(destination, type, opt_keyword){
    //makes a basic nearby search based on input city and state, the type of search (e.g. restaurant) and keyword search
    //then returns as parsed JSON
    var location = getLonLat(destination);
    var lat = location[0];
    var lng = location[1];
    
    var response;
    
    //checks if opt_keyword was entered
    if(opt_keyword == null){
      response = UrlFetchApp.fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&radius=16000&type=" + type + "&key=AIzaSyA9GIyHdHeChd6GzibXThnVaBMW3yfiWSM");
    }
    else{
      var response = UrlFetchApp.fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&radius=16000&type=" + type + "&keyword=" + opt_keyword + "&key=AIzaSyA9GIyHdHeChd6GzibXThnVaBMW3yfiWSM");
    }
  
    Logger.log(response.getContentText());
    
    return JSON.parse(response);
}

function requestPhoto(photoReference){
  //this function calls the google photo api to get an image
     return UrlFetchApp.fetch("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photoReference + "&key=AIzaSyA9GIyHdHeChd6GzibXThnVaBMW3yfiWSM");
}

function detailedSearch(placeID){
  //this function calls the detialed search api to retrieve the link for the website of a place
  var response = UrlFetchApp.fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&key=AIzaSyA9GIyHdHeChd6GzibXThnVaBMW3yfiWSM");
  Logger.log("Detailed Search");
  Logger.log(response.getContentText());
  return JSON.parse(response);
}

function appendLink(body, text, link){
  body.appendParagraph(text).setLinkUrl(link);
}

// #####################################
// 
// BEGIN FORM PROCESSING BLOCK
//
// #####################################
function processForm(formObject) {
 
  
  
                      
  ui.alert("Your information has been submitted, you may now close the window.");
  // To access individual values, you would do the following
  var Destination = formObject.Destination; //grabs by the name of the elements not the id
  var Departure = formObject.Departure; //grabs by the name of the elements not the id
  var Depature_Date = formObject.Depature_Date; //grabs by the name of the elements not the id
  var Return_Date = formObject.Return_Date; //grabs by the name of the elements not the id
  var Class = formObject.Class;

  var Housing_type = formObject.Housing; //cont...
  var adults = formObject.adults;
  var children = formObject.children;

  var priceRange = formObject.HousingPrice;
  
  var category = formObject.category;
  var restaurantType = formObject.restaurantType;
  var Rating = formObject.Rating;
  var foodPrice = formObject.FoodPrice;
  var custom = formObject.foodCustom;

  var activity = formObject.activity;
  var activityTwo = formObject.activityTwo;
  var outdoors = formObject.outdoors;
  var museum = formObject.museum;


 
  var doc = DocumentApp.getActiveDocument(); //activates the body
  var body = doc.getBody(); //grabs the body of the document
  body.clear(); //reset the travel planner after each use
  
  

  
  //FLIGHT INFORMATION STARTS HERE
  var header = body.appendParagraph("Flight Information");
  header.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  header.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
 
var flightCells = [
  ["Departure", "Destination", "Number of Adults","Number of Children", "Departure Date", "Return Date", "Flight Class"],
  [Departure,Destination,adults,children,Depature_Date,Return_Date,Class ]
  ];
  
addTableInDocument(flightCells);// Append a regular paragraph.
doc.appendParagraph("Here is the weather for the next week based.");
processWeather(Destination); //calls the weather function api 
  
  
 //HOUSING INFORMATION STARTS HERE 
 var hRating = formObject.hotelRating;
 
var housingHeader = body.appendParagraph("Housing Information");
  housingHeader.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  housingHeader.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

var price_range; //sets the price range for the user 
if(priceRange== "1"){
  price_range = "Economic($)";

}
else if (priceRange== "2"){
  price_range = "Affordable($$)";

}
else if (priceRange== "3"){
  price_range = "Moderate($$$)";
}

else if (priceRange== "4"){
  price_range = "Expensive($$$$)";
}
else{
  price_range = "Luxurious($$$$$)";
}
var housingCells = [
   ["Housing Type",  "Housing Price ($)"],
   [Housing_type,price_range]
  ];
  
  addTableInDocument(housingCells);// Append a regular paragraph.
  var housingobj = basicNearbySearch(Destination, "lodging"); //make the call to housing
  
   var countValidResults = 0;
  body.appendParagraph("Here is a list of hotel options");
  if(housingobj != null){
    for(var i = 0; i<housingobj.results.length; i++){ //gather all the information for the api response
      Logger.log(housingobj.results[i].rating);
      var name = housingobj.results[i].name;
      var priceLevel = housingobj.results[i].price_level;
      var placeRating = housingobj.results[i].rating;
      var shortAddress = housingobj.results[i].vicinity;
      //console.log(placeRating + "," + rating);
      //placeRating >= rating && 
      
      //limits results to 5 with ratings greater than or equal to the user rating selection
      if(countValidResults <= 5 && hRating <= placeRating){
        if(priceLevel < priceRange || priceLevel == null)
        {
         countValidResults++; 
        }
        else
        {
         continue; 
        }
        //append the information needed
        
        body.appendParagraph("Name: "+name);
        body.appendParagraph("Rating(1-5): "+ placeRating);
        
        if(priceLevel == null)
        {
          body.appendParagraph("Price-Level(1-5): Not available. Contact hotel for more information."); 
        }
        else
        {
          body.appendParagraph("Price-Level(1-5): "+ (Number(priceLevel) + 1)); 
        }      
  
        
        //appends website link here
        var PlaceID = housingobj.results[i].place_id;
        var detailedResults = detailedSearch(PlaceID);
        var url = detailedResults.result.website;
        body.appendParagraph("Address: "+shortAddress);
        appendLink(body, name + " link", url);
        
        //appends an image
        var photo = requestPhoto(housingobj.results[i].photos[0].photo_reference);
        body.appendImage(photo);
        
        body.appendParagraph(" ").appendHorizontalRule();;
        
      }
      
    }
  }
  
  //DINING INFORMATION STARTS HERE



  var foodHeader = body.appendParagraph("Dining Information");
  foodHeader.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  foodHeader.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  if(category == "restaurant"){ //displs the user results 
    var foodCells = [
      ["Cuisine Category", "Restaurant Type", "Rating", "Price"],
      [category,restaurantType,Rating, foodPrice]
    ];
  }
  else {
    var foodCells = [
      ["Cuisine Category", "Rating", "Price"],
      [category, Rating, foodPrice]
    ];
  }
  
  addTableInDocument(foodCells); //adds the table 
  getFoodPlaces(body, Destination, category, Rating, foodPrice, restaurantType, custom); //calls the function to gather the food infromation
 
 
 
  
  
  //RECREATION START HERE:
  var recHeader = body.appendParagraph("Recreation Information");
  recHeader.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  recHeader.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  for(var activityCount=0;activityCount<2;activityCount++){
    if(activityCount==0){ activity = activity;}
    else if((activityCount==1) && (activityTwo !="select")){ activity = activityTwo;} //deterimes which activity is selected
    else{ break;}
     

    
   
   if(activity == "outdoors"){
     var recCells = [
      ["Activity"],
      [activity]
    ];
    addTableInDocument(recCells); 
    var countValidResults = 0;
    var trailResults =  processTrails(Destination);
    body.appendParagraph("Here is a list of trails at your destination").appendHorizontalRule();
   if(trailResults != null){
     for(var i = 0; i<5; i++){ //gathers the api response from the trail api
      
       var name = trailResults.trails[i].name;
       var summary = trailResults.trails[i].summary;
       var stars = trailResults.trails[i].stars;
       var length = trailResults.trails[i].length;
       var url = trailResults.trails[i].url;

       if(countValidResults <= 5){ //displays 5 trail responses from the api
         countValidResults++;    
         body.appendParagraph("Name: "+ name);
         body.appendParagraph("Rating(1-5): "+ stars);
         body.appendParagraph("Summary: "+summary)
         body.appendParagraph("Length (mi): "+ length);
         body.appendParagraph("Link: ");
         body.appendParagraph(name + " website").setLinkUrl(url);
         body.appendParagraph(" ").appendHorizontalRule()
         
       }//end of if(countValidResults..)
      
     }//end of for loop
   }//end of if(trailResults !=...)
     Logger.log("end of trail api");
  }//end of if(activity == outdorrs..)
  
  
  //CHECKS THE Type FROM GOOGLE API 
  else {
    Logger.log("iteration number "+i+"the countValid results is "+countValidResults);
    
    //we want to call the google places api for the search
    if(activity == "museum"){
      var museumResults = basicNearbySearch(Destination, "museum", museum);
      var recCells = [
        ["Activity","Museum Type"],
        [activity,museum]
      ];
      addTableInDocument(recCells); //add the table in the document 
    }
    else{
      var museumResults = basicNearbySearch(Destination, activity, activity); //calls the google basic search to find nearby places based on the activty 
      var recCells = [
        ["Activity"],
        [activity]
      ];
      addTableInDocument(recCells);
    }
    var countValidResults = 0;
  body.appendParagraph("Here is a list of the chosen activity,"+activity).appendHorizontalRule();
  if(museumResults != null){
    for(var i = 0; i<museumResults.results.length; i++){ //gathers the infromation from the api
      
      var name = museumResults.results[i].name;
      var priceLevel = museumResults.results[i].price_level;
      var placeRating = museumResults.results[i].rating;
      var shortAddress = museumResults.results[i].vicinity;
  
      if(countValidResults <= 5){ //displays infromation results 
        countValidResults++;
        
        var PlaceID = museumResults.results[i].place_id;
        var detailedResults = detailedSearch(PlaceID);
        var url = detailedResults.result.website;
        body.appendParagraph("Name: "+ name);
        body.appendParagraph("Rating(1-5): "+ placeRating);
        
        if(priceLevel == null)
        {
         priceLevel = "Not available";
         body.appendParagraph("Price-Level(1-5): "+ priceLevel);
        }
        else
        {
         body.appendParagraph("Price-Level(1-5): "+ (Number(priceLevel) + 1));
        } //end of else      
        body.appendParagraph("Address: "+ shortAddress);
        

        body.appendParagraph("Link: ");
        body.appendParagraph(name + " website").setLinkUrl(url);
        
        //gets and shows a photo from the restaurant
        try { 
          var photo = requestPhoto(museumResults.results[i].photos[0].photo_reference); //calls the photo api
          body.appendImage(photo);
        }
        catch(e){ 
          body.appendParagraph("No Image was found");
        }
        
        body.appendParagraph(" ").appendHorizontalRule();
        } //end of if(countValidResults...)
      
     } //end of for loop
   } //end of if MuseumResults !=...) 
    Logger.log("End of basicsearch Api");
  } //end of else    
 } //end of for loop setting acitivtynumber
  
}

// #####################################
// 
// END FORM PROCESSING BLOCK
//
// #####################################






function getFoodPlaces(body, destination, category, rating, price, restaurant_type, custom){
   //this grabs the food results from the user inputs 
   
  Logger.clear();
  Logger.log("in food");
  Logger.log(price);
  Logger.log(rating);
  var searchResults;
  
  //calls the approiate api call based on variables
  switch(category){
    case "fast food":
      searchResults = basicNearbySearch(destination, "food", "fast food"); 
      break;
    case "custom":
       searchResults = basicNearbySearch(destination, "food", custom);
      break;
    case "restaurant":
      searchResults = basicNearbySearch(destination, category, restaurant_type); 
      break;
    default:
      searchResults = basicNearbySearch(destination, category);
  }
  
  
  Logger.log("after results");
  
  //converts price to a number to compare to the price_level from the maps api
  var priceNumber;
  switch(price){
    case "cheap":
      priceNumber = 1;
      break;
    case "moderate":
      priceNumber = 2;
      break;
    case "expensive":
      priceNumber = 3;
      break;
    default:
      priceNumber = 0;
      break;
  }
  
  Logger.log(priceNumber);
  
  //loops through all api results
  //adds to sheet if its above the users min ratnig and within their price range
  //limits output to 5 results 
  var countValidResults = 0;
  if(searchResults != null){
    for(var i = 0; i<searchResults.results.length; i++){
    
      //gets the attributes from the api call
      var name = searchResults.results[i].name;
      var priceLevel = searchResults.results[i].price_level;
      var placeRating = searchResults.results[i].rating;
      var shortAddress = searchResults.results[i].vicinity;
      var iconLink = searchResults.results[i].icon;
      
      //checks for 5 results that meet the input conditions
      if(countValidResults < 5 && placeRating >= rating && priceLevel <= priceNumber ){
        countValidResults++;
        var PlaceID = searchResults.results[i].place_id;
        var detailedResults = detailedSearch(PlaceID);
        var url = detailedResults.result.website;
        
        
        //appends the output to the document
        body.appendParagraph("Name: "+ name);
        body.appendParagraph("Rating(1-5): "+ placeRating);
        body.appendParagraph("Price-Level(1-5): "+ priceLevel);
        body.appendParagraph("Address: "+ shortAddress);
        
        //creates the link
        body.appendParagraph("Link: ");
        body.appendParagraph(name + " website").setLinkUrl(url);
        
        //gets and shows a photo from the restaurant
        var photo = requestPhoto(searchResults.results[i].photos[0].photo_reference);
        body.appendImage(photo);
        body.appendParagraph(" ").appendHorizontalRule();

        
      }
      
    }

  }
  
 
  //if no valid results were foudn it will output it
  if(countValidResults == 0){
    body.appendParagraph("No Valid Results Found")
  }
    
}




//PROCESS THE TRAIL API 
function processTrails(destination) { 
  var location = getLonLat(destination);
  var lat = location[0];
  var lng = location[1];
  var response = UrlFetchApp.fetch("https://www.hikingproject.com/data/get-trails?lat="+lat+"&lon="+lng+"&maxDistance=10&key=200970551-78d486d57654218076d02171dcfdd29a");
                                 
 // Logger.log(response.getContentText()); 
  JSON.stringify(response);  //gather the response
 return JSON.parse(response);
   
}


function processWeather( ) { //calls the weather api to gather the infromation for the next week
  Logger.clear();
   
  
 
var options = { //header infromation for rapid api website
     "async": true,
     "crossDomain": true,
     "method" : "GET",
     "headers" : {
       "x-rapidapi-key" : "2c91d57371msh96fb9d512191de3p17952djsn44e4c3786f31",
       "cache-control": "no-cache"
     }
   };
  
  var response = UrlFetchApp.fetch("https://visual-crossing-weather.p.rapidapi.com/forecast?contentType=json&shortColumnNames=false&unitGroup=us&location=Dallas&aggregateHours=24",options);
  
  //Logger.log(response.getContentText());
  JSON.stringify(response);                          
  var obj = JSON.parse(response); //dispalys the data and appends to the sheet 
   
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  
  for(var i=0;i<6;i++){
    var date=obj.locations.Dallas.values[i].datetimeStr;
    var temp=obj.locations.Dallas.values[i].temp;
    var wind=obj.locations.Dallas.values[i].wspd;
    var cond=obj.locations.Dallas.values[i].conditions;
    body.appendParagraph("Date: "+date);
    body.appendParagraph("Temp: "+temp);
    body.appendParagraph("Wind: "+wind);
    body.appendParagraph("Condition: "+cond).appendHorizontalRule();
    body.appendParagraph(" ");
  }
  
 
}


function include(filename){ //allows the files to be included
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
};


function addTableInDocument(data) {  
  //define header cell style which we will use while adding cells in header row
  //Backgroud color, text bold, white
  var headerStyle = {};
  headerStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#336600';
  headerStyle[DocumentApp.Attribute.BOLD] = true;
  headerStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#FFFFFF';
  
  //Style for the cells other than header row
  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BOLD] = false;
  cellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

  //By default, each paragraph had space after, so we will change the paragraph style to add zero space
  //we will use it later
  var paraStyle = {};
  paraStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
  paraStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
  
  //get the document
  var doc = DocumentApp.getActiveDocument(); //or
//  var doc = DocumentApp.openById('ID_OF_DOCUMENT'); //or
//  var doc = DocumentApp.openByUrl('URL_OF_DOCUMENT');
  
  //get the body section of document
  var body = doc.getBody();
  
  //Add a table in document
  var table = body.appendTable();
  

  for(var i=0; i<data.length; i++){
    var tr = table.appendTableRow();
    
    //add 4 cells in each row
    for(var j=0; j<data[i].length; j++){

        var td = tr.appendTableCell(data[i][j]);      
    
      
      //if it is header cell, apply the header style else cellStyle
      if(i == 0) td.setAttributes(headerStyle);
      else td.setAttributes(cellStyle);
      
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
    }
  }
 

}
//this function allows for the document to be tranlated to new language based the the user input 
function translateDoc(formObj){
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var inputLanguage = formObj.inputLanguage;
   var desiredLanguage = formObj.outputLanguage;
  
   for(var iter = 1;iter<250;iter++){ //iterates through the document 
     try{
       var firstChild = body.getChild(iter);
       Logger.log(firstChild);
       Logger.log(firstChild.getText());
          if ((firstChild.getType() == DocumentApp.ElementType.PARAGRAPH)) { //checks if it is paragraph
           //var test = body.getParagraphs()[iter].getText();
           var text = firstChild.getText();
           var atr = firstChild.getAttributes();
             if(text != ""){
                var translatedText = LanguageApp.translate(text, inputLanguage, desiredLanguage); //translates the document
                firstChild.asParagraph().setText(translatedText);
                firstChild.setAttributes(atr);
             }
      
         }
         else if(firstChild.getType() == DocumentApp.ElementType.TABLE){ //checks if a table to edit a table
         
           Logger.log("Table Found");
           for(var numRows = 0; numRows < firstChild.getNumRows(); numRows++){
             var tableRow = firstChild.getRow(numRows);
             
           
             for(var numCols = 0; numCols < tableRow.getNumCells(); numCols++){ //loops through each table cell entry
               Logger.log("In for loop");
               var cell = tableRow.getCell(numCols);
               var text = cell.getText();
               Logger.log(text);
               if(text != ""){
                 var translatedText = LanguageApp.translate(text, inputLanguage, desiredLanguage);  //translates the document
                cell.setText(translatedText);
               }
               
             }
           }
         }
   
     }
     catch (e){
       closeSidebar();
    }
  }
  
}

