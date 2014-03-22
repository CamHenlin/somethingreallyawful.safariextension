var sRA = new somethingReallyAwful();
var colors = [
	"blue","green","purple","orange","red","teal"
];

// sRA.getPosts(3522839, function(posts) { posts.forEach(function(post) { console.log(post.postText); }); } );

var currentThread = null;
var currentThreadPage = null;
var currentThreadName = null;
var currentThreadReplies = null;
var currentForum = null;
var currentForumName = null;

$('doccument').ready(function() {
	$('body').removeClass("forumhome");
	$('body').addClass("projects-metrojs");
	$('body').addClass("desktop");
	$('body').empty();
	getForums();
});

/**
 * [scrollToElement stolen directly from http://www.dconnell.co.uk/blog/index.php/2012/03/12/scroll-to-any-element-using-jquery/]
 * @param  {[type]} selector       [description]
 * @param  {[type]} time           [description]
 * @param  {[type]} verticalOffset [description]
 * @return {[type]}                [description]
 */
function scrollToElement(selector, time, verticalOffset) {
    time = typeof(time) != 'undefined' ? time : 1000;
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time);
}