var PostTileModel = Backbone.Model.extend({
	defaults: function () {
		return {
			"id"       : "",
			"postTime" : "",
			"author"   : "",
			"authorId" : "",
			"postText" : "",
			"seen"	   : "",
			"avatar"   : ""
		};
	}
});

var PostTilesView = Backbone.View.extend({
	template: _.template('<div></div>'),
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
		var postTile = new PostTileView({ model: model });
		this.$el.append(postTile.render().$el);
		return this;
	},
});

var PostTileView = Backbone.View.extend({
	model: PostTileModel,
	events: {
        "click #quote": function() {
        	$("#posttext").append('\
				[quote="' + this.model.get("author") + '" post="' + this.model.get("id") + '"]\
				' + this.model.get("postText") + '\
				[/quote]');
       	}
    },
	template: _.template('\
		<div class="tile-group one-wide first" style="width: 95%; margin: 10px;"> \
			<div style="float: left; width: 150px;" class="live-tile one-wide <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
				<span class="tile-title"><%= postTime %></span> \
				<div style="font-size: 25px;"><%= author %></div> \
				<div style="font-size: 25px; background-image: url(\'<%= avatar %>\');background-size:100% 100%;"><%= author %></div> \
			</div> \
			<div style="overflow-y: visible; width: 85%; height: 100%; background-color: <%= color %>; padding: 8px;margin-top:3px; float: right;"> \
				<%= postText %> \
				<br> \
				<p style="font-size: 9px"> <%= postTime %></p> \
				<div id="quote" style="float: left; width: 150px;" class="live-tile one-wide <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
				data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
					<span class="tile-title">quote this post</span> \
					<div style="font-size: 20px;">it\'s a good post</div> \
					<div style="font-size: 25px;">do it</div> \
				</div> \
			</div> \
		</div> \
    '),
	initialize: function() {
		this.model.bind("change", this.render, this);
		_.bindAll(this, 'render');
	},
	render: function() {
		this.model.set("color", (this.model.get("seen")) ? "#00aba9" : "#1ba1e2");
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});