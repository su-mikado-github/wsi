/**
 *
 */
WSI.screendef(function Login() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	_this.mapping();

	_this.controls.goLogin.click(function(e) {
		var params = {
			loginId: _this.controls.loginId.value(),
			loginPw: _this.controls.loginPw.value(),
		};
		WSI.method("<?=url('/common/login.json') ?>", "gologin", params, function(result) {
			console.log(JSON.stringify(result));
			_this.forward(result.url, result.params);
		});
	});
});
