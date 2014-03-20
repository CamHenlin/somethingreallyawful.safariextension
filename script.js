var sRA = new somethingReallyAwful();
var colors = [
	"blue","green","purple","orange","red","teal"
];

// sRA.getPosts(3522839, function(posts) { posts.forEach(function(post) { console.log(post.postText); }); } );

var currentThread = null;

$('doccument').ready(function() {
	$('body').empty();
	sRA.getForums(function(forums) {
		var forumsTileCollection = new Backbone.Collection();
		forums.forEach(function(forums) {
			forumsTileCollection.add(new ForumTileModel(forums));
		});
		var forumTilesView = new ForumTilesView({collection: forumsTileCollection});
   		$("body").append( forumTilesView.render().$el );

		$(".live-tile, .flip-list").not(".exclude").liveTile();
	});
});

