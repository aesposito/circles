function Game (){
	var _self = this;
	var _circle_width = 100;
	var _interval;
	var _count = 1;
	var _count_user = 0;
	var _count_circles = 9;
	var _timer = 150;
	var _timer_animation = 150;
	var _stop = false;
	var _sound;

	this.getNext = function(){
		var circles = new Array();

		$('.circle').each(function(e){
			circles.push($(this));
		});

		circles = _self.shuffle(circles);

		for(var i = 0; i < circles.length; i++)
		{
			var element = circles[i];
			var item = element.attr('data-item');
			var empty = element.attr('data-empty');
			
			if (empty == 'true')
			{
				element.attr('data-empty', 'false');
				return parseInt(item);
			}
		}

		return -1;
		
	}

	this.searchItem = function(item)
	{
		var circle = false;
		$('.circle').each(function(e){
			var circle_item = $(this).attr('data-item');
			if (parseInt(circle_item) == item)
			{
				circle = $(this);
			}

		});

		return circle;
	}

	this.paint = function()
	{
		var nros = new Array();
		for(var i = 0; i < _count_circles; i++)
		{
			nros.push(i);
		}

		nros = _self.shuffle(nros);
		var show_item = 1;
		var timer = 200;
		var color = 0;
		$('.circle').each(function(e){
			setTimeout(function(){
				$('.item_' + show_item).css('background-color', _self.getColor(nros[color]));
				color++;
				show_item++;
			}, timer);
			timer += 100;
		});
	}

	this.start = function(){
		var timer = 100;
		var show_item = 1;
		_sound = new Sound();
		$('.game').html('');
		for(var i = 1; i <= _count_circles; i++)
		{
			$('.game').append('<div class="circle item_' + i + '" data-item="' + i + '" data-empty="true"><span class="nro">&nbsp</span></div>');	

			$('.item_' + i).transition({ 
				scale: 0, 
				duration: 0
			});

			setTimeout(function(){
				$('.item_' + show_item).transition({ 
					scale: 1.0, 
					duration: 200
				});
				show_item++;
			}, timer);
			timer += 100;
		}

		$('.circle').css({'width': _circle_width, 'height': _circle_width});
		_self.paint();
		_self.events();

		$('.play_again').unbind('click');
		$('.play_again').click(function(e){
			$('.game_over').fadeOut(300, function(){
				_self.start();	
				_stop = false;
				_count = 1;
				_count_user = 0;
			});
			
		});

		setTimeout(_self.startInterval, 2000);
	}

	this.shuffle = function(o){
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
	}


	this.startInterval = function()
	{
		if (_stop){ return; }
		var next = _self.getNext();
		if (next == -1)
		{
			_self.gameOver();
			return;
		}

		$('.item_' + next + ' .nro').html(_count);
		_self.animation($('.item_' + next), function(){
			setTimeout(_self.startInterval, _timer);
		});
		_count++;	
	}

	this.gameOver = function()
	{
		_stop = true;
		_sound.playWrong();
		$('.game_over').fadeIn(300);
		$('.final_score').html("YOUR SCORE: " + _count_user);
	}

	this.events = function()
	{
		$('.circle').click(function(){
			if (_stop){ return; }
			var circle = $(this);
			var item = parseInt(circle.children('.nro').html());
			if (item - 1 == _count_user)
			{
				_count_user++
				circle.children('.nro').html("&nbsp");
				_sound.play(1);
				_self.animationReverse(circle, function(){
					circle.attr('data-empty', 'true');
				});

				if (_count_user % 10 == 0)
				{
					_timer -= 50;
				}
			}
			else
			{
				_self.gameOver();	
			}
			
		});	
	}

	this.animation = function(circle, callback)
	{
		circle.transition({ 
			scale: 1.4, 
			duration: _timer_animation,
			complete: function(){
				circle.transition({ 
					scale: 1.0 , 
					duration: _timer_animation, 
					complete: function(){
						callback();
					}
				});
			}
		});
	}

	this.animationReverse = function(circle, callback)
	{
		circle.transition({ 
			scale: 0.6, 
			duration: 150,
			complete: function(){
				circle.transition({ 
					scale: 1.0 , 
					duration: 150, 
					complete: function(){
						callback();
					}
				});
			}
		});
	}

	this.getColor = function(nro)
	{
		var colors = Array();
		colors.push("#00A6FF");
		colors.push("#F6A1C3");
		colors.push("#B0CF00");
		colors.push("#F0305D");
		colors.push("#F0B330");
		colors.push("#30F0D0");
		colors.push("#E08031");
		colors.push("#E340D8");
		colors.push("#65B332");
		
		return (colors.length > nro) ? colors[nro] : colors[0];
		
	}
}