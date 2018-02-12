// ==UserScript==
// @name Y.M song finder
// @description On page song finder for Yandex.Music (https://github.com/Mansiper/YM_SongFinder)
// @author Mansiper
// @license MIT
// @version 1.0
// @match https://music.yandex.ru/*
// ==/UserScript==
(function (window, undefined) {
	var w;
	if (typeof unsafeWindow != undefined)
		w = unsafeWindow
	else w = window;

	if (w.self != w.top) return;

	function main() {
		$('.head__wrap').css('height', '106px')
		var mss_wrapper = $('<div/>', { id: 'mss_wrapper' })[0];
		$(mss_wrapper).css({ position: 'relative', top: '-54px', left: '174px' });
		var mss_form = $('<form/>', { id: 'mss_form' })[0];
		$(mss_form).css({ position: 'inherit', width: '402px', display: 'inline-flex' });
		var mss_input = $('<input/>', { id: 'mss_input', type: 'text', placeholder: 'Поиск по песням на странице', class: 'nb-input _nb-simple-input _init head__suggest-input ui-autocomplete-input' })[0];
		$(mss_input).css({ 'border-width': '1px' });
		var mss_submit = $('<button/>', { id: 'mss_submit', type: 'submit', class: 'icon icon_loop icon_size_L head__suggest-button' })[0];
		$(mss_submit).css({ top: '2px' });
		mss_wrapper.appendChild(mss_form);
		mss_form.appendChild(mss_input);
		mss_form.appendChild(mss_submit);
		$('div.head')[0].appendChild(mss_wrapper);

		var mssLastSelected;

		function mssSearch() {
			var page = 1;
			var height = $(window).height() - 200;
			var scroll = 0;

			var findElement = function() {
				var tracks = $('a.d-track__title')
				for (let i = 0; i < tracks.length - 1; i++)
					if (tracks[i].text.toLowerCase().indexOf($('#mss_input').val().toLowerCase()) !== -1) {
						var elem = tracks[i].parentElement.parentElement.parentElement;
						$('html').scrollTop($(elem).offset().top);
						if (mssLastSelected)
							$(mssLastSelected).removeClass("d-track_selected");
						$(elem).removeClass("d-track_selected").addClass("d-track_selected");
						mssLastSelected = elem;
						return;
					}
				scroll = height * page;
				$(document).scrollTop(scroll);
				if ($(document).scrollTop() < scroll) {
					$(document).scrollTop(0);
					return;
				}
				page++;
				setTimeout(function() { findElement() }, 50);
			}

			$(document).scrollTop(0);
			setTimeout(function() { findElement() }, 50);
		}

		/* function mssSearchOld() {
			for (let i = 0; i < Mu.pages.current.data.tracks.length - 1; i++) {
				var item = Mu.pages.current.data.tracks[i];
				var title = item.title.toLowerCase();
				var search = $('#mss_input').val().toLowerCase();

				if (title.indexOf(search) !== -1) {
					var scroll = 0;
					var elem = `button[data-idx=${item.id}]`;
					var found = false;

					var findElement = function() {
						found = $(elem).length === 1;
						if (found) {
							var b = $(elem).data('b') - 1;
							$('html').scrollTop($(`div[data-b=${b}]`).offset().top);
							return;
						}
						$(document).scrollTop(scroll);
						if ($(document).scrollTop() < scroll) {
							$(document).scrollTop(0);
							return;
						}
						scroll += 300;
						setTimeout(function() { findElement() }, 50);
					}

					$(document).scrollTop(0);
					setTimeout(function() { findElement() }, 50);
					break;
				}
			}
		} */

		function mssSearchHotKey(e) {
			e = e || window.event;
			var code = e.keyCode || e.which;
			if (e.ctrlKey && e.shiftKey && code == 70/*f*/) {
				$('#mss_input').focus();
				return false;
			}
			return true;
		}

		function mssInputVisibility() {
			if (location.href.match(/https:\/\/music\.yandex\.ru\/artist\/\d+\/tracks/)) {
				$('#mss_wrapper').show();
				$('.head__wrap').css('height', '106px');
			} else {
				$('#mss_wrapper').hide();
				$('.head__wrap').css('height', '71px');
			}
			setTimeout(function() { mssInputVisibility() }, 100);
		}

		$('#mss_form').submit(function(e) {
			e.preventDefault();
			if (location.href.match(/https:\/\/music\.yandex\.ru\/artist\/\d+\/tracks/))
				mssSearch();
			return false;
		});
		
		$(document).on('keydown', function (e) {
			return mssSearchHotKey(e);
		});

		mssInputVisibility();
		//setTimeout(function() { mssInputVisibility() }, 100);
	}

	function addJQuery(callback) {
		var script = document.createElement("script");
		script.setAttribute("src", "//yastatic.net/jquery/1.10.1/jquery.min.js");
		script.addEventListener('load', function() {
			var script = document.createElement("script");
			script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
			document.body.appendChild(script);
		}, false);
		document.body.appendChild(script);
	}
	addJQuery(main);
})(window);