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
		};
	}
});

function loadThread(threadId, page) {
	currentThread = threadId;
	currentThreadPage = page;
	$('.live-tile').liveTile("destroy");
	$('body').empty();
	sRA.getPosts(threadId, function(posts) {
		var postTileCollection = new Backbone.Collection();
		posts.forEach(function(post) {
			post.postText = post.postText.replace("bbc-block\"", "\" style=\"background-color:#a200ff;height: 100%;margin:15px;padding:5px;position:realtive; width: 90%;\"")
										 .replace("bbc-block\"", "\" style=\"background-color:#a200ff;height: 100%;margin:15px;padding:5px;position:realtive; width: 90%;\"")
										 .replace("slideback ha", "")
										 .replace("bbc-block code\"", "\" style=\"background-color:#00aba9;\"");
			postTileCollection.add(new PostTileModel(post));
		});
		var postTilesView = new PostTilesView({collection: postTileCollection});
   		$("body").append( postTilesView.render().$el );
		$("body").append( (new NewPostView()).render().$el );

		$(".live-tile, .flip-list").not('.exclude').liveTile();
	},
	page + 1);
}

var ThreadTilesView = Backbone.View.extend({
	template: _.template('<div style="width: 100%;" class="tiles blue tile-group four-wide"></div>'),
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
		var threadTile = new ThreadTileView({ model: model });
		this.$el.append(threadTile.render().$el);
		return this;
	}
});

var ThreadTileView = Backbone.View.extend({
	model: ThreadTileModel,
	events: {
        "click": function() {
        	loadThread(this.model.get("id"), Math.floor(this.model.get("replies") / 40));
         }
    },
	template: _.template('\
		<div style="width: 200px; height: 200px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
		data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title"><%= replies %> replies<br> ruined by <%= killedBy %><br><%= rating %>/5 rating</span> \
			<div style="font-size: 20px;"><%= name %></div> \
			<div style="font-size: 20px;"> started by <%= author %></div> \
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

var ThreadHeaderModel = Backbone.Model.extend({
	defaults: function () {
		return {
			"id"         : "",
			"name"       : "",
			"forumId"    : ""
		};
	}
});

var ThreadHeaderView = Backbone.View.extend({
	model: ThreadTileModel,
	events: {
        "click #back": function() {
        	loadThread(this.model.get("id"), Math.floor(this.model.get("replies") / 40));
         }
    },
	template: _.template('\
		<header> \
        <div class="site-title"><a href="/"><%= name %></a></div> \
    	</header> \
    	<div style="width: 200px; height: 200px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">back to forums listing</span> \
			<div style="font-size: 20px;">get out</div> \
			<div style="font-size: 20px;">seriously</div> \
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