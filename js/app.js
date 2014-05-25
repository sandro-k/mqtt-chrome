/**
 * Created by sandro on 23.05.14.
 */



$( ".toggle" ).click(function() {
    $($(this).data('target')).toggle();
});