var NewPostView = Backbone.View.extend({
	events: {
        "#postsubmit click": function() {
			sRA.newPost(
				currentThread,
				$("#posttext").val(),
				function() {
					loadThread(this.model.get("id"));
				}
			);
         }
    },
	template: _.template('\
		<div style="width: 100%" class="live-tile blue exclude"> \
			<span>New Post:</span>\
			<div class="live-tile blue" style="width: 150px; height: 50px; float: right; color: white; background-color: #1ba1e2;" id="postsubmit"> submit post </div> \
			<div class="live-tile white" style="width: 75%;float: right; color: black;" contenteditable=true id="posttext"></div> \
		</div> \
    '),
	initialize: function() {},
	render: function() {
		this.setElement(this.template());
		return this;
	}
});