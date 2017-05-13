/**
 * jTinder initialization
 */
$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    // set the status text
        $('#status').html('Dislike image ' + (item.index()+1));
		$('#dislikedList').append(' ' + (item.index()+1));
    },
	// like callback
    onLike: function (item) {
	    // set the status text
        $('#status').html('Like image ' + (item.index()+1));
		$('#likedList').append(' ' + (item.index()+1));
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});

function goToCheckOut() {
	
	document.getElementById("biggerWrap").style.display="none";
	var likedListContents = document.getElementById("likedList").innerHTML.split(" ");
	
	var category2List = document.getElementById("category2").innerHTML.split(" ");
	var category3List = document.getElementById("category3").innerHTML.split(" ");
	var category4List = document.getElementById("category4").innerHTML.split(" ");
	
	for (var i = 1; i < likedListContents.length; i++) {
		var ul = document.getElementById("likedDisplay");
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(likedListContents[i]));
		ul.appendChild(li);
		
		var category = 1;
		for (var j = 0; j < category2List.length; j ++) {
			if (category2List[j] == likedListContents[i]) category = 2; 
		}
		for (var j = 0; j < category3List.length; j ++) {
			if (category3List[j] == likedListContents[i]) category = 3; 
		}
		for (var j = 0; j < category4List.length; j ++) {
			if (category4List[j] == likedListContents[i]) category = 4; 
		}
		
		var itemDisplay = document.createElement("div");
		itemDisplay.className = "col-md-3 col-sm-6 hero-feature itemType" + category;
		var itemThumbnail = document.createElement("div");
		itemThumbnail.className = "thumbnail";
		var itemImage = document.createElement("img");
		itemImage.setAttribute("src", "img/pane/pane" + likedListContents[i] + ".jpg");
		var itemCaption = document.createElement("div");
		itemCaption.className = "caption";
		var itemCaptionTitle = document.createElement("h3");
		var itemCaptionTitleText = document.getElementById("title" + likedListContents[i]).innerHTML;
		itemCaptionTitle.innerHTML = itemCaptionTitleText;
		var itemCaptionDescription = document.createElement("p");
		var itemCaptionDescriptionText = document.getElementById("description" + likedListContents[i]).innerHTML;
		itemCaptionDescription.innerHTML = itemCaptionDescriptionText;
		var itemCaptionButtons = document.createElement("p");
		var itemCaptionButton1 = document.createElement("a");
		itemCaptionButton1.className = "btn btn-primary";
		itemCaptionButton1.innerHTML = "Buy Now!";
		var itemCaptionButton2 = document.createElement("a");
		itemCaptionButton2.className = "btn btn-default";
		itemCaptionButton2.innerHTML = "More Info";
		itemCaptionButtons.appendChild(itemCaptionButton1);
		itemCaptionButtons.appendChild(itemCaptionButton2);
		itemCaption.appendChild(itemCaptionTitle);
		itemCaption.appendChild(itemCaptionDescription);
		itemCaption.appendChild(itemCaptionButtons);
		itemThumbnail.appendChild(itemImage);
		itemThumbnail.appendChild(itemCaption);
		itemDisplay.appendChild(itemThumbnail);
		
		var featuresDisplay = document.getElementById("features");
		featuresDisplay.appendChild(itemDisplay);
	}
	var dislikedListContents = document.getElementById("dislikedList").innerHTML.split(" ");
	for (var i = 1; i < dislikedListContents.length; i++) {
		var ul = document.getElementById("dislikedDisplay");
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(dislikedListContents[i]));
		ul.appendChild(li);
	}
	document.getElementById("checkoutPage").style.display="block";
	document.body.style.overflow = "initial";
}
function goToSelect() {
	document.getElementById("biggerWrap").style.display="block";
	document.getElementById("checkoutPage").style.display="none";
	document.getElementById("likedList").innerHTML = "";
	document.getElementById("dislikedList").innerHTML = "";
	document.body.style.overflow = "hidden";
}