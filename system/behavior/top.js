/**
 *
 */
WSI.screendef(function Top() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	function frmContents_message_useredit(params) {
		_this.controls.dlgMain.show("ユーザー編集", system.Dialog.WidthTypes.EXTRA_LARGE, 640, [ system.Dialog.Buttons.CLOSE, system.Dialog.Buttons.SAVE ], "<?=url('/system/useredit.html') ?>", params);
	}

	function dlgMain_saved(params) {
		_this.controls.dlgMain.hide();
	}

	function goUserList_click(e) {
		_this.controls.frmContents.change("<?=url('/system/userlist.html') ?>", { container_id: "<?=$_GET['container_id'] ?>" });
	}

	_this.initialize = function initialize() {
		_base.initialize();
		//
		_this.controls.frmContents.on("message.useredit", frmContents_message_useredit);

		_this.controls.dlgMain.on("saved", dlgMain_saved);

		_this.controls.goUserList.click(goUserList_click);

		_this.controls.goUserList.click();
	};
});
