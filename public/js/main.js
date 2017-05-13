/**
 * jTinder initialization
 */
$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
			console.log(item);
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
	for (var i = 1; i < likedListContents.length; i++) {
		var ul = document.getElementById("likedDisplay");
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(likedListContents[i]));
		ul.appendChild(li);
	}
	var dislikedListContents = document.getElementById("dislikedList").innerHTML.split(" ");
	for (var i = 1; i < dislikedListContents.length; i++) {
		var ul = document.getElementById("dislikedDisplay");
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(dislikedListContents[i]));
		ul.appendChild(li);
	}
	document.getElementById("checkoutPage").style.display="block";
}
