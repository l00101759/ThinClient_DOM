$(document).ready(function() {

	$curr = $("#start");
	$curr.css( "background", "#ffff4d" );//set current color
	$domOperations = "";
	$deletedItems = 0;//record deleted items
	
	//go to sibling...on right
	$("#next").click(function() {
		goRight();
	});
	//Go to sibling, left
	$("#previous").click(function() {		
		goLeft();
	});
	//go to first child
	$("#goChild").click(function() {
		goDown();
	});
	//go Parent
	$("#goParent").click(function() {
		goUp();	
	});
	//go Home
	$("#btnHome").click(function() {
		goTopElement();	
	});
	
	
	
	//hide/show  Controls
	$("#showHideCtrl").click(function() {
		$("#sideNav").fadeTo(100, 0);//sets opacity to 0, the tree won't move with this method

		if($('#sideNav').css('opacity') == 0) {// if hidden then show
			$("#sideNav").fadeTo(100, 1); 	
		}
	});

	function goRight()
	{
		$check = $curr.parent();
		$check = $check.next(); 
		
		if($check.length)//if next element exits. If it doesn't don't allow a next move
		{
			$curr.css( "background", "white" );
			$curr = $curr.parent(); //goes to the div
			$curr = $curr.next(); //goes to the next div (containing image)
			$curr = $curr.find("img:first");//gets first image
			$curr.css( "background", "#ffff4d" );
			
			//show next, hide the rest
			$("#nextCode").show();
			$("#leftCode").hide();
			$("#upCode").hide();
			$("#downCode").hide();
			
		}
	
	}
	function goLeft()
	{
		//get the next node and see if it exists
		$check = $curr.parent();
		$check = $check.prev(); 
		
		if($check.length)
		{
			$curr.css( "background", "white" );
			$curr = $curr.parent(); //goes to the div
			$curr = $curr.prev(); //goes to the next div (containing image)
			$curr = $curr.find("img:first");//gets first image
			$curr.css( "background", "#ffff4d" );
			
			//show left, hide the rest
			$("#leftCode").show();
			$("#nextCode").hide();
			$("#upCode").hide();
			$("#downCode").hide();
		}	
	}
	function goUp()
	{
		$check = $curr.parents("ul:first");
		$check = $check.prev();
		
		if($check.length)
		{
			$curr.css( "background", "white" );
			//$curr = $curr.parent();
			$curr = $curr.parents("ul:first");
			$curr = $curr.prev();
			$curr.css( "background", "#ffff4d" );
			
			//show up, hide the rest
			$("#upCode").show();
			$("#leftCode").hide();
			$("#nextCode").hide();
			$("#downCode").hide();
		}
	
	}
	function goDown()
	{
		$check = $curr.next();
		$check = $check.find("img:first");
		
		if($check.length)
		{
			$curr.css( "background", "white" );
			$curr = $curr.next();
			$curr = $curr.find("img:first");
			$curr.css( "background", "#ffff4d" );
			
			//show next, hide the rest
			$("#downCode").show();
			$("#leftCode").hide();
			$("#upCode").hide();
			$("#nextCode").hide();
		}
	}
	function goTopElement()
	{		
		$curr.css( "background", "white" );
		$curr = $("#start");
		$curr.css( "background", "#ffff4d" );	
	}
	//removes a node
	function removeNode()
	{

		if(!($curr.attr("id") == "start"))//Stop remove of parent
		{
			//$prev = $curr.prev();//store the previous node
			$currForRemove = $curr.parent(); //go to parent
			//get the next node and see if it exists
			
			$check = $curr.parent();
			$check = $check.prev();
			$check = $check.find("img:first");//gets first image
			
			if($check.attr("id") == "start")
			{
				 goTopElement();
			}
			else{
				goUp();//if not a sibling of parent
			}
			
			$($currForRemove).fadeOut( "slow", function() {
				$currForRemove.remove();
			});

			$deletedItems = $deletedItems + 1;
			$(".badge").text($deletedItems);
			
		}
		updateDOM();//update dom for display
	}
	
	var buttonTrigger = ""; //get the button that triggers modal
	//target ones under li, (carousel has a tags as well, which are not wanted)
	$("li > a").on('click', function() { 
		//console.log("Button = "  + $(this).attr("id"));
		buttonTrigger = $(this).attr("id");
	});
	
	//*****Modal handler
	$newImage = "";
	//get current image from carousel. Set to img src
	//this is for when no slide is carried out
	var currImageIndex = $("#myCarousel").find('.active').index();//gets current index of active image on carousel
	$imgSrc = $('.item:eq('+currImageIndex+') img').attr("src");//gets the img src

	//when a slide is complete
	$('#myCarousel').on('slid.bs.carousel', function () {//on slid!! not slide
		var currImageIndex = $(this).find('.active').index();//get index 			
		//console.log("curr img -- " + $('.item:eq('+currImageIndex+') img').attr("src"));
		$imgSrc = $('.item:eq('+currImageIndex+') img').attr("src");//set img src

	});
	//choose button closes modal
		$('#btnCloseModal').on('click', function () {	
			addElement();//adds image to DOM
		});
	//***end modal handler
	
	//add element to DOM, check if child or sibling
	function addElement()
	{
			//add Sibling
			if(buttonTrigger == "addSibling")
			{
				$currForImage = $curr.parent();//go to the div that contains image
				//add another div with image inside.
				$currForImage.after("<div> <img src = " +$imgSrc+" height="+height+" width="+width+" > </div>");//insert after
				$newTag = "&lt;div> <br> &emsp; &lt;img src = " +$imgSrc+" height="+height+" width="+width+" ><br>&lt;/div>";//create new tag
				updateOperations($newTag , false );//sends new tag to be displayed
				buttonTrigger = "";
				
			}
			//add Child (Either adding to existing children or first child created)
			if(buttonTrigger == "addChild")
			{
				
				if($curr.next().prop('tagName') == "UL")//if child already exists,  add a <div> 
				{
					$currTemp = $curr.next();
					$currTemp.append("<div> <img src = " +$imgSrc+" height="+height+" width="+width+" > </div>");//append
					$newTag = "&lt;div> <br> &emsp; &lt;img src = " +$imgSrc+" height="+height+" width="+width+" ><br>&lt;/div>";//create new tag
					updateOperations($newTag, false); //sends new tag to be displayed

				}
				//if no children exist then wrap with <UL>
				else
				{
					$curr.after("<ul><div> <img src = " +$imgSrc+" height="+height+" width="+width+"> </div></ul>");//insert after
					$newTag = "&lt;ul><br>&emsp;&lt;div> <br> &emsp;&emsp; &lt;img src = " +$imgSrc+" height="+height+" width="+width+" ><br>&emsp;&lt;/div><br>&lt;/ul>";//create new tag
					updateOperations($newTag, true);//sends new tag to be displayed
				}
			}
			//TOOK OUT ADD PARENT
			/*if(buttonTrigger == "addParent") //no point. Same as adding sibling
			{
				goUp();
				$currForImage = $curr.parent();//go to the div that contains image
				//add another div with image inside.
				$currForImage.after("<div> <img src = " +$imgSrc+" height="+height+" width="+width+" > </div>");//insert after
				$newTag = "&lt;div> <br> &emsp; &lt;img src = " +$imgSrc+" height="+height+" width="+width+" ><br>&lt;/div>";//create new tag
				updateOperations($newTag, false);
			}*/
			
			updateDOM();//update dom always (display)
	
	}
	
	//ADD an image to the carousel
	var file = "";
	//add image to the carousel
	$('#btnAddImage').click(function(){
		$('#imgFile').click();
		
		$(":file").change(function(){
			file = $('input[type=file]').val().split('\\').pop();//removes the "fake path" from the image path
			console.log(file);
			//$('div').removeClass("item active").addClass("item");
			//$('.item active').removeClass("item active").addClass("item");
			$('#carouselImages').after('<div class="item"><img src="img/'+file+'" height="96" width="75" ></div>');
		});

    });
	//change image on tree
	//switches current element with one clicked
	//event delegation
	$(".tree").on('dblclick', "img",  function() { //this allows the img to bubble up. Doen't work other wise with newly added elements
		//set current img to the image that was clicked
		var srcToSwap = $curr.attr("src");//store current image src
		//console.log(srcToSwap);
		$curr.attr("src", $(this).attr("src"));//set current image to clicked img
		$(this).attr("src", srcToSwap);//set current to srcToSwap
		
	});
	//display new Tag added
	//add color?
	//displays tags added to the DOM
	function updateOperations($newTag, $flag)//boolean flag for prism plug in.v(Best way to display html)
	{
		//$("#htmlFunc").html("<pre id='preTag'>" + $newTag + "</pre>");//display new tag added
		//$("#htmlFunc").html('<pre class="line-numbers" id="childCode" style="display: none"><pre><code  class="language-markup" id="childCodeCode"></code> </pre></pre>');
		//$("#childCodeCode").text('&lt;ul>&lt;div>&lt;img  src="img/39.png" height="96" width="75">&lt;/div>&lt;/ul>');		
		//show/hide pre code
		if($flag)
		{
			$("#childCode2").hide();//existing child
			$("#childCode").show();//non existing child
		}
		else
		{
			$("#childCode").hide();//non existing child
			$("#childCode2").show();//existing child
			
		}
	
	}

	//give user option to hide/show an elements children
	//doesn't work when 2 child nodes hidden. It only stores last child node hidden. Fix??
	//just disable buttons when hide clicked. Don't let user hide more than one set of children
	
	$('#showChildren').attr("disabled", true);//disable show	
	$('#hideChildren').on('click', function () {	
	
		if($curr.next().prop('tagName') == "UL")//if a child exists, allow hide
		{
			$thingToHide = $curr.next();
			$thingToHide.hide();//hide it
			$('#hideChildren').attr("disabled", true);//enable hide
			$('#showChildren').attr("disabled", false);//enable show
		}
		
	});
	//show children again of current node
	$('#showChildren').on('click', function () {	
		$thingToHide.show();
		$('#showChildren').attr("disabled", true);
		$('#hideChildren').attr("disabled", false);
	});
	//show operations
	$('#displayOperations').on('click', function () {	
		$("#operationsPanel").toggle("slow");
	});
	//remove a node
	$("#remove").click(function() {	
		removeNode();
	});
	
	//display the dom in the modal 
	function updateDOM()
	{
		var text  = $(".tree").html();
		$("#modalBody").html("<pre id = 'domPre'> </pre>");
		$("#domPre").text(text);
		$("#domPre").css("color", "#99004d");//bad way of diplaying. Fix?
	}
	//btn to show dom modal
	$("#displayDom").click(function() {
		updateDOM();
	});
	
		
	/*Tree Zoom**************/
	var height = 96;
	var width = 75;
	//zoom out of the dom tree
	$("#zoomOut").click(function() {

		//decrease each by 20%
		height = height * 0.85;
		width = width * 0.85;
		
		$("img").attr("height", height);
		$("img").attr("width", width);

		
	});
	//zoom in to the dom tree
	$("#zoomIn").click(function() {

		//increase each by 20%
		height = height * 1.15;
		width = width * 1.15;
		
		$("img").attr("height", height);
		$("img").attr("width", width);
		
	});
	/*End Tree Zoom**************/
	
	//*********** All arrow key clicks*********************
	$(document).keydown(function(e){
		
		if($('#myModal').is(':visible'))//arrow keys control carousel and nodes at same time otherwise
		{
			console.log("stop arrow keys");
		}
		else
		{
			if (e.keyCode == 37) { 
			   console.log( "left pressed" );
			   goLeft();		
			}
			if (e.keyCode == 38) { 
			   console.log( "up pressed" );
			   goUp();  
			}
			if (e.keyCode == 39) { 
			   console.log( "right pressed" );
			   goRight();	   
			}
			if (e.keyCode == 40) { 
			   console.log( "down pressed" ); 
			   goDown();
			}
			if (e.keyCode == 46) { 
			   console.log( "delete pressed" );
			   removeNode();
			}
		}
				
	});
	/*************************************/
	//prevents arrow keys from shifting page focus
	window.addEventListener("keydown", function(e) {
    // space and arrow keys
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);

});