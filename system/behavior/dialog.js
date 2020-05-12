/**
 *
 */
WSI.namespace("system", function(ns) {
	ns.Dialog = WSI.classdef(WSI.Dialog, function Dialog(screen, tag) {
		WSI.Dialog.call(this, screen, tag);

		var _base = this.base();
		var _this = this;

		var _id = _this.data("id");

		var _bodyWindow = window[_id+"_body"];

		var _title = null;
		var _close = null;
		var _cancel = null;
		var _save = null;
		var _commit = null;

		var _modal = null;
		var _body = null;

		_this.initialize = function initialize() {
			_base.initialize();

			_modal = _this.find(".modal-dialog");
			_body = _this.controls[_id+"_body"];

			_title = _this.controls[_id+"_label"];
			_close = _this.controls[_id+"_close"].click(function(e) {
				_body.message("close");
			});
			_cancel = _this.controls[_id+"_cancel"].click(function(e) {
				_body.message("cancel");
			});
			_save = _this.controls[_id+"_save"].click(function(e) {
				_body.message("save");
			});
			_commit = _this.controls[_id+"_commit"].click(function(e) {
				_body.message("commit");
			});

			_body.on("message.ready", function(e) {
				$("#"+_id).modal("show");
			});

			_body.on("message.closed", function(e) {
				$("#"+_id).modal("hide");
			});

			_body.on("message.canceled", function(e) {
				$("#"+_id).modal("hide");
			});

			_body.on("message.saved", function(e) {
				$("#"+_id).modal("hide");
			});

			_body.on("message.commited", function(e) {
				$("#"+_id).modal("hide");
			});
		};

		_this.show = function show(title, widthType, height, buttons, url, params) {
			_title.text(title);
			switch (widthType || Dialog.WidthTypes.DEFAULT) {
			case Dialog.WidthTypes.SMALL:
				_modal.classList().remove("modal-sm", "modal-lg", "modal-xl");
				_modal.classList().add("modal-sm");
				break;
			case Dialog.WidthTypes.LARGE:
				_modal.classList().remove("modal-sm", "modal-lg", "modal-xl");
				_modal.classList().add("modal-lg");
				break;
			case Dialog.WidthTypes.EXTRA_LARGE:
				_modal.classList().remove("modal-sm", "modal-lg", "modal-xl");
				_modal.classList().add("modal-xl");
				break;
			default:
				_modal.classList().remove("modal-sm", "modal-lg", "modal-xl");
			}
			_body.parent().style("height", (height || 480)+"px");

			_close.classList().add("d-none");
			_cancel.classList().add("d-none");
			_save.classList().add("d-none");
			_commit.classList().add("d-none");
			if (buttons instanceof Array) {
				for (var i in buttons) {
					var buttonName = buttons[i];
					if (buttonName === Dialog.Buttons.CLOSE) {
						_close.classList().remove("d-none");
					}
					else if (buttonName === Dialog.Buttons.CANCEL) {
						_cancel.classList().remove("d-none");
					}
					else if (buttonName === Dialog.Buttons.SAVE) {
						_save.classList().remove("d-none");
					}
					else if (buttonName === Dialog.Buttons.COMMIT) {
						_commit.classList().remove("d-none");
					}
				}
			}
			else if (buttons === Dialog.Buttons.CLOSE) {
				_close.classList().remove("d-none");
			}
			else if (buttons === Dialog.Buttons.CANCEL) {
				_cancel.classList().remove("d-none");
			}
			else if (buttons === Dialog.Buttons.SAVE) {
				_save.classList().remove("d-none");
			}
			else if (buttons === Dialog.Buttons.COMMIT) {
				_commit.classList().remove("d-none");
			}

			if (!url) {
				$("#"+_id).modal("show");
			}
			else {
				_body.change(url, params);
			}
		};

		_this.hide = function hide() {
			$("#"+_id).modal("hide");
		};
	});

	ns.Dialog.WidthTypes = {
		DEFAULT: 0,
		SMALL: 1,
		LARGE: 2,
		EXTRA_LARGE: 3,
	}

	ns.Dialog.Buttons = {
		CLOSE: "close",
		CANCEL: "cancel",
		SAVE: "save",
		COMMIT: "commit",
	}
});