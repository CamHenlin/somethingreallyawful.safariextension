var ThreadTileModel = Backbone.Model.extend({
	defaults: function () {
		return {
			"id"         : "",
			"name"       : "",
			"replies"    : "",
			"views"      : "",
			"author"     : "",
			"authorId"   : "",
			"iconImage"  : "",
			"killedBy"   : "",
			"rating"     : "",
			"votes"      : "",
			"unread"	 : ""
		};
	}
});

function getThreads(name, id) {
	$('.live-tile').liveTile("destroy");
	$('body').empty();
	currentThread = null;
	currentThreadPage = null;
	currentThreadName = null;
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
	console.log("loading page " + page + " type " + typeof(page));
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
		threadHeaderModel.set("name", currentThreadName);
		var threadHeaderView = new ThreadHeaderView({model: threadHeaderModel});
		var threadFooterView = new ThreadFooterView({model: threadHeaderModel});

		var postTilesView = new PostTilesView({collection: postTileCollection});
   		$("body").prepend( threadHeaderView.render().$el );
   		$("body").append( postTilesView.render().$el );
		$("body").append( (new NewPostView()).render().$el );
   		$("body").append( threadFooterView.render().$el );

		$(".live-tile, .flip-list").not('.exclude').liveTile();

		/*
			using a timer here and feel like i need to explain myself. this code will be reached before the page is done rendering, so on longer threads
			it will end up in the middle of the page instead of on the page you want. timer gives the page a chance to render.
		 */
		setTimeout(function() {
			var lastSeen = $(".sra-seen");
			if (lastSeen.length !== 0) {
				scrollToElement(lastSeen[lastSeen.length - 1], 500, 0);
			}
		}, 500);

	},
	page);
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
        	currentThreadReplies = this.model.get("replies");
        	loadThread(this.model.get("id"), Math.ceil((this.model.get("replies") - this.model.get("unread")) / 40), this.model.get("name"), this.model.get("replies"));
         }
    },
	template: _.template('\
		<div style="width: 200px; height: 200px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
		data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title"><%= name %> <%= replies %> replies<br> ruined by <%= killedBy %><br><%= rating %>/5 rating</span> \
			<div style="font-size: 20px;"><%= name %></div> \
			<div style="font-size: 25px; background-image: url(\'<%= iconImage %>\');background-repeat:no-repeat;background-size: contain;background-position:center center;"> started by <%= author %></div> \
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
			"forumId"    : "",
			"replies"	 : ""
		};
	}
});

var ThreadHeaderView = Backbone.View.extend({
	model: ThreadHeaderModel,
	events: {
		'click #backToThreadList': 'getThreads',
		'click #refreshPostList': 'getPosts',
		'click #nextPage': 'nextPage',
		'click #previousPage': 'previousPage',
		'click #lastPage': 'lastPage'
    },
    getThreads: function() {
    	getThreads(currentForumName, currentForum);
    },
    getPosts: function() {
    	loadThread(currentThread, currentThreadPage, currentThreadName);
    },
    nextPage: function() {
    	loadThread(currentThread, ++currentThreadPage, currentThreadName);
    },
    previousPage: function() {
    	loadThread(currentThread, --currentThreadPage, currentThreadName);
    },
    lastPage: function() {
    	loadThread(currentThread, Math.ceil(currentThreadReplies / 40), currentThreadName);
    },
	template: _.template('\
		<header> \
        	<div class="site-title"><a><%= name %></a></div> \
    	</header><br><br><br><br> \
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
		<div id="nextPage" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">goes to the next page</span> \
			<div style="font-size: 15px;">would you like to know more?</div> \
			<div style="font-size: 15px;">you need to know more</div> \
		</div> \
		<div id="previousPage" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">goes to the previous page</span> \
			<div style="font-size: 15px;">what happened?</div> \
			<div style="font-size: 15px;">you have forgotten</div> \
		</div> \
		<div id="lastPage" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">goes to the last page</span> \
			<div style="font-size: 25px;">tldr</div> \
			<div style="font-size: 15px;">dont care</div> \
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

var ThreadFooterView = Backbone.View.extend({
	model: ThreadHeaderModel,
	events: {
		'click #backToThreadList': 'getThreads',
		'click #refreshPostList': 'getPosts',
		'click #nextPage': 'nextPage',
		'click #previousPage': 'previousPage',
		'click #lastPage': 'lastPage'
    },
     getThreads: function() {
    	getThreads(currentForumName, currentForum);
    },
    getPosts: function() {
    	loadThread(currentThread, currentThreadPage, currentThreadName);
    },
    nextPage: function() {
    	loadThread(currentThread, ++currentThreadPage, currentThreadName);
    },
    previousPage: function() {
    	loadThread(currentThread, --currentThreadPage, currentThreadName);
    },
    lastPage: function() {
    	loadThread(currentThread, Math.ceil(currentThreadReplies / 40), currentThreadName);
    },
	template: _.template('\
		<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><footer> \
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
		<div id="nextPage" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">goes to the next page</span> \
			<div style="font-size: 15px;">would you like to know more?</div> \
			<div style="font-size: 15px;">you need to know more</div> \
		</div> \
		<div id="previousPage" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">goes to the previous page</span> \
			<div style="font-size: 15px;">what happened?</div> \
			<div style="font-size: 15px;">you have forgotten</div> \
		</div> \
		<div id="lastPage" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">goes to the last page</span> \
			<div style="font-size: 25px;">tldr</div> \
			<div style="font-size: 15px;">dont care</div> \
		</div> \
		</footer> \
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
