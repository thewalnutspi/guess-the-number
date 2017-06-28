jQuery(document).ready(function($) {
	$.guessthenumber = {};
	$.guessthenumber.start_template = $("#guess-the-number-start-template");
	$.guessthenumber.enter_template = $("#guess-the-number-enter-template");
	$.guessthenumber.correct_ft_template = $("#guess-the-number-correct-ft-template");
	$.guessthenumber.correct_template = $("#guess-the-number-correct-template");
	
	$.guessthenumber.setup = function($this) {
		$this = $($this);
		
		$this.html("<button class=\"btn btn-default guess-the-number-restart pull-right\" style=\"display: none;\">Restart</button><h3>Guess the Number</h3><div class=\"guess-the-number-messages\"></div><div class=\"guess-the-number-container\"><p class=\"alert alert-info\">Loading...</p></div>");
		
		// Generate a number
		$this.data("guess-the-number-number", $.n = $.guessthenumber.generateNumber(0, 20));
		$this.data("guess-the-number-counter", 0);
		
		$.guessthenumber.renderStartTemplate($this);
		
		// Setup restart button
		$this.find(".guess-the-number-restart").on("click", function() {
			$.guessthenumber.setup($this);
		});
	};
	
	$.guessthenumber.generateNumber = function(min, max) {
		return Math.floor((Math.random() * max - min) + 1) + min;
	};
	$.guessthenumber.getAnswer = function($this) {
		return $this.data("guess-the-number-number");
	};
	
	$.guessthenumber.getCounter = function($this) {
		return $this.data("guess-the-number-counter");
	}
	$.guessthenumber.incrementCounter = function($this) {
		$this.data("guess-the-number-counter", $this.data("guess-the-number-counter") + 1);
	};
	$.guessthenumber.clearCounter = function($this) {
		$this.data("guess-the-number-counter", 0);
	};
	
	$.guessthenumber.message = function($this, type, message) {
		var $scrollparent = $this.find(".guess-the-number-container").scrollParent(),
			scrolltop = $scrollparent.scrollTop(),
			messagesheight = $this.find(".guess-the-number-messages").outerHeight(true),
			$message = $("<p class=\"alert alert-" + type + " fade in\"><button class=\"close\" type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>" + message + "</p>");
		window.setTimeout(function() {
			$message.alert("close");
		}, 5000);
		$this.find(".guess-the-number-messages").append($message);
		$scrollparent.scrollTop(scrolltop + ($this.find(".guess-the-number-messages").outerHeight(true) - messagesheight));
	};
	$.guessthenumber.clearMessages = function($this) {
		$this.find(".guess-the-number-messages").html("");
	};
	
	$.guessthenumber.renderStartTemplate = function($this) {
		$this.find(".guess-the-number-restart").hide();
		$this.find(".guess-the-number-container").html($.guessthenumber.start_template.html());
		$this.find(".btn").on("click", function() {
			$.guessthenumber.askForInput($this);
		});
	};
	
	$.guessthenumber.askForInput = function($this) {
		$.guessthenumber.renderInputTemplate($this);
	};
	$.guessthenumber.renderInputTemplate = function($this) {
		$this.find(".guess-the-number-restart").show();
		$this.find(".guess-the-number-container").html($.guessthenumber.enter_template.html());
		$this.find("form").on("submit", function(event) {
			event.preventDefault();
			var $input = $this.find(".form-control");
			if($input.is(":valid"))
				$.guessthenumber.entered($this, parseInt($input.val()));
			else $.guessthenumber.message($this, "warning", "Invalid");
			$input.val("").focus();
			return false;
		});
	};
	
	$.guessthenumber.entered = function($this, input) {
		if(!input instanceof Number)
			throw new Exception("input is not a number.");
		
		var number = $.guessthenumber.getAnswer($this);
		if((input < 1) || (input > 20)) {
			$.guessthenumber.message($this, "danger", "You must enter a number between 1 and 20.");
		} else if(input < number) {
			// Less
			$.guessthenumber.message($this, "warning", "You've guessed too low!");
			$.guessthenumber.incrementCounter($this);
		} else if(input == number) {
			// Correct
			$.guessthenumber.correct($this);
		} else if(input > number) {
			// More
			$.guessthenumber.message($this, "warning", "You've guessed too high!");
			$.guessthenumber.incrementCounter($this);
		} else {
			$.guessthenumber.message($this, "info", "Please enter a number.");
		}
	};
	
	$.guessthenumber.correct = function($this) {
		if($.guessthenumber.getCounter($this) == 0)
			$.guessthenumber.renderCorrectFTTemplate($this);
		else $.guessthenumber.renderCorrectTemplate($this, $.guessthenumber.getCounter($this) + 1);
	};
	$.guessthenumber.renderCorrectFTTemplate = function($this) {
		$this.find(".guess-the-number-restart").show();
		$this.find(".guess-the-number-container").html($.guessthenumber.correct_ft_template.html());
	};
	$.guessthenumber.renderCorrectTemplate = function($this, attempts) {
		$this.find(".guess-the-number-restart").show();
		$this.find(".guess-the-number-container").html($.guessthenumber.correct_template.html());
		$this.find(".guess-the-number-attempts").text(attempts);
	};
	
	$.g = $(".guess-the-number").each(function() {
		$.guessthenumber.setup($(this));
	});
});
