(function () {
	"use strict";
	var $body = $("body");
	$('#btn-config').on('click', function () {
		$body.toggleClass('open');
		$(this).toggleClass('active');
		if (!$body.is('.open')) {
			$body.removeClass('advanced');
		}
	});
	$("#btn-advanced").on('click', function (ev) { 
		ev.preventDefault();
		$body.toggleClass("advanced").removeClass('help');
	});
	$('.hero-btn').on('click', function () {
		$body.addClass('open');
	});
	$('.help-btn').on('click', function (ev) {
		ev.preventDefault();
		$body.toggleClass('help').removeClass('advanced');
	});
	$('.test-btn').on('click', function (ev) {
		var values = {
			'endpoint': 'https://secure.foliotek.com/blti',
			'secret': 'secret',
			'oauth_consumer_key': 'Foliotek',
			'roles': 'Learner'
		};
		app.form.fillValues(values);
		$body.addClass('open');
	});

	$("[title]").tooltipster({
    	theme: 'tooltipster-shadow',
    	position: 'right'
	});

	app.form.init();
	app.debug.init($("#form"));
})();