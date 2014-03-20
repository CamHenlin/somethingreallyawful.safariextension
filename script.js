var sRA = new somethingReallyAwful;
var colors = [
	"blue","green","purple","orange","red","teal"
];

var ThreadTileModel = Backbone.Model.extend({
	defaults: function () {
		return {
			"id"         : "",
			"name"       : "",
			"replies"    : "",
			"views"      : "",
			"author"     : "",
			"authorId"   : "",
			"iconId" 	 : "",
			"killedBy"   : "",
			"rating"     : "",
			"votes"      : ""
		}
	}
});

var ThreadTilesView = Backbone.View.extend({
	template: _.template('<div class="tiles blue tile-group four-wide"></div>'),
	initialize: function() {
		this.setElement(this.template());
		_.bindAll(this, 'render', 'renderOne');
		if (this.model) {
			this.model.on('change', this.render, this);
		}
	},
	render: function() {
		this.collection.each(this.renderOne);
		return this;
	},
	renderOne: function(model) {
		console.log(model);
		var threadTile = new ThreadTileView({ model: model });
		this.$el.append(threadTile.render().$el);
		return this;
	}
});

var ThreadTileView = Backbone.View.extend({
	model: ThreadTileModel,
	events: {
        "click": function() { console.log(this.model.get("name")); }
    },
	template: _.template('\
		<div class="live-tile " <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
		data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title"><%= replies %> replies<br> ruined by <%= killedBy %></span> \
			<div style="font-size: 15px;"><%= name %></div> \
			<div style="font-size: 25px;"> started by <%= author %></div> \
		</div> \
    '),
	initialize: function() {
		this.model.bind("change", this.render, this);
	},
	render: function() {
		this.setElement(this.template(this.model.toJSON()));
		return this;
	}
});

var ForumTileModel = Backbone.Model.extend({
	defaults: function () {
		return {
			"id"          : "",
			"name"        : "",
			"description" : "",
			"moderators"  : ""
		}
	}
});

var ForumTilesView = Backbone.View.extend({
	template: _.template('<div class="tiles blue tile-group four-wide"></div>'),
	initialize: function() {
		this.setElement(this.template());
		_.bindAll(this, 'render', 'renderOne');
		if (this.model) {
			this.model.on('change', this.render, this);
		}
	},
	render: function() {
		this.collection.each(this.renderOne);
		return this;
	},
	renderOne: function(model) {
		console.log(model);
		var forumTile = new ForumTileView({ model: model });
		this.$el.append(forumTile.render().$el);
		return this;
	}
});

var ForumTileView = Backbone.View.extend({
	model: ForumTileModel,
	events: {
        "click": function() {
			$('body').html("");
        	sRA.getThreads(this.model.get("id"), function(threads) {
				var threadTileCollection = new Backbone.Collection();
				threads.forEach(function(thread) {
					threadTileCollection.add(new ThreadTileModel(thread));
				});
				var threadTilesView = new ThreadTilesView({collection: threadTileCollection});
		   		$("body").append( threadTilesView.render().$el );

				$(".live-tile, .flip-list").not(".exclude").liveTile();
			});
       	}
    },
	template: _.template('\
		<div class="live-tile " <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
		data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title"><%= description %></span> \
			<div style="font-size: 15px;"><%= name %></div> \
			<div style="font-size: 25px;"> moderated by <%= moderators %></div> \
		</div> \
    '),
	initialize: function() {
		this.model.bind("change", this.render, this);
	},
	render: function() {
		this.setElement(this.template(this.model.toJSON()));
		return this;
	}
});

$('doccument').ready(function() {
	$('body').html("");
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