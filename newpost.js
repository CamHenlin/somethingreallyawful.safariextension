var NewPostView = Backbone.View.extend({
	events: {
        "click #postsubmit": "newPost"
    },
    newPost: function() {
		sRA.newPost(
			currentThread,
			$("#posttext").text(),
			function() {
				loadThread(currentThread, currentThreadPage, currentThreadName);
			}
		);
    },
	template: _.template('\
		<div style="width: 95%;padding-left: auto;padding-right:auto;" class="blue exclude"> \
			<center><h2>New Post:</h2></center><br>\
			<div style="float: right; width: 150px;" id="postsubmit" class="live-tile one-wide <%= colors[Math.floor((Math.random()*6))] %> " data-speed="1750" \
			data-delay="<%= Math.floor((Math.random()*5000)+2000) %>"> \
				<span class="tile-title">new reply</span> \
				<div style="font-size: 25px;">post post post</div> \
				<div style="font-size: 25px;">click me</div> \
			</div> \
			<div class="white" style="background-color: white; width: 70%; height: 400px;float: left; color: black; margin-left: 175px; margin-bottom:100px;" contenteditable=true id="posttext"></div> \
		</div> \
    '),
	initialize: function() {
		_.bindAll(this, 'render');
	},
	render: function() {
		this.setElement(this.template());
		return this;
	}
});