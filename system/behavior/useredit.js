/**
 *
 */
WSI.screendef(function Useredit() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	function message_save(params) {
		_this.message("saved");
	}

	_this.initialize = function initialize() {
		_base.initialize();
		//
		$('[data-toggle="tooltip"]').tooltip({
			template:'<div class="tooltip custom" role="tooltip"><div class="arrow"></div><div class="tooltip-inner custom"></div></div>',
			trigger: 'hover focus',
		});

		_this.on("message.save", message_save);



		_this.message("ready");
	};
});
