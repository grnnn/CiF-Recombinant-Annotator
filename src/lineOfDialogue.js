function LineOfDialogue(lineNum){

    //Class to represent each line of dialogue

    this.lineNumber = lineNum.toString();

    this.speaker = "";

    this.interlocutor = "";

    this.text = "";

    this.rangeVal1 = 4;

    this.rangeVal2 = 6;

    this.nextRange = "+2";

    this.annotationData = new AnnotationData(lineNum);


    //Initialize Base HTML
    this.baseStructureConfigure();

    //Initialize Annotation Properties
    this.propertyDropdownConfigure();


}

//Append base structure
LineOfDialogue.prototype.baseStructureConfigure = function(){
    //Superlong append that I wish I could make tidier
    $('#LinesContainer').append("<div class='panel panel-default'> <div class='pane-body'>"
                                +"<div class='row' style='margin:10px;' id='Line"+this.lineNumber+"'><div class='col-md-2' > <b style='font-size: 24px;'> Speaker </b> <div class='dropdown'><button type='button' class='btn btn-default dropdown-toggle'  id='SpeakerDropDownButton"+this.lineNumber+"' data-toggle='dropdown'>Select Speaker <span class='caret'></span></button><ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1' id='SpeakerDropDown"+this.lineNumber+"'><li role='presentation'><a role='menuitem' tabindex='-1' >Initiator</a></li><li role='presentation'><a role='menuitem' tabindex='-1' >Responder</a></li><li role='presentation'><a role='menuitem' tabindex='-1' >Other</a></li></ul></div>"
    							+"<b style='font-size: 24px;'> Interlocutor </b> <div class='dropdown'><button type='button' class='btn btn-default dropdown-toggle'  id='InterlocutorDropDownButton"+this.lineNumber+"' data-toggle='dropdown'>Select Interlocutor <span class='caret'></span></button><ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1' id='InterlocutorDropDown"+this.lineNumber+"'><li role='presentation'><a role='menuitem' tabindex='-1' >Initiator</a></li><li role='presentation'><a role='menuitem' tabindex='-1' >Responder</a></li><li role='presentation'><a role='menuitem' tabindex='-1' >Other</a></li></ul></div></div>"
                                +"<div class='col-md-4' > <b style='font-size: 24px;'> Text </b> <textarea rows='5' style='width: 100%; resize: vertical;' id='TextArea"+this.lineNumber+"'>Enter Dialogue here</textarea> <div><p><label for='amount'>Likeliness of Sucess range: </label><input type='text' id='amountAt"+this.lineNumber+"' readonly style='border:0; color:#f6931f; font-weight:bold;'></p><div id='slider-rangeAt"+this.lineNumber+"'></div><div style='padding-top: 20px;'><b >Range of next line sucess:</b></div><div style='width:25%; padding-top: 10px;' class='input-group'><div class='input-group-btn'><button type='button' id='RangeDropDownButton"+this.lineNumber+"' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> +</button><ul id='RangeDropDown"+this.lineNumber+"' class='dropdown-menu' role='menu'><li><a> +</a></li><li><a> -</a></li></ul></div><input type='text' value='2' id='NextRange"+this.lineNumber+"' class='form-control'></div> </div> </div>"
                                +"<div class='col-md-4' id='Properties"+this.lineNumber+"' > <b style='font-size: 24px;'> Annotations </b> </div>"
                                +"<div class='col-md-1' id='toKeep"+this.lineNumber+"'><div class='input-group-btn' style='padding:40px'><button class='btn btn-danger'  id='CollapseLineButton"+this.lineNumber+"'>-</button><button class='btn btn-danger'  id='RemoveLineButton"+this.lineNumber+"'>&times;</button></div> </div></div></div></div><div id='Divider"+this.lineNumber+"' class='page-header'></div>");

    //'click' listener for the Speaker dropdown
    $("#SpeakerDropDown"+this.lineNumber).on('click', 'li a', function(){
        //get the line number
        var lineNum =  $(this).parent().parent().attr("id").replace("SpeakerDropDown", "");

        //If the interlocutor dropdown contains 'Select', autofill
        //that dropdown
        if( $("#InterlocutorDropDownButton"+lineNum).text().search("Select Interlocutor") !== -1 ){
        	if( $(this).text() === "Initiator"){
        		$("#InterlocutorDropDownButton"+lineNum).text("Responder");
                $("#InterlocutorDropDownButton"+lineNum).val("Responder");
        	} else if( $(this).text() === "Responder" ) {
        		$("#InterlocutorDropDownButton"+lineNum).text("Initiator");
                $("#InterlocutorDropDownButton"+lineNum).val("Initiator");
        	}
        }

        //Set the text in the Dropdown button to the selected text
        $("#SpeakerDropDownButton"+lineNum).text($(this).text());
        $("#SpeakerDropDownButton"+lineNum).val($(this).text());
    });

  //'click' listener for the Interlocutor dropdown
    $("#InterlocutorDropDown"+this.lineNumber).on('click', 'li a', function(){
        //get the line number
        var lineNum =  $(this).parent().parent().attr("id").replace("InterlocutorDropDown", "");


        //Set the text in the Dropdown button to the selected text
        $("#InterlocutorDropDownButton"+lineNum).text($(this).text());
        $("#InterlocutorDropDownButton"+lineNum).val($(this).text());
    });

    $("#RemoveLineButton"+this.lineNumber).on('click', function(){
        var lineNum = this.id.replace("RemoveLineButton","");

        if(confirm("Are you sure that you want to delete this line?")){
	        var line = main.findLine(lineNum);
	        main.linesOfDialogue.splice(main.linesOfDialogue.indexOf(line), 1);

	        $("#Line" + lineNum).remove();
	        $("#Divider" + lineNum).remove();
        }
    });
    
    $("#CollapseLineButton"+this.lineNumber).on('click', function(){
    	var lineNum = this.id.replace("CollapseLineButton","");
    	var isOpen = ($(this).text() === "-");
    	
    	var line = $("#Line"+lineNum);
		var children = line.children();
    	
		for(var i = 0; i < children.length; i++){
			var child = children[i];
			if(child.id !== "toKeep"+ lineNum){
				if(isOpen)child.setAttribute("style", "display: none;");
				else child.removeAttribute("style");
			}
		}
		
		if(isOpen) {
			$(this).val("+");
			$(this).text("+");
		} else{
			$(this).val("-");
			$(this).text("-");
		}
		
		var ind = main.linesOfDialogue.indexOf(main.findLine(lineNum)) + 1;
		var speaker = main.findLine(lineNum).speaker;
		var dialogue = main.findLine(lineNum).text;
		
		if(isOpen) $(this).parent().parent().parent().prepend("<strong id='tempRep"+lineNum+"'>"+ind+". "+speaker+": "+dialogue+"</strong>");
		else $("#tempRep"+lineNum).remove();
		
    });

    var lineNum = this.lineNumber;
    //Set up slider for the likeliness of success
    $(function() {
        $( "#slider-rangeAt" + lineNum ).slider({
          range: true,
          min: 0,
          max: 10,
          values: [ 4, 6 ],
          slide: function( event, ui ) {
            $( "#amountAt" + lineNum ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
          }
        });
        $( "#amountAt" + lineNum ).val(  $( "#slider-rangeAt" + lineNum ).slider( "values", 0 ) +
          " - " + $( "#slider-rangeAt" + lineNum ).slider( "values", 1 ) );
      });

    //click listener for Range Drop down
    $("#RangeDropDown"+this.lineNumber).on('click', 'li a', function(){
        var lineNum =  $(this).parent().parent().attr("id").replace("RangeDropDown", "");

        $("#RangeDropDownButton"+lineNum).text($(this).text());
        $("#RangeDropDownButton"+lineNum).val($(this).text());

    });
    
}

//Append the properties, and the listeners for those properties
LineOfDialogue.prototype.propertyDropdownConfigure = function(){
    //Set all of the text for the property dropdown menu, loop through each type of property to get it
    var textForDropdown = "<div class='dropdown' id='PropertiesDropDown"+this.lineNumber+"' style='padding:15px'><button type='button' class='btn btn-default dropdown-toggle'   data-toggle='dropdown'>+ Add Type of Annotation <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='PropertiesDropDownInner"+this.lineNumber+"' aria-labelledby='dropdownMenu1' >";
    for(var i = 0; i < propertyTypes.length; i++){
        var propertyType = propertyTypes[i];
        textForDropdown = textForDropdown + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;' color='"+propertyType.color+"'  id='"+propertyType.id+"Prop"+this.lineNumber+"' title='"+propertyType.description+"'><h4>"+propertyType.name+"</h4></a></li>";

    }
    //append that text to the Property tag
    $("#Properties" + this.lineNumber).append(textForDropdown + "</ul> </div>");


    //For each label, set a 'click' listener
    //for(var i = 0; i < propertyTypes.length; i++){
        //Listener definition
        $( '#PropertiesDropDown'+this.lineNumber ).on('click','a', function(){

        if(this.id.search("Prop") != -1){
            //Pull the id, color, name, and lineNum out of the html element
            var id = this.id.replace("Prop", "");
            id = id.replace(/(\d+)/g, "");
            var lineNum = this.id.replace(/([A-Z]+)/g, "");
            lineNum = lineNum.replace(/([a-z]+)/g, "");
            var name = $(this).text();
            var desc = $(this).attr("title");
            var color = $(this).attr("color");

            //Remove the button that adds that type of property
            $(this).remove();
            //if the list is empty, hide the button
            if($("#PropertiesDropDown" + lineNum).has("a").length == 0){
                $("#PropertiesDropDown" + lineNum).hide();
            }

            //add the property to annotationData
            main.findLine(lineNum).annotationData.addProperty(id);

            //Add the list-group for the property
            $("#Properties"+lineNum).append("<ul class='list-group' id='"+id+"ListGroup"+lineNum+"'><li class='list-group-item' style='color:white; background-color: "+color+"; border-color: "+color+";'><h4 class='list-group-item-heading' style='color:white'>"+name+"<button type='button' id='"+id+"ListGroupClose"+lineNum+"' class='close' aria-hidden='true'>&times;</button><button type='button' id='"+id+"ListGroupCollapse"+lineNum+"' style='font-size: 30px;' class='close' aria-hidden='true'>-</button></h4><p id='"+id+"Desc"+lineNum+"'>"+desc+"</p></li><a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a></ul>");
            //Add a 'click' listener for the plus button in that list group
            //Logic for different formats is in the propertyTable object (defined in PropertyTable.js)
            $("#"+id+"ListGroup"+lineNum).on('click', 'a', function(){

                if(this.id.search("PlusButton") != -1){
                    //retrieve id and lineNum
                    var id = this.id.replace("PlusButton", "");
                    id = id.replace(/(\d+)/g, "");
                    var lineNum = this.id.replace(/([A-Z]+)/g, "");
                    lineNum = lineNum.replace(/([a-z]+)/g, "");

                    //add 1 to the length in annotationData
                    main.findLine(lineNum).annotationData[id].length++;
                    //get the length
                    var listGroupLength = main.findLine(lineNum).annotationData[id].length.toString();

                    //Define the html code to be added, including a new plus button
                    var breadOne = "<li class='list-group-item clearfix' id='"+id+"ItemAt"+lineNum+"And"+listGroupLength+"'>";
                    var insides = propertyTable.addHTML(id, lineNum, listGroupLength);
                    var breadTwo = " <span class='pull-right'><button type='button' id='"+id+"ItemCloseAt"+lineNum+"And"+listGroupLength+"' class='close' aria-hidden='true' >&times;</button></span> </li>";

                    //Some properties can't have more than 1 members,
                    //this exception doesn't add a plus button if it's that kind of property
                    if(id != "SocialExchangeIdentities" && id != "SocialExchangeOutcomes"){
                        breadTwo = breadTwo + " <a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a> ";
                    }

                    //append the code
                    $("#"+id+"ListGroup"+lineNum).append(breadOne + insides + breadTwo);

                    //remove the old plus button
                    var plusButton = $("#"+id+"PlusButton"+lineNum);
                    plusButton.remove();

                    //Set listeners for that particular property id
                    propertyTable.setListeners(id, lineNum, listGroupLength);

                    //Set one more listener for the close button of the list group item that was just created
                    //#nestedListeners2014
                    $("#"+id+"ItemCloseAt"+lineNum+"And"+listGroupLength).on('click', function(){
                        //get id, lineNum, and length
                        var props = this.id.split("ItemCloseAt");
                        var nums = props[1].split("And");
                        var id = props[0];
                        var lineNum = nums[0];
                        var length = nums[1];

                        if(confirm("Are you sure you want to delete this annotation?")){

	                        //The flip side to removing the plus button,
	                        //Add it if the property would be empty Otherwise
	                        if($("#"+id+"ListGroup"+lineNum).children().length == 2){
	                            $("#"+id+"ListGroup"+lineNum).append(" <a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a> ");
	                        }

	                        //Remove the list item
	                        $("#"+id+"ItemAt"+lineNum+"And"+length).remove();

	                        //Speech Acts and Transmission auto-fill exceptions
	                        if(id === "SpeechActs"){
                                var precedeItems =  $("#SpeechActsPrecedeListGroup"+lineNum).find("li[auto=auto"+length+"]");
                                var followItems =  $("#SpeechActsFollowListGroup"+lineNum).find("li[auto=auto"+length+"]");

                                for(var a = 0; a < precedeItems.length; a++){
                                    precedeItems[a].remove();
                                }

                                for(var b = 0; b < followItems.length; b++){
                                    followItems[b].remove();
                                }

                            }
	                        if(id === "StoryWorldTransmissions"){
	                        	var autoItems = $("#StoryWorldContradictionsListGroup"+lineNum).find("li[auto=auto"+length+"]");

	                        	for(var c = 0; c < autoItems.length; c++){
	                        		autoItems[c].remove();
	                        	}
	                        }
                        }

                    });

                }


            });

            //Add a listener for collapsing a listgroup with the - in the upper corner
            $("#"+id+"ListGroupCollapse"+lineNum).on('click', function(){

                //retrieve id and lineNum
                var id = this.id.replace("ListGroupCollapse", "");
                id = id.replace(/(\d+)/g, "");
                var lineNum = this.id.replace(/([A-Z]+)/g, "");
                lineNum = lineNum.replace(/([a-z]+)/g, "");

                var open;
                if($(this).text() === "-"){
                    $(this).val("+");
                    $(this).text("+");
                    open = true;
                } else {
                    $(this).val("-");
                    $(this).text("-");
                    open = false;
                }
                
                //First, hide description
                if(open) $("#"+id+"Desc"+lineNum).attr("style", "display: none;");
                else $("#"+id+"Desc"+lineNum).removeAttr("style");
                
                //Next, hide plus button
                if(open) $("#"+id+"PlusButton"+lineNum).attr("style", "display: none;");
                else $("#"+id+"PlusButton"+lineNum).removeAttr("style");


                var listGroupItems = [$(this).parent().parent().parent().find("li.clearfix")];
                for(var i = 0; i < listGroupItems.length; i++){
                	
                	//Get all children of the listGroupItems and exclude them based on the id type
                	var children =  listGroupItems[i].children();
                	
                	//get the right class identifier
                	var cls = "";
                	switch(id){
                	case "SocialExchangeIdentities":
                		cls = "dropdown";
                		break;
                	case "SocialExchangeOutcomes":
                		cls = "dropdown";
                		break;
                	case "StoryWorldTransmissions":
                		cls = "lexical";
                		break;
                	case "StoryWorldContradictions":
                		cls = "lexical";
                		break;
                	case "SpeechActs":
                		cls = "dropdown act";
                		break;
                	case "SpeechActsPrecede":
                		cls = "dropdown act";
                		break;
                	case "SpeechActsFollow":
                		cls = "dropdown act";
                		break;
                	case "StrictDependence":
                		cls = "dropdown";
                		break;
                	}
                	
                	//console.log(children);
                	
                	//hide all divs that dont have the class
                	for(var j = 0; j < children.length; j++){
                		var child = children[j];
                		
                		if( child.className !== cls){
                			if(open) child.setAttribute("style", "display: none;");
                            else child.removeAttribute("style");
                		}
                	}
                }



            });


            //Add a listener for closing a listgroup with the little x in the upper-right corner
            $("#"+id+"ListGroupClose"+lineNum).on('click', function(){

                //retrieve id and lineNum
                var id = this.id.replace("ListGroupClose", "");
                id = id.replace(/(\d+)/g, "");
                var lineNum = this.id.replace(/([A-Z]+)/g, "");
                lineNum = lineNum.replace(/([a-z]+)/g, "");

                if(confirm("Are you sure that you want to delete this property type and all associated annotations?")){

	                //find the propertyType which corresponds to the id
	                for(var i=0; i < propertyTypes.length; i++){
	                    if(propertyTypes[i].id == id){
	                        var propertyType = propertyTypes[i];
	                        break;
	                    }
	                }

	                //remove the property from annotationData
	                main.findLine(lineNum).annotationData.removeProperty(id);

	                //remove the entire listgroup
	                $("#"+id+"ListGroup"+lineNum).remove();

	                //If the dropdown is hidden, unhide it
	                $("#PropertiesDropDown" + lineNum).show();

	                //add the correct property back into the dropdown
	                $("#PropertiesDropDownInner"+lineNum).append(" <li role='presentation'><a role='menuitem' tabindex='-1' color='"+propertyType.color+"'  id='"+propertyType.id+"Prop"+lineNum+"' title='"+propertyType.description+"'><h4>"+propertyType.name+"</h4></a></li>");

	                //exception for speech act and transmissions, close all the autos
	                if(id === "SpeechActs"){
	                    var precedeItems =  $("#SpeechActsPrecedeListGroup"+lineNum).find("li[auto]");
	                    var followItems =  $("#SpeechActsFollowListGroup"+lineNum).find("li[auto]");

	                    for(var a = 0; a < precedeItems.length; a++){
	                        precedeItems[a].remove();
	                    }

	                    for(var b = 0; b < followItems.length; b++){
                            followItems[b].remove();
                        }

	                }
	                if(id === "StoryWorldTransmissions"){
	                	var autoItems = $("#StoryWorldContradictionsListGroup"+lineNum).find("li[auto]");

	                	for(var c = 0; c < autoItems.length; c++){
	                		autoItems[c].remove();
	                	}
	                }
                }
	        });
            }
        });

    //


};

//updates the line's properties every 100 ms, pulls data into the structure
LineOfDialogue.prototype.update = function(){

    //For some reason, this handles an importing error
    if(!$("#SpeakerDropDownButton"+this.lineNumber).html() ) return;

    //if speaker drop down isn't "select speaker", set the speaker to the speaker drop down
    if($("#SpeakerDropDownButton"+this.lineNumber).html().search("Select") == -1) this.speaker=$("#SpeakerDropDownButton"+this.lineNumber).html();

    //if interlocutor drop down isn't "select interlocutor", set the interlocutor to the interlocutor drop down
    if($("#InterlocutorDropDownButton"+this.lineNumber).html().search("Select") == -1) this.interlocutor=$("#InterlocutorDropDownButton"+this.lineNumber).html();

    //if the textarea isn't "Enter Dialogue here", set the text to the html
    if($("#TextArea"+this.lineNumber).val().search("Enter Dialogue here") == -1) this.text=$("#TextArea"+this.lineNumber).val();

    //Pull success data
    this.rangeVal1 = $( "#slider-rangeAt" + this.lineNumber ).slider( "values", 0 );
    this.rangeVal2 = $( "#slider-rangeAt" + this.lineNumber ).slider( "values", 1 );
    this.nextRange = $("#RangeDropDownButton"+this.lineNumber).text() + ($("#NextRange"+this.lineNumber).val()).toString();

    //Also pull data into the annotationData object with its own update method
    this.annotationData.update();



};