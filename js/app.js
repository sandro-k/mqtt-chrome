/**
 * Created by sandro on 23.05.14.
 */


var inspector = {

    adjustsize: function(element){
        switch ($(element).data("size")) {
            // todo we should consider media-queries
            case 0:
                $(element).removeClass("col-sm-9 col-lg-9").addClass("col-sm-6 col-lg-8");
                break;
            case 1:
                $(element).removeClass("col-sm-6 col-lg-8").addClass("col-sm-9 col-lg-10");
                break;
            case 2:
                $(element).removeClass("col-sm-9 col-lg-10").addClass("col-sm-12 col-lg-12");
                break;
        }
    }

}


$( ".toggle" ).click(function() {
    $($(this).data('target')).toggle();

});

$( ".toggle-message" ).click(function() {
    var $that = $(this);
    $($(this).data('target')).toggle( function() {
        if ($(this).is(":visible")){
            $that.removeClass($that.data("down")).addClass($that.data("up"));
            var badge = $that.parent().find(".badge");
            // update text
            badge.text("0/" + badge.text().split("/")[1]);
        } else {
            $that.removeClass($that.data("up")).addClass($that.data("down"));
        }
    });
});

// a helper function to hide/show (toggle) left and right menus
$( ".toggle-menu" ).click(function() {
    var $that = $(this);

    $($(this).data('target')).toggle(0, function (){
        var element = $(".content-wrapper");
        if ($(this).css("display") === "none") {
            // increase size
            element.data ("size", element.data('size') + 1);
        } else {
            // decrease size
            element.data ("size", element.data('size') - 1);
        }
        inspector.adjustsize(element);

        if ($(this).is(":visible")){
            $that.find(".glyphicon").removeClass($that.data("down")).addClass($that.data("up"));
        } else {
            $that.find(".glyphicon").removeClass($that.data("up")).addClass($that.data("down"));
        }

    });
});



