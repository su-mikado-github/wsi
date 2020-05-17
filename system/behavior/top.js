/**
 *
 */
WSI.screendef(function Top() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	function aciveMenu(menu, menuList) {
		menu.classList().add("active");
		menuList.finds("a.active").forEach(function(m) {
			if (menu.target !== m.target) {
				m.classList().remove("active");
			}
		});
	}

	function frmContents_message_useredit(e) {
		_this.controls.dlgMain.show("ユーザー編集", system.Dialog.WidthTypes.EXTRA_LARGE, "640px", [ system.Dialog.Buttons.CANCEL, system.Dialog.Buttons.SAVE ], "<?=url('/system/useredit.html') ?>", e.data);
	}

	function dlgMain_saved(params) {
		_this.controls.dlgMain.hide();

		_this.controls.goUserList.click();
	}

	function goUserList_click(e) {
		_this.controls.frmContents.change("<?=url('/system/userlist.html') ?>", { container_id: "<?=$_GET['container_id'] ?>" });
		aciveMenu(_this.controls.goUserList, _this.controls.mnuLeft);
//		_this.controls.mnuLeft.finds("a.active").forEach(function(m) { m.classList().remove("active"); });
//		_this.controls.goUserList.classList().add("active");
	}

	function frmContents_message_usercreate(e) {
		_this.controls.dlgMain.show("ユーザー登録", system.Dialog.WidthTypes.EXTRA_LARGE, null, [ system.Dialog.Buttons.CANCEL, system.Dialog.Buttons.SAVE ], "<?=url('/system/useredit.html') ?>");
	}

	function frmContents_message_usersetting(e) {
		_this.controls.dlgMain.show("ユーザー属性設定", system.Dialog.WidthTypes.CUSTOM_90P, null, [ system.Dialog.Buttons.CANCEL, system.Dialog.Buttons.SAVE ], "<?=url('/system/setting.html') ?>");
	}

	function goLogout_click(e) {
		WSI.method("<?=url('/system/top.json') ?>", null, null, function(result) {
			_this.reload();
		});
	}

	_this.initialize = function initialize() {
		_base.initialize();
		//

		_this.controls.goLogout.click(goLogout_click);

		_this.controls.frmContents.on("message.useredit", frmContents_message_useredit);

		_this.controls.dlgMain.on("saved", dlgMain_saved);

		_this.controls.goUserList.click(goUserList_click);

		_this.controls.frmContents.on("message.usercreate", frmContents_message_usercreate);

		_this.controls.frmContents.on("message.usersetting", frmContents_message_usersetting);

		_this.controls.goUserList.click();
	};
});
