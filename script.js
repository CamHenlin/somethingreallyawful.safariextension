var sRA = new somethingReallyAwful;

$('doccument').ready(function() {
	$('body').html("");
	sRA.getThreads(219, function(threads) {
		var table = "<div class='tiles blue tile-group four-wide'>";
		var colors = [
			"blue","green","purple","orange","red","teal"
		];
		threads.forEach(function(thread) {
			table += "<div class='live-tile " + colors[Math.floor((Math.random()*6))] + "' data-speed='1750' data-delay='" + Math.floor((Math.random()*5000)+2000) + "' onclick='handleLink(" + thread.id + ")'>" + // should be doing eventhandlers but im lazy
						"<span class='tile-title'>" + thread.replies + " replies<br> ruined by " + thread.killedBy + "</span>" +
						"<div style='font-size: 15px;'>" + thread.name + "</div>" +
						"<div style='font-size: 25px;'> started by "  + thread.author + "</div>" +
					"</div>";
		});
		table += "</div>";
		$('body').append(table);
		$(".live-tile, .flip-list").not(".exclude").liveTile();
	});
});



function submitPost() {
	sRA.newPost(
		$("#threadId").val(),
		$("#postText").val(),
		function() {
			alert('posted!');
			$("#postText").val("");
			$("#threadId").val("");
		}
	);
}