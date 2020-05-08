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
		_this.controls.dlgMain.show("ユーザー編集", system.Dialog.WidthTypes.EXTRA_LARGE, 640, [ system.Dialog.Buttons.CLOSE, system.Dialog.Buttons.SAVE ], "<?=url('/system/useredit.html') ?>", e.data);
	}

	function dlgMain_saved(params) {
		_this.controls.dlgMain.hide();
	}

	function goUserList_click(e) {
		_this.controls.frmContents.change("<?=url('/system/userlist.html') ?>", { container_id: "<?=$_GET['container_id'] ?>" });
		aciveMenu(_this.controls.goUserList, _this.controls.mnuLeft);
//		_this.controls.mnuLeft.finds("a.active").forEach(function(m) { m.classList().remove("active"); });
//		_this.controls.goUserList.classList().add("active");
	}

	function btnDummyMenu1_click(e) {
		_this.controls.frmContents.change("<?=url('/system/userlist.html') ?>", { container_id: "<?=$_GET['container_id'] ?>" });
		aciveMenu(_this.controls.btnDummyMenu1, _this.controls.mnuLeft);
//		_this.controls.mnuLeft.finds("a.active").forEach(function(m) { m.classList().remove("active"); });
//		_this.controls.goUserList.classList().add("active");
	}

	_this.initialize = function initialize() {
		_base.initialize();
		//
		_this.controls.frmContents.on("message.useredit", frmContents_message_useredit);

		_this.controls.dlgMain.on("saved", dlgMain_saved);

		_this.controls.goUserList.click(goUserList_click);
		_this.controls.btnDummyMenu1.click(btnDummyMenu1_click);

		_this.controls.goUserList.click();
	};
});
