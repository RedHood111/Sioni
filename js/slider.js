var Slider = (function() {
	
	var $container = $( '#ps-container' ),
		$contentwrapper = $container.children( 'div.ps-contentwrapper' ),

		$items = $contentwrapper.children( 'div.ps-content' ),
		itemsCount = $items.length,
		$slidewrapper = $container.children( 'div.ps-slidewrapper' ),

		$slidescontainer = $slidewrapper.find( 'div.ps-slides' ),
		$slides = $slidescontainer.children( 'div' ),
		// стрелки навигации
		$navprev = $slidewrapper.find( 'nav > a.ps-prev' ),
		$navnext = $slidewrapper.find( 'nav > a.ps-next' ),
		// текущий индекс для элементов и слайдов
		current = 0,
		// проверяет выполняется ли сейчас переход
		isAnimating = false,
		// поддержка CSS переходов
		support = Modernizr.csstransitions,

		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},

		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],

		init = function() {

			// первый элемент
			var $currentItem = $items.eq( current ),
				$currentSlide = $slides.eq( current ),
				initCSS = {
					top : 0,
					zIndex : 999
				};

			$currentItem.css( initCSS );
			$currentSlide.css( initCSS );
			
			// обновляем изображения на фоне навигации
			updateNavImages();

			initEvents();

		},
		updateNavImages = function() {

			// обновляем изображения на фоне навигации
			var configPrev = ( current > 0 ) ? $slides.eq( current - 1 ).css( 'background-image' ) : $slides.eq( itemsCount - 1 ).css( 'background-image' ),
				configNext = ( current < itemsCount - 1 ) ? $slides.eq( current + 1 ).css( 'background-image' ) : $slides.eq( 0 ).css( 'background-image' );

			$navprev.css( 'background-image', configPrev );
			$navnext.css( 'background-image', configNext );

		},
		initEvents = function() {

			$navprev.on( 'click', function( event ) {

				if( !isAnimating ) {
					
					slide( 'prev' );
				
				}
				return false;

			} );

			$navnext.on( 'click', function( event ) {

				if( !isAnimating ) {
					
					slide( 'next' );
				
				}
				return false;

			} );

			$items.on( transEndEventName, removeTransition );
			$slides.on( transEndEventName, removeTransition );
			
		},
		removeTransition = function() {

			isAnimating = false;
			$(this).removeClass('ps-move');

		},
		slide = function( dir ) {

			isAnimating = true;

			var $currentItem = $items.eq( current ),
				$currentSlide = $slides.eq( current );

			if( dir === 'next' ) {

				( current < itemsCount - 1 ) ? ++current : current = 0;

			}
			else if( dir === 'prev' ) {

				( current > 0 ) ? --current : current = itemsCount - 1;

			}
			var $newItem = $items.eq( current ),
				$newSlide = $slides.eq( current );

			$newItem.css( {
				top : ( dir === 'next' ) ? '-100%' : '100%',
				zIndex : 999
			} );
			
			$newSlide.css( {
				top : ( dir === 'next' ) ? '100%' : '-100%',
				zIndex : 999
			} );

			setTimeout( function() {

				$currentItem.addClass( 'ps-move' ).css( {
					top : ( dir === 'next' ) ? '100%' : '-100%',
					zIndex : 1
				} );

				$currentSlide.addClass( 'ps-move' ).css( {
					top : ( dir === 'next' ) ? '-100%' : '100%',
					zIndex : 1
				} );

				$newItem.addClass( 'ps-move' ).css( 'top', 0 );
				$newSlide.addClass( 'ps-move' ).css( 'top', 0 );

				// если CSS переходы не поддерживаются, тогда флаг изменяем на false
				if( !support ) {

					isAnimating = false;

				}

			}, 0 );

			// еще раз обновляем изображения на фоне навигации
			updateNavImages();

		};

	return { init : init };

})();