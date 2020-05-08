/**
 *
 */
WSI.screendef(function Top() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	var _parentMessage = new WSI.Message(parent, parent.location.protocol+"//"+parent.location.hostname);

	var _users = [];

	_this.mapping();

	_this.initialize = function initialize() {
		WSI.method("<?=url('/system/userlist.json') ?>", null, null, function(result) {
			console.log(JSON.stringify(result));

			var tbody = _this.controls.tblUserlist.find("tbody");

			_users = [];
			for (var i in result.params.users) {
				var user = result.params.users[i];
				_users.push(user);
				tbody.append(
					WSI.tag("tr")
						.data("user_id", user.user_id)
						.append(WSI.tag("td").text(user.user_id))
						.append(WSI.tag("td").text(user.login_id))
						.append(WSI.tag("td").text(user.admin_flag ? "○" : "　 "))
						.append(WSI.tag("td").text(user.temporary ? "仮登録中" : "本登録済"))
						.append(WSI.tag("td").text(user.regist_date))
						.append(WSI.tag("td").text(user.delete_flag ? "×" : "　"))
				);
			}
		});
	};

	_this.controls.tblUserlist.click(function(e) {
		if (e.target.tagName === "TD") {
			var tag = WSI.tag(e.target);
			var user_id = tag.parent().data("user_id");
//			_parentMessage.raise("useredit", { user_id: user_id });
			_this.message("useredit", { user_id: user_id });
		}
	});
});
