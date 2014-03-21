var sRA = new somethingReallyAwful();
var colors = [
	"blue","green","purple","orange","red","teal"
];

// sRA.getPosts(3522839, function(posts) { posts.forEach(function(post) { console.log(post.postText); }); } );

var currentThread = null;
var currentThreadPage = null;
var currentThreadName = null;
var currentForum = null;
var currentForumName = null;

$('doccument').ready(function() {
	$('body').removeClass("forumhome");
	$('body').addClass("projects-metrojs");
	$('body').addClass("desktop");
	$('body').empty();
	getForums();
});

