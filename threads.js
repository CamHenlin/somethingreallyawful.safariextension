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

function getThreads(name, id) {
	$('.live-tile').liveTile("destroy");
	$('body').empty();
	currentForumName = name;
	currentForum = id;
	sRA.getThreads(id, function(threads) {
		var threadTileCollection = new Backbone.Collection();
		threads.forEach(function(thread) {
			threadTileCollection.add(new ThreadTileModel(thread));
		});
		var threadTilesView = new ThreadTilesView({collection: threadTileCollection});
		var forumHeaderModel = new ForumHeaderModel();
		forumHeaderModel.set("name", currentForumName);
		forumHeaderModel.set("id", currentForum);
		var forumHeaderView = new ForumHeaderView({model: forumHeaderModel});
   		$("body").prepend( forumHeaderView.render().$el );
   		$("body").append( threadTilesView.render().$el );

		$(".live-tile, .flip-list").not(".exclude").liveTile();
	});
}

function loadThread(threadId, page, name) {
	currentThread = threadId;
	currentThreadPage = page;
	currentThreadName = name;
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
		var threadHeaderModel = new ThreadHeaderModel();
		threadHeaderModel.set("id", currentForum);
		threadHeaderModel.set("name", currentThreadName);
		var threadHeaderView = new ThreadHeaderView({model: threadHeaderModel});

		var postTilesView = new PostTilesView({collection: postTileCollection});
   		$("body").prepend( threadHeaderView.render().$el );
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
        	loadThread(this.model.get("id"), Math.floor(this.model.get("replies") / 40), this.model.get("name"));
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
		this.$el.html(this.template(this.model.toJSON()));
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
	model: ThreadHeaderModel,
	events: {
        'click #backToThreadList': 'getThreads',
        'click #refreshPostList': 'getPosts'
    },
    getThreads: function() {
    	getThreads(currentForumName, currentForum);
    },
    getPosts: function() {
    	loadThread(currentThread, currentThreadPage, currentThreadName);
    },
	template: _.template('\
		<header> \
        	<div class="site-title"><a><%= name %></a></div> \
    	</header> \
    	<div id="backToThreadList" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">back to thread listing</span> \
			<div style="font-size: 25px;">get out</div> \
			<div style="font-size: 20px;">seriously</div> \
		</div> \
		<div id="refreshPostList" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">refresh the thread</span> \
			<div style="font-size: 25px;">f5 f5 f5</div> \
			<div style="font-size: 15px;">you know you want to</div> \
		</div> \
    '),
	initialize: function() {
		this.model.bind("change", this.render, this);
		_.bindAll(this, 'render');
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});