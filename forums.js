var ForumTileModel = Backbone.Model.extend({
	defaults: function () {
		return {
			"id"          : "",
			"name"        : "",
			"description" : "",
			"moderators"  : ""
		};
	}
});

function getForums() {
	sRA.getForums(function(forums) {
		$('.live-tile').liveTile("destroy");
		$('body').empty();
		var forumsTileCollection = new Backbone.Collection();
		forums.forEach(function(forums) {
			forumsTileCollection.add(new ForumTileModel(forums));
		});
		var forumTilesView = new ForumTilesView({collection: forumsTileCollection});
		var forumsHeaderView = new ForumsHeaderView();
   		$("body").prepend( forumsHeaderView.render().$el );
   		$("body").append( forumTilesView.render().$el );

		$(".live-tile, .flip-list").not(".exclude").liveTile();
	});
}

var ForumTilesView = Backbone.View.extend({
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
		var forumTile = new ForumTileView({ model: model });
		this.$el.append(forumTile.render().$el);
		return this;
	}
});

var ForumTileView = Backbone.View.extend({
	model: ForumTileModel,
	events: {
        "click": function() {
        	getThreads(this.model.get("name"), this.model.get("id"));
       	}
    },
	template: _.template('\
		<div style="width: 200px; height: 200px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
		data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title"><%= description %></span> \
			<div style="font-size: 30px;"><%= name %></div> \
			<div style="font-size: 20px;"> moderated by <%= moderators %></div> \
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

var ForumHeaderModel = Backbone.Model.extend({
	defaults: function () {
		return {
			"id"         : "",
			"name"       : "",
			"forumId"    : ""
		};
	}
});

var ForumHeaderView = Backbone.View.extend({
	model: ForumHeaderModel,
	events: {
        'click #backToForumList': 'getForums'
    },
    getForums: function() {
    	getForums();
    },
	template: _.template('\
		<header> \
        <div class="site-title"><a><%= name %></a></div> \
    	</header> \
    	<div id="backToForumList" style="width: 100px; height: 100px;" class="live-tile <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
			<span class="tile-title">back to forums listing</span> \
			<div style="font-size: 25px;">get out</div> \
			<div style="font-size: 20px;">seriously</div> \
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

var ForumsHeaderView = Backbone.View.extend({
	template: _.template('\
		<header> \
        <div class="site-title"><a href="/">something awful</a></div> \
    	</header> \
    '),
	initialize: function() {
	},
	render: function() {
		this.$el.html(this.template());
		return this;
	}
});