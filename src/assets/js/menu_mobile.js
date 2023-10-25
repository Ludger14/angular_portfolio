
$(function(){
		var open = true;
		var windowSize = $(window)[0].innerWidth;
		var targetSizeMenu = (windowSize <= 400) ? 200 : 300;
		
		$('nav.mobile i').click(function(){			
			var el = $(this).parent().find('ul');
			if (el.is(':visible') == false) {
				//$('.conteudo-header').css('display','none');
				el.fadeIn();								
				$('nav.mobile .btn').click(function(){
					$('.conteudo-header .mobile').css('display','none');
					$('.login-form').fadeIn();
					el.fadeOut();					
				})	
				$('.login-form').fadeOut();	
				$('.conteudo-header').css('display','block');		
			}else{
				el.fadeOut();								
				$('.login-form').fadeOut();					
		}
	});
});
