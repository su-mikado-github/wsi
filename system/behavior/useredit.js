/**
 *
 */
WSI.screendef(function Useredit() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	function parent_save(params) {
		_this.message("saved");
	}

	_this.initialize = function initialize() {
		_base.initialize();
		//
		_this.on("message.save", parent_save);

		_this.message("ready");
	};
});
