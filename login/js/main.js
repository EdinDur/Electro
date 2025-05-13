(function($) {
    "use strict";

    // Mobile Nav toggle
    $('.menu-toggle > a').on('click', function(e) {
        e.preventDefault();
        $('#responsive-nav').toggleClass('active');
    });

    // Fix cart dropdown from closing
    $('.cart-dropdown').on('click', function(e) {
        e.stopPropagation();
    });

    /////////////////////////////////////////

    // Products Slick
    $('.products-slick').each(function() {
        var $this = $(this),
            $nav = $this.attr('data-nav');

        $this.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            infinite: true,
            speed: 300,
            dots: false,
            arrows: true,
            appendArrows: $nav ? $nav : false,
            responsive: [{
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
            ]
        });
    });

    // Products Widget Slick
    $('.products-widget-slick').each(function() {
        var $this = $(this),
            $nav = $this.attr('data-nav');

        $this.slick({
            infinite: true,
            autoplay: true,
            speed: 300,
            dots: false,
            arrows: true,
            appendArrows: $nav ? $nav : false,
        });
    });

    /////////////////////////////////////////

    // Product Main img Slick
    $('#product-main-img').slick({
        infinite: true,
        speed: 300,
        dots: false,
        arrows: true,
        fade: true,
        asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: 0,
        vertical: true,
        asNavFor: '#product-main-img',
        responsive: [{
            breakpoint: 991,
            settings: {
                vertical: false,
                arrows: false,
                dots: true,
            }
        }]
    });

    // Product img zoom
    $(document).ready(function(){
        var zoomMainProduct = document.getElementById('product-main-img');
        if (zoomMainProduct) {
            console.log("Ucitano");
            $('#product-main-img .product-preview').zoom();
        }
    });
    

    /////////////////////////////////////////

    // Function to update price slider and input fields
    function updatePriceSliderAndInput(value, isMin) {
        var sliderValues = priceSlider.noUiSlider.get();
        var min = parseInt(sliderValues[0]);
        var max = parseInt(sliderValues[1]);

        if (isMin) {
            min = value;
        } else {
            max = value;
        }

        priceSlider.noUiSlider.set([min, max]);
        $('#price-min').val(min);
        $('#price-max').val(max);
    }

    // Input number event listeners
    $('.input-number input[type="number"]').on('input', function() {
        var value = parseInt($(this).val()) || 0;
        var isMin = $(this).closest('.input-number').hasClass('price-min');
        updatePriceSliderAndInput(value, isMin);
    });

    // Price input change event listeners
    var priceInputMax = document.getElementById('price-max'),
        priceInputMin = document.getElementById('price-min');

		document.addEventListener('DOMContentLoaded', function() {
			var priceInputMax = document.getElementById('price-max');
			if (priceInputMax) {
				priceInputMax.addEventListener('change', function() {
					updatePriceSlider($(this).parent(), this.value);
				});
			}
		
			
		});
		document.addEventListener('DOMContentLoaded', function() {		
			var priceInputMin = document.getElementById('price-min');
			if (priceInputMin) {
				priceInputMin.addEventListener('change', function() {
					updatePriceSlider($(this).parent(), this.value);
				});
			}
		
			
		});
				
    // Function to update price slider
    function updatePriceSlider(elem, value) {
        if (elem.hasClass('price-min')) {
            console.log('min');
            priceSlider.noUiSlider.set([value, null]);
        } else if (elem.hasClass('price-max')) {
            console.log('max');
            priceSlider.noUiSlider.set([null, value]);
        }
    }

    // Price Slider
    var priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        noUiSlider.create(priceSlider, {
            start: [1, 999],
            connect: true,
            step: 1,
            range: {
                'min': 1,
                'max': 5000
            }
        });

        priceSlider.noUiSlider.on('update', function(values, handle) {
            var value = parseInt(values[handle]);
            handle ? $('#price-max').val(value) : $('#price-min').val(value);
        });
    }

})(jQuery);
