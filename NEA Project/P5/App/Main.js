
var event, mainTool, strokeColour, fillColour, backgroundColor, VisibleLayers, Layers, previousTool, dragging, currentLayer, numberLayer;
window.addEventListener("load", startUp, false);



function startUp() {    
    strokeColour = "#000000";
    fillColour = '#000000';
    backgroundColor = '#ffffff';
    strokeColourWeb = document.querySelector("#strokeColour");
    strokeColourWeb.value = "#000000";
    strokeColourWeb.addEventListener("input", updateStroke, false); //sets the colour of the colour picker to black
    fillColourWeb = document.querySelector("#fillColour");
    fillColourWeb.value = "#000000";
    fillColourWeb.addEventListener("input", updateFill, false);
    strokeColourWeb.select();
    fillColourWeb.select();
    var element = document.getElementById("LayerCounter1");
    element.addEventListener('click', Layer); //When the user clicks on the box, function click() will run
    document.getElementById("LayerCounter" + currentLayer).style.backgroundColor = "#1d1d1d";
}

function updateStroke(event) {
    strokeColour = event.target.value; //Changes stroke colour base on what the user has picked
}


function updateFill(event) {
    fillColour = event.target.value; //Changes the fill colour base on what the user has picked
 }

function setup() {
    var canvas = createCanvas(1000, 700);
    canvas.parent('canvas');
    currentTool = "brush";
    canvas.mousePressed(click);
    strokeSizeSlider = createSlider(0, 15, 5); //Creates slider for the stroke
    strokeSizeSlider.position(1150, 100);
    shapeDefualtSize = 30;
    Layers = {
        contents: [],
        Visibility: [true]
    };
    currentLayer = 1;
    previousTool = "";
    frameRate(60);
    dragging = false;
    numberLayer = 1;
    if(window.location.hash === '#canvasDataLoad') { //When the user loads a canvas from the saves, this is loaded
        loadCanvas();
    } 
    else {
        Layers.contents.push(new ArrayStructure([]));
    }
}



function loadCanvas() {
    // Changing to all the states of the variables to what they were use to
    var myCanvasData = localStorage.CanvasData;
    myCanvasData = JSON.parse(myCanvasData);
    Layers.Visibility = [];
    currentLayer = myCanvasData.currentLayerData;
    for(var i=0; i < myCanvasData.visibilityData.length; i++) {
        Layers.Visibility.push(myCanvasData.visibilityData[i]);
    }
    for(i=0; i < Object.keys(myCanvasData).length - 2; i++) {
        if(i != 0 ) {
            addButton();
        }
        else {
            Layers.contents.push(new ArrayStructure([]));
        }
        for(var j=0; j < myCanvasData['contentData' + i].length; j++) {
            ConvertObjectToClass(myCanvasData['contentData' + i][j], i);
        }
    }
    console.log(Layers.contents);
}

//Converting the objcect without methods to objects with methods
function ConvertObjectToClass(toolObject, layerNumber) {
    if(typeof toolObject === 'object') {
        if(toolObject.name === "Erase") {
            Layers.contents[layerNumber].push(new Erase(toolObject.strokeSize, toolObject.Colour,  toolObject.mX, toolObject.mY));
        }
        if(toolObject.name === "PaintBrush") {
            Layers.contents[layerNumber].push(new PaintBrush(toolObject.strokeSize, toolObject.Colour,  toolObject.mX, toolObject.mY));
        }
        if(toolObject.name === "Line") {
            Layers.contents[layerNumber].push(new Line(toolObject.strokeSize, toolObject.Colour,  toolObject.mX, toolObject.mY));
        }
        if(toolObject.name === "Elipse") {
            Layers.contents[layerNumber].push(new Elipse(toolObject.strokeSize, toolObject.Colour, toolObject.Fill,  toolObject.mX, toolObject.mY, toolObject.sizeX, toolObject.sizeY));
        }
        if(toolObject.name === "Rectangle") {
            Layers.contents[layerNumber].push(new Rectangle(toolObject.strokeSize, toolObject.Colour,  toolObject.Fill, toolObject.mX, toolObject.mY, toolObject.sizeX, toolObject.sizeY));
        }
    }
    else {
        Layers.contents[layerNumber].push(toolObject);
    }
}


function clearCanvas() {
    //This section gets rid of the layer box except the fire one
    output = '<div id="LayerCounter' + currentLayer + '" class="individualLayer">' +
            '<li>Layer ' + currentLayer + '</li>' +
            '<button type="button" id="visibleButton' + currentLayer + '" onclick="ToggleVisible(' + currentLayer + ')">Visible</button>' +
            '</div>';
    for(var i=numberLayer; i >  1; i--) {
        document.getElementById('LayerCounter' + i).outerHTML = "";
    
    }  //Get Rid of all the Layers
    currentLayer = 1;
    Layers = {
        contents: [],
        Visibility: [true]
    };
    Layers.contents.push(new ArrayStructure([]));
    numberLayer = 1;
    document.getElementById("LayerCounter" + numberLayer).style.backgroundColor = "#1d1d1d"; //Reset Layers and content
}


function draw() {
    strokeSize = strokeSizeSlider.value();
    document.getElementById("strokeSize").innerHTML = strokeSize; //Gets the value from the stroke slider
    background(255); //Fills the background white

    for (eachLayer=0; eachLayer < Layers.contents.length; eachLayer++) { //displays all the lines, stokes shapes in the Layers
        for(object=0; object < Layers.contents[eachLayer].item.length; object++) {
            try {
                if(Layers.Visibility[eachLayer]) { //won't display the layer if is it's invisible
                    Layers.contents[eachLayer].item[object].display();
                    }       
                    
                }   
            catch(err) {    

            }
            
        }
    }
}


function LayerClickDetection() { //creates a clickable event for the layer
    for(var i=1; i < numberLayer + 1; i++) {
        var element = document.getElementById("LayerCounter" + i);
        element.addEventListener('click', Layer);
    }
}

function Layer() { //changes the colour of the new layer to dark which means its active
    document.getElementById("LayerCounter" + currentLayer).style.backgroundColor = "#33333C";
    currentLayer = parseInt(this.id.slice(-1));
    document.getElementById("LayerCounter" + currentLayer).style.backgroundColor = "#1d1d1d";
}

function swapTool(tool) {  //swaps the working tool
    currentTool = tool;
    if(previousTool != "") {
        document.getElementById(previousTool).style.background = "#33333C";
    }
    document.getElementById(tool).style.background = "#1d1d1d";
    previousTool = tool;
}

function ToggleVisible(number) { //toggle wheter the layer is display or not
    if(Layers.Visibility[number - 1]) {
        Layers.Visibility[number-1] = false;
        document.getElementById("visibleButton" + number).innerHTML = "NotVisible";
    }
    else {
        Layers.Visibility[number - 1] = true;
        document.getElementById("visibleButton" + number).innerHTML = "Visible";

    }


}

function checkDraw(drawingObject) {     //check if the layer you selected is visible. If it isn't don't draw the ting
    if(Layers.Visibility[currentLayer - 1]) {
            Layers.contents[currentLayer - 1].push(drawingObject);
        }
}

function checkClick() { //checks if mouse is inside the canvas
    if ((0 < mouseX  && mouseX < width) && (0 < mouseY && mouseY < height) && dragging != true) {
        return true;
    }
    else if (dragging) {  //mouse Release will go off if the user drags the mouse outside the canvas and releases
        dragging = false;
        return true;
    }
    return false;
}

function addButton() {
    if (numberLayer != 9) { //capped at layer 9
            numberLayer += 1;
            Layers.Visibility.push(true);
            Layers.contents.push(new ArrayStructure([]));
            var output = '';   //html for another button
            output = '<div id="LayerCounter' + numberLayer+ '" class="individualLayer">' +
                '<li>Layer ' + numberLayer + '</li>' +
                '<button type="button" id="visibleButton' + numberLayer + '" onclick="ToggleVisible(' + numberLayer + ')">Visible</button>' +
                '</div>';
            document.getElementById('Layer').innerHTML += output;
            LayerClickDetection();
        }
}


function mouseDragged() {
    if(checkClick()) {
        dragging = true;
        if (currentTool === "PaintBrush" ) {
            checkDraw(new PaintBrush(strokeSize, strokeColour));
          
        } 
        if (currentTool === "Erase") {
            checkDraw(new Erase(strokeSize, backgroundColor));

        }
        if (currentTool === "Rectangle" || currentTool === "Elipse" ) {  //resizing the shape
            
            Layers.contents[currentLayer-1].item[Layers.contents[currentLayer-1].item.length -1].drag();
            
            
        }
    }
}

function mouseReleased() {
    if(checkClick()) {
        if(currentTool === "Erase") {
            checkDraw("Mouse Released");
        }
        if(currentTool === "PaintBrush") {
            checkDraw("Mouse Released");
        }
        if(currentTool === "Rectangle") {
            checkDraw("Mouse Released");
        }
        if(currentTool === "Elipse") {
            checkDraw("Mouse Released");
        }
    }
}

function click() {
    if(checkClick()) {
        if (currentTool === "Line" ) {
            checkDraw(new Line(strokeSize, strokeColour));
        }
        if (currentTool === "Rectangle" ) {
            checkDraw(new Rectangle(strokeSize, strokeColour, fillColour, mouseX, mouseY)); 
        }
        if (currentTool === "Elipse") {
            checkDraw(new Elipse(strokeSize, strokeColour, fillColour, mouseX, mouseY));
        }
      
    }
}

function undo() {
var isLine = false;
  if(Layers.Visibility[currentLayer - 1]) { //Check if the layer is vivible, if it isnt, don't do it
    //This whole if statemetns are for removing lines when undo. When creating a line, it requires
    // two clicks, creating a point and then another. When doing undo, you want to undo those two actions at once
        if( Layers.contents[currentLayer - 1].item.length != 0) {
            if (Layers.contents[currentLayer - 1].item.length >= 3) {
                if(Layers.contents[currentLayer-1].lastElement(1).name === "Line" && Layers.contents[currentLayer-1].lastElement(2).name === "Line" && Layers.contents[currentLayer-1].lastElement(3).name != "Line") {
                    isLine = true;
                }
            }
            else {
                isLine = true;
            }
            Layers.contents[currentLayer - 1].pop();
        }
        else {
            isEmpty = true;
        }
        if(isLine) {
            Layers.contents[currentLayer - 1].pop();
        }
         while ((Layers.contents[currentLayer-1].lastElement(1) != "Mouse Released")  && Layers.contents[currentLayer - 1].item.length > 0) { //A brush line has mulitple lines, this removes all the line in one go
            if(Layers.contents[currentLayer-1].lastElement(1).name === "Line" ) {
                break;
            }
            Layers.contents[currentLayer - 1].pop();
        }
    }
}

