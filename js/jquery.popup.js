(function($){
  jQuery.fn.PopupPL = function(options){
  	options = jQuery.extend(true, {
		debug: false,
		idWND: "WND_default",
		reload: true,
		location: { 
			position: "default", // "centerscreen"
			parentDependence: undefined, // $("div.mainfield")
			proportions: { width: undefined, height: undefined },
			offset: { top: 0, right: 0, bottom: 0, left: 0 }
		},
		create: {
		    fn_getContent: function() { return '<div class="content"><span>Произошла ошибка.<br/> Приносим наши извенения.<br/> Повторите действие позже.</span></div>'; },
		    fn_getBtnOk: function() { return '<a><div id="ok" class="toAdd"><span>Ок</span></div></a>'; }
		},
		events: {fn_ok: undefined, fn_cancle: undefined},
		handler: {aftershow: undefined, afterclose:undefined}
  	}, options);

  	if (typeof options.location.quarters == 'undefined') { options.location.quarters = [4, 3, 2, 1] };

	var Popup = {
		defaultoption: {},	
		_loadCSS: function() {
			var callbackFunc = function() { };
			var head = document.getElementsByTagName("head")[0];
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", "http://localhost/test/css/jquery.popup.css");
			fileref.onload = callbackFunc();
			head.insertBefore(fileref, head.firstChild);
		},
		preparePopupHTML: function(option){
			var prepareHTML = "", ins = "", btn = undefined;		
			prepareHTML += '<div id="popupContent" class="listcontReq">';
			prepareHTML += option.create.fn_getContent(option.create.data);
					
			if(!(typeof option.create.fn_getBtnOk  === 'undefined') && !(typeof option.create.fn_getBtnCancle  === 'undefined')) btn = 1;
			else if(!(typeof option.create.fn_getBtnOk  === 'undefined')) btn = 2;
			else if(!(typeof option.create.fn_getBtnCancle  === 'undefined')) btn = 3;
		    if(!(typeof btn === 'undefined')) {
				prepareHTML += '<div id="manageReq" class="manageReq">';
	            switch(btn) {
	                case 3: prepareHTML += option.create.fn_getBtnCancle(); break;
	                case 2: prepareHTML += option.create.fn_getBtnOk(); break;
	                case 1: prepareHTML += option.create.fn_getBtnCancle(); prepareHTML += option.create.fn_getBtnOk(); break;
				}
				prepareHTML += '</div>';
	        }
	        prepareHTML += '</div>';
			return prepareHTML;
		},
		
		_construct: function(option){
			this._loadCSS();
			var wnd = $("div[id=" + option.idWND + "]").eq(0);
			if(wnd.length && option.reload) { wnd.remove(); }
			if(!(wnd.length && !option.reload))
			{
				// 1. Сформировать HTML окна
				var prepareHTML = this.preparePopupHTML(option);
				var wnd = $('<div id="' + option.idWND + '" class="popup" style="display:none;"/>').html(prepareHTML);
			}
			return wnd;
		},
		
		showCreate: function(p_el, option){
			// Construct WND
			wnd = this._construct(option);
			// Include in DOM structure
			$("body").prepend(wnd);
			
			// Init action in events DOM
			this.initAction(wnd, p_el, option);
			// Open WND by rules from option
			wnd = this.showWND(wnd, p_el, option);
		},
		showWND: function(wnd, p_el, option){
			
			var params = "",
				documentHeight = $(document).height(),
				documentWidth = $(document).width(),
				pD = { 
					width : undefined, height : undefined, 
					infelicityOffset : { x : 0, y : 0 },
					padding : { left: 0, bottom: 0, right: 0, top: 0 },
					border : { left: 0, bottom: 0, right: 0, top: 0 },
					margin : { left: 0, bottom: 0, right: 0, top: 0 },
					A : { x : undefined, y : undefined }, 
					B : { x : undefined, y : undefined }, 
					D: { x : undefined, y : undefined }
				};
			if(!(typeof option.location.proportions === 'undefined'))
			{
				// Вычисление погрешности из-за padding, border, margin
				pD.padding.left = parseFloat(wnd.css('padding-left'));
				pD.padding.bottom = parseFloat(wnd.css('padding-bottom'));
				pD.padding.right = parseFloat(wnd.css('padding-right'));
				pD.padding.top = parseFloat(wnd.css('padding-top'));
				
				pD.border.left = parseFloat(wnd.css('border-left'));
				pD.border.bottom = parseFloat(wnd.css('border-bottom'));
				pD.border.right = parseFloat(wnd.css('border-right'));
				pD.border.top = parseFloat(wnd.css('border-top'));

				pD.margin.left = parseFloat(wnd.css('margin-left'));
				pD.margin.bottom = parseFloat(wnd.css('margin-bottom'));
				pD.margin.right = parseFloat(wnd.css('margin-right'));
				pD.margin.top = parseFloat(wnd.css('margin-top'));

				pD.padding.left = isNaN(pD.padding.left) ? 0 : Math.ceil(pD.padding.left);
				pD.padding.bottom = isNaN(pD.padding.bottom) ? 0 : Math.ceil(pD.padding.bottom);
				pD.padding.right = isNaN(pD.padding.right) ? 0 : Math.ceil(pD.padding.right);
				pD.padding.top = isNaN(pD.padding.top) ? 0 : Math.ceil(pD.padding.top);
				
				pD.border.left = isNaN(pD.border.left) ? 0 : Math.ceil(pD.border.left);
				pD.border.bottom = isNaN(pD.border.bottom) ? 0 : Math.ceil(pD.border.bottom);
				pD.border.right = isNaN(pD.border.right) ? 0 : Math.ceil(pD.border.right);
				pD.border.top = isNaN(pD.border.top) ? 0 : Math.ceil(pD.border.top);

				pD.margin.left = isNaN(pD.margin.left) ? 0 : Math.ceil(pD.margin.left);
				pD.margin.bottom = isNaN(pD.margin.bottom) ? 0 : Math.ceil(pD.margin.bottom);
				pD.margin.right = isNaN(pD.margin.right) ? 0 : Math.ceil(pD.margin.right);
				pD.margin.top = isNaN(pD.margin.top) ? 0 : Math.ceil(pD.margin.top);


				var WNDinfelicityOffset = {
						x : pD.padding.left + pD.padding.right + pD.border.left + pD.border.right + pD.margin.left + pD.margin.right,
						y : pD.padding.top + pD.padding.bottom + pD.border.top + pD.border.bottom + pD.margin.top + pD.margin.bottom
					};
				if(!(typeof option.location.proportions.width === 'undefined')){
					wnd.width(option.location.proportions.width - WNDinfelicityOffset.x);
				}
				if(!(typeof option.location.proportions.height === 'undefined')) {
					wnd.height(option.location.proportions.height - WNDinfelicityOffset.y);
					wnd.find('div#popupContent div').eq(0).height(option.location.proportions.height - wnd.find('div#manageReq').outerHeight() - WNDinfelicityOffset.y);
				}
			}

			var pD_infelicityOffset_x, pD_infelicityOffset_y;
			if(typeof option.location.parentDependence === 'undefined')
			{
				pD.width = documentWidth;
				pD.height = documentHeight;
				pD.A.x = 0;
				pD.A.y = 0;
			}
			else
			{
				var count_pD = p_el.closest(option.location.parentDependence).length;
				if ( count_pD != 1) {
					if(option.debug) { console.log( (count_pD > 1) ? "elements 'parentDependence' more one" : "Not found element 'parentDependence'"); }
					return;
				}
				option.location.parentDependence = $(option.location.parentDependence);

				cur_pD = option.location.parentDependence;

				cur_pD_padding_left = parseFloat(cur_pD.css('padding-left'));
				cur_pD_padding_top = parseFloat(cur_pD.css('padding-top'));
				cur_pD_border_left = parseFloat(cur_pD.css('border-left'));
				cur_pD_border_top = parseFloat(cur_pD.css('border-top'));
				cur_pD_padding_left = isNaN(cur_pD_padding_left) ? 0 : Math.ceil(cur_pD_padding_left);
				cur_pD_padding_top = isNaN(cur_pD_padding_top) ? 0 : Math.ceil(cur_pD_padding_top);
				cur_pD_border_left = isNaN(cur_pD_border_left) ? 0 : Math.ceil(cur_pD_border_left);
				cur_pD_border_top = isNaN(cur_pD_border_top) ? 0 : Math.ceil(cur_pD_border_top);

				pD_infelicityOffset_x = cur_pD_padding_left + cur_pD_border_left;
				pD_infelicityOffset_y = cur_pD_padding_top + cur_pD_border_top;
				// pD.width = cur_pD.outerWidth(true);
				// pD.height = cur_pD.outerHeight(true);
				pD.width = cur_pD.width();
				pD.height = cur_pD.height();
				pD.A.x = cur_pD.offset().left + pD.infelicityOffset.x;
				pD.A.y = cur_pD.offset().top + pD.infelicityOffset.y;
			}
			pD.infelicityOffset.x = pD_infelicityOffset_x;
			pD.infelicityOffset.y = pD_infelicityOffset_y;
			pD.B.x = pD.A.x;
			pD.B.y = pD.A.y + pD.height;
			pD.D.x = pD.A.x + pD.width;
			pD.D.y = pD.A.y;

			

			var scrollPosTop = $('html').scrollTop(),
				scrollPosLeft = $('html').scrollLeft(),
				
				windowHeight = $(window).height(),
				windowWidth = $(window).width(),
				
				wndHeight = wnd.outerHeight(),
				wndWidth = wnd.outerWidth(),
				
				wnd_coordinate = { x: undefined, y: undefined };

			var pDA = { width: undefined, height: undefined, A: {}, B: {}, D: {} },

				inscribed = { top: undefined, left: undefined, bottom: undefined, right: undefined };
				A1 = {
					x : ( (scrollPosLeft) > pD.A.x) ? scrollPosLeft : pD.A.x,
					y : ( (scrollPosTop) > pD.A.y ) ? scrollPosTop : pD.A.y
				},
				B1 = { 
					x : A1.x,
					y : ((scrollPosTop + windowHeight) > pD.B.y) ? pD.B.y : (scrollPosTop + windowHeight)
				},
				D2 = { 
					x : ((scrollPosLeft + windowWidth) > pD.D.x) ? pD.D.x : (scrollPosLeft + windowWidth),
					y : A1.y
				},

			pDA.A.x = A1.x;
			pDA.A.y = A1.y;
			pDA.B.x = B1.x;
			pDA.B.y = B1.y;
			pDA.D.x = D2.x;
			pDA.D.y = D2.y;

			pDA.height = pDA.B.y - pDA.A.y;
			pDA.width = pDA.D.x - pDA.A.x;

			switch(option.location.position)
			{
				default : 
				case "default": 
					var p_el_position = p_el.offset(),
						p_elHeight = p_el.outerHeight(),
						p_elWidth = p_el.outerWidth(),
						accessArea = { };



					// var parentDependenceWidthBottom = documentHeight - pD.A.y - pD.height;
					// var realTop =  0, realBootom = 0;
					// var accessArea = { width: pD.width };
					
					// if( realTop >= 0){
					// 	if( realBootom <= parentDependenceWidthBottom )
					// 		{ accessArea.height = windowHeight - realTop - realBootom; }
					// 	else  { accessArea.height = windowHeight - realTop; }
					// }
					// else {
					// 	if( realBootom <= parentDependenceWidthBottom )
					// 		{ accessArea.height = windowHeight - parentDependenceWidthBottom + realBootom; }
					// 	else  { accessArea.height = windowHeight; }
					// }






					var left = p_el_position.left - pDA.A.x;
					var right = pDA.D.x - (p_el_position.left + p_elWidth);
					var top = p_el_position.top - pDA.A.y;
					var bottom = pDA.B.y - (p_el_position.top + p_elHeight);

					var access = new Array();
					access[1] = ( right>=wndWidth && top>=wndHeight ) ? true : false;
					access[2] = ( left>=wndWidth && top>=wndHeight ) ? true : false;
					access[3] = ( left>=wndWidth && bottom>=wndHeight ) ? true : false;
					access[4] = ( right>=wndWidth && bottom>=wndHeight ) ? true : false;

					// 2 | 1
					// -----
					// 3 | 4
					var needQuaterQueue = $.isArray(option.location.quarters) ? option.location.quarters : [option.location.quarters];
					for (var i = 0; i < needQuaterQueue.length; i++) {
						// console.log(needQuaterQueue[i] + " " + access[needQuaterQueue[i]]);
						if(access[needQuaterQueue[i]]) {
							// Координаты вершины окна вокруг кнопки
							switch(needQuaterQueue[i]){
								default:
								case 4:
									wnd_coordinate.y = p_el_position.top + p_elHeight;
									wnd_coordinate.x = p_el_position.left + p_elWidth;
									break;
								case 1: 
									wnd_coordinate.y = p_el_position.top - wndHeight;
									wnd_coordinate.x = p_el_position.left + p_elWidth;
									break;
								case 2: 
									wnd_coordinate.y = p_el_position.top - wndHeight;
									wnd_coordinate.x = p_el_position.left - wndWidth;
									break;
								case 3: 
									wnd_coordinate.y = (p_el_position.top) + p_elHeight; 
									wnd_coordinate.x = p_el_position.left - wndWidth;
									break;
							}
							break;						
						}
					};
					break;
				case "centerscreen":

					// Координаты вершины окна по средине
					wnd_coordinate.x = pDA.A.x + (pDA.width * 0.5) - (wndWidth * 0.5);
					wnd_coordinate.y =  pDA.A.y + (pDA.height * 0.5) - (wndHeight * 0.5);
					break;
			}

			if(option.debug){
				switch(option.location.position) {
					case "centerscreen" :
						var body = $("body");
						// углы pD
						body.prepend($("<div class='debug pD top'>A</div>").offset({top: pD.A.y , left: pD.A.x }));
						body.prepend($("<div class='debug pD bottom'>B</div>").offset({top: pD.B.y-60 , left: pD.B.x }));
						body.prepend($("<div class='debug pD top'>D</div>").offset({top: pD.D.y , left: pD.D.x - 60 }));
						
						// // углы A1 A2 B1 D2
						body.prepend($("<div class='debug ABD top'>D2</div>").offset({top: D2.y, left: D2.x-40 }));
						body.prepend($("<div class='debug ABD bottom'>B1</div>").offset({top: B1.y-40, left: B1.x }));
						// body.prepend($("<div class='ABD'>A2</div>").offset({top: A2.y, left: A2.x }));
						body.prepend($("<div class='debug ABD top'>A1</div>").offset({top: A1.y, left: A1.x }));

						// // 	// углы pDA
						body.prepend($("<div class='debug pDA top' style='background:red;' >A</div>").offset({top: pDA.A.y , left: pDA.A.x }));
						body.prepend($("<div class='debug pDA bottom' style='background:blue;' >B</div>").offset({top: pDA.B.y-20 , left: pDA.B.x }));
						body.prepend($("<div class='debug pDA top' style='background:yellow;' >D</div>").offset({top: pDA.D.y , left: pDA.D.x - 20 }));
						break;
					case 'default' :
						var body = $("body");
						// углы pD
						body.prepend($("<div class='debug pD top'>A</div>").offset({top: pD.A.y , left: pD.A.x }));
						body.prepend($("<div class='debug pD bottom'>B</div>").offset({top: pD.B.y-60 , left: pD.B.x }));
						body.prepend($("<div class='debug pD top'>D</div>").offset({top: pD.D.y , left: pD.D.x - 60 }));
						
						// // углы A1 A2 B1 D2
						body.prepend($("<div class='debug ABD top'>D2</div>").offset({top: D2.y, left: D2.x-40 }));
						body.prepend($("<div class='debug ABD bottom'>B1</div>").offset({top: B1.y-40, left: B1.x }));
						// body.prepend($("<div class='ABD'>A2</div>").offset({top: A2.y, left: A2.x }));
						body.prepend($("<div class='debug ABD top'>A1</div>").offset({top: A1.y, left: A1.x }));

						// // 	// углы pDA
						body.prepend($("<div class='debug pDA top' style='background:red;' >A</div>").offset({top: pDA.A.y , left: pDA.A.x }));
						body.prepend($("<div class='debug pDA bottom' style='background:blue;' >B</div>").offset({top: pDA.B.y-20 , left: pDA.B.x }));
						body.prepend($("<div class='debug pDA top' style='background:yellow;' >D</div>").offset({top: pDA.D.y , left: pDA.D.x - 20 }));
						break;
				}
			}

			if(!(typeof wnd_coordinate.x === 'undefined') && !(typeof wnd_coordinate.y === 'undefined')) {
				wnd.offset({ 
					top: wnd_coordinate.y, 
					left: wnd_coordinate.x
				}).show();
				// after show
				$(wnd[0]).trigger(jQuery.Event('afterShowWND'));			
			}
			else {
				if(option.debug) { console.log("Error: Calculate coordinates of position display. Will not be displayed anywhere."); }
				wnd.trigger(jQuery.Event("closeWND")); 
			}		
			return wnd;
		},
		initAction: function(wnd, p_el, option){
			/* press OK/CANCLE */
			var action = !(typeof option.events === 'undefined');
			if(typeof option.create.default === 'undefined' && action)
			{
				wnd.find('div[id=ok]').click(function(){ 
					if(!(typeof option.events.fn_ok === 'undefined')) option.events.fn_ok();
					wnd.trigger(jQuery.Event("closeWND"));
				});
				wnd.find('div[id=cancle]').click(function(){ 
					if(!(typeof option.events.fn_cancle === 'undefined')) option.events.fn_cancle();
					wnd.trigger(jQuery.Event("closeWND"));
				});
			}
			
			/* Close out of WND / Keypress ESC */
			var firstClick = true;
			$(document).on('click.outWND' + wnd.id, { WND: wnd[0] }, function(e) {
				if (!firstClick && $(e.target).closest("#" + e.data.WND.id).length == 0) { $(wnd).trigger(jQuery.Event('closeWND')); }
				firstClick = false;
			}).on('keydown', { WND: wnd[0] }, function(e) { if (e.keyCode == 27) { $(wnd).trigger(jQuery.Event('closeWND')); }  });
			
			// handler cleseWND
			wnd.bind('closeWND', { WND: wnd[0] }, function(e) { 
				wnd.hide();
				if(option.debug) { $('div.pD').remove(); $('div.ABD').remove(); $('div.pDA').remove(); }
				$(document).off('click.outWND' + e.data.WND.id);
				$(wnd).trigger(jQuery.Event('afterCloseWND'));
				if(option.reload) wnd.remove();
			});

			// handler afterShowWND
			$(wnd).on('afterShowWND', { WND: wnd[0] }, function(e) {
				if(!(typeof option.handler === 'undefined') && 
					!(typeof option.handler.aftershow === 'undefined')) 
					{ option.handler.aftershow(e.data.WND); }
			});

			// handler afterCloseWND
			$(wnd).on('afterCloseWND', { WND: wnd[0] }, function(e) {
				if(!(typeof option.handler === 'undefined') && 
					!(typeof option.handler.afterclose === 'undefined')) 
					{ option.handler.afterclose(e.data.WND); }
			});

			// return wnd;
		}
	};



  	return this.each(function(){
	  		$(this).click( function() {
	  			Popup.showCreate($(this), options);
	  		});
	  	});
  };
})(jQuery);
