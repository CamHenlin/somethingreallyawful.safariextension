var somethingReallyAwful = function() {
	/**
	 * [Thread object]
	 * @param {[type]} id       [thread id]
	 * @param {[type]} name     [thread name]
	 * @param {[type]} replies  [number of replies]
	 * @param {[type]} views    [number of views]
	 * @param {[type]} author   [thread author]
	 * @param {[type]} authorId [id of thread author]
	 * @param {[type]} rating   [thread rating]
	 * @param {[type]} votes    [thread votes contributing to rating]
	 * @param {[type]} icon     [id of icon used by thread]
	 */
	var Thread = function (id, name, replies, views, author, authorId, iconId, killedBy, rating, votes) {
		this.id         = id;
		this.name       = name;
		this.replies    = replies;
		this.views      = views;
		this.author     = author;
		this.authorId   = authorId;
		this.iconId 	= iconId;
		this.killedBy   = killedBy;
		this.rating     = rating;
		this.votes 		= votes;
	};

	/**
	 * [Forum object]
	 * @param {[type]} id          [forum id]
	 * @param {[type]} name        [forum name]
	 * @param {[type]} description [forum description]
	 * @param {[type]} moderators  [string array of moderator names]
	 */
	var Forum = function (id, name, description, moderators) {
		this.id          = id;
		this.name        = name;
		this.description = description;
		this.moderators  = moderators;
	};

	/**
	 * [Post description]
	 * @param {[type]} id       [description]
	 * @param {[type]} postTime [description]
	 * @param {[type]} author   [description]
	 * @param {[type]} authorId [description]
	 * @param {[type]} postText [description]
	 */
	var Post = function (id, postTime, author, authorId, postText) {
		this.id       = id;
		this.postTime = postTime;
		this.author   = author;
		this.authorId = authorId;
		this.postText = postText;
	};

	/**
	 * [getThreads gets threads by id and sends them to callback function]
	 * @param  {[type]}   forumId  [forum id]
	 * @param  {Function} callback [function that you want to use to interact with the thread data. thread data is an array of thread objects]
	 */
	this.getThreads = function (forumId, callback, page) {
		var threads = [];
		var url = "http://forums.somethingawful.com/forumdisplay.php?forumid=" + forumId + ((typeof(page) !== "undefined") ? "&pagenumber=" + page : "");
		$.ajax({
			url: url,
			type: "GET",
			success: function (pageData) {
				var threadEls = $(pageData).find('#forum').children('tbody').children('tr');
				threadEls.each(function(threadTr) {
					threadTr = $(threadEls[threadTr])[0];
					threads.push(
						new Thread (
							$(threadTr).find('.thread_title').attr('href').split('threadid=')[1], // id
							$(threadTr).find('.thread_title').text(), // name
							$(threadTr).find('.replies').text(), // replies
							$(threadTr).find('.views').text(), // views
							$(threadTr).find('.author')[0].textContent, // author
							$(threadTr).find('.author').find('a').attr('href').split('userid=')[1], // authorid
							$(threadTr).find('.icon').find('a').attr('href').split('posticon=')[1], // iconid
							$($(threadTr).children()[7]).children()[1].textContent, // killed by
							(typeof($($(threadTr).children()[6]).children()[0]) !== "undefined") ? $($(threadTr).children()[6]).children()[0].getAttribute('title').split(' votes - ')[1].split(' average')[0] : null, // rating
							(typeof($($(threadTr).children()[6]).children()[0]) !== "undefined") ? $($(threadTr).children()[6]).children()[0].getAttribute('title').split(' votes -')[0] : null // votes
						)
					);
				});

				callback(threads);
			},
			error: function(xhr, status, error) {
				alert(error);
			}
		});
	};

	/**
	 * [getForums gets the list of the forums. this list includes subforums! subforums, instead of a list of moderators, have "subforum" filling that moderator. description will also be subforum]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	this.getForums = function (callback) {
		var forums = [];
		$.ajax({
			url: "http://forums.somethingawful.com/index.php",
			type: "GET",
			success: function (pageData) {
				var threadEls = $(pageData).find('#forums').children('tbody').children('tr');
				threadEls.each(function(threadTr) {
					threadTr = $(threadEls[threadTr])[0];
					if (threadTr.className !== "section") { // don't want section rows
						forums.push(
							new Forum (
								threadTr.children[0].children[0].href.split('forumid=')[1], // id
								threadTr.children[1].children[0].text, // name
								threadTr.children[1].children[0].title, // description
								threadTr.children[2].textContent.split(',') // moderators
							)
						);
					}
				});

				// get subforums
				threadEls = $(pageData).find(".subforums a");
				threadEls.each(function(subforumItem) {
					subforumItem = $(threadEls[subforumItem])[0];
					forums.push(
						new Forum (
							subforumItem.href.split('forumid=')[1], // id
							subforumItem.text, // name
							"subforum", // description
							"subforum" // moderators
						)
					)
				});

				callback(forums);
			},
			error: function (xhr, status, error) {
				alert(error);
			}
		});
	};

	/**
	 * [getPosts description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	this.getPosts = function (threadId, callback, page) {
		var posts = [];
		var url = "http://forums.somethingawful.com/showthread.php?threadid=" + threadId + ((typeof(page) !== "undefined") ? "&pagenumber=" + page : "");
		$.ajax({
			url: url,
			type: "GET",
			success: function (pageData) {
				var threadEls = $(pageData).find('#thread').children();
				threadEls.each(function(threadDiv) {
					threadDiv = $(threadEls[threadDiv])[0];

					posts.push(
						new Post (
							$(threadDiv).find('a').last()[0].href.split('postid=')[1], // id
							$(threadDiv).find('.postdate').text().split('?')[1].trim(), // posttime
							$(threadDiv).find('.author').text(), // author
							$(threadDiv).find('.userinfo')[0].attributes.class.textContent.split('userid-')[1], // authorId
							$(threadDiv).find('.postbody').html() // postText
						)
					);
				});

				callback(posts);
			},
			error: function (xhr, status, error) {
				alert(error);
			}
		});
	};

	/**
	 * [newPost creates a new post]
	 * @param  {[type]}   threadId [description]
	 * @param  {[type]}   postText [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	this.newPost = function (threadId, postText, callback) {
		var makePost = function(data) {
			var formkey = $(data).find("input[name='formkey']").attr('value');
			var form_cookie = $(data).find("input[name='form_cookie']").attr('value');
			$.ajax({
				url: "http://forums.somethingawful.com/newreply.php",
				type: "POST",
				data: {
					"action" : "postreply",
					"threadid" : threadId,
					"formkey" : formkey,
					"form_cookie" : form_cookie,
					"message" : postText,
					"parseurl" : "yes",
					"bookmark" : "no",
					"disablesmilies" : "no",
					"signature" : "no",
					"MAX_FILE_SIZE" : "2097152",
					"attachment" : "",
					"submit" : "Submit Reply"
				},
				success: function (pageData) {
					callback(pageData);
				},
				error: function (xhr, status, error) {
					alert(error);
				}
			});
		};

		$.ajax({
			url: "http://forums.somethingawful.com/newreply.php?action=newreply&threadid=" + threadId,
			type: "GET",
			success: makePost,
			error: function (xhr, status, error) {
				alert(error);
			}
		});
	};
};
