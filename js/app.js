/**
 * Created by sandro on 23.05.14.
 */


var inspector = {

    connectionsCount: 4,

    connectionIds: {
        connectionName: "#connectionName",
        conSubID: "#connectionSubscriptionTemplate"
    },

    subscriptionIDs: {
        subscribeTopic: "#subscribeTopic",
        addSubscription: "#addSubscription"

    },

    connectionActions: {
        addConnection: "addConnection",
        addSubscription: "addSubscription"
    },
    template: {
        prefix: "template/",
        suffix: ".mustache",
        addSubscription: "template/addSubscriptionTemplate.mustache",
        subscription: "template/subscriptionTemplate.mustache"
    },

    saveModal: function (elementID, id) {
        switch (elementID) {
            case inspector.connectionActions.addConnection :
                inspector.addConnection();
                break;
            case inspector.connectionActions.addSubscription:
                inspector.addSubscription(id);
                break
        }
    },

    addConnection: function () {
        console.log($(inspector.connectionIds.connectionName).val())

        // load template
        var template = $('#connectionTemplate').html();
        // parse template
        // todo save this in inspector object for reuse
        Mustache.parse(template);   // optional, speeds up future uses

        // load values
        var value = {
            connectionClass: "connection-" + inspector.connectionsCount,
            name: $(inspector.connectionIds.connectionName).val(),
            connection: "connected",
            target: "#addSubscription" + inspector.connectionsCount
        };


        // render template
        var rendered = Mustache.render(template, value);
        // append to view
        $(".connections .nav").append(rendered);

        template = $(inspector.connectionIds.conSubID).html();
        Mustache.parse(template);   // optional, speeds up future uses
        rendered = Mustache.render(template, value);
        $("section.main").append(rendered);

        inspector.addSubscriptionModal({name: value.name, id: inspector.connectionsCount});

        inspector.connectionsCount += 1;
    },

    addSubscription: function (id) {
        var value = {name: ""};

        value.name = $(inspector.subscriptionIDs.addSubscription+id).find(inspector.subscriptionIDs.subscribeTopic).val();
        value.qos = 1;
        value.id = id;

        $.get(inspector.template.subscription, function (template) {
            var rendered = Mustache.render(template, value);
//            $('body').append(rendered);
            var wrapper = $(".main div.connection-"+id+"-wrapper");
            wrapper.find(".last").removeClass("last");
            wrapper.append(rendered);
        });



    },

    addSubscriptionModal: function (value) {
        $.get(inspector.template.addSubscription, function (template) {
            var rendered = Mustache.render(template, value);
            $('body').append(rendered);
        });
    },

    adjustsize: function (element, source) {
        switch ($(element).data("size")) {
            case 0:
                $(element).removeClass("col-sm-9 col-lg-9 collapsed-extra-padding-left collapsed-extra-padding-right").addClass("col-sm-6 col-lg-8");

                break;
            case 1:
                $(element).removeClass("col-sm-6 col-lg-8").addClass("col-sm-9 col-lg-10");
                if (source.data("position") === "left") {
                    if (element.hasClass("collapsed-extra-padding-left")) {
                        $(element).removeClass("collapsed-extra-padding-left");
                    } else {
                        $(element).addClass("collapsed-extra-padding-left");
                    }
                } else {
                    if (element.hasClass("collapsed-extra-padding-right")) {
                        $(element).removeClass("collapsed-extra-padding-right");
                    } else {
                        $(element).addClass("collapsed-extra-padding-right");
                    }
                }
                break;
            case 2:
                $(element).removeClass("col-sm-9 col-lg-10").addClass("col-sm-12 col-lg-12");

                if (source.data("position") === "left") {
                    if (element.hasClass("collapsed-extra-padding-left")) {
                        $(element).removeClass("collapsed-extra-padding-left");
                    } else {
                        $(element).addClass("collapsed-extra-padding-left");
                    }
                } else {
                    if (element.hasClass("collapsed-extra-padding-right")) {
                        $(element).removeClass("collapsed-extra-padding-right");
                    } else {
                        $(element).addClass("collapsed-extra-padding-right");
                    }
                }

                break;
        }
    }

}


$("#generateRandomId").click(function () {
    $("#clientIdInput").val(token());
});




$( "body" ).on( "click", ".save-button", function( ) {
    var modal = $(this).closest(".modal");
    var id = modal.data('id');
    inspector.saveModal(this.id, id);
    modal.modal('hide')
});

//$(".save-button").click(function () {
////    console.log("clicked: " + this.id);
//    inspector.saveModal(this.id);
//    $(this).closest(".modal").modal('hide')
//});

$(".toggle").click(function () {
    $($(this).data('target')).toggle();

});

$(".toggle-message").click(function () {
    var $that = $(this);
    $($(this).data('target')).toggle(function () {
        if ($(this).is(":visible")) {
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
$(".toggle-menu").click(function () {
    var $that = $(this);

//    collapsed

    $($(this).data('target')).toggleClass("collapsed-custom").promise().done(function () {
        var element = $(".content-wrapper");
        if (($(this).css("display") === "none") || $(this).hasClass("collapsed-custom")) {
            // increase size
            element.data("size", element.data('size') + 1);
        } else {
            // decrease size
            element.data("size", element.data('size') - 1);
        }
        inspector.adjustsize(element, this);

        if ($(this).hasClass('collapsed-custom')) {
            $that.find(".glyphicon").removeClass($that.data("up")).addClass($that.data("down"));
        } else {
            $that.find(".glyphicon").removeClass($that.data("down")).addClass($that.data("up"));
        }
    });

});


$(".btn-group > .btn").click(function () {
    $(".btn-group > .btn").removeClass("active");
    $(this).addClass("active");
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

$(function () {
    $('#connectionColor').minicolors({theme: 'bootstrap'});
})


var rand = function () {
    return Math.random().toString(36).substr(2);
};

var token = function () {
    return rand() + rand(); // to make it longer
};

function loadUser() {
    $.get(inspector.template.addSubscription, function (template) {
        var rendered = Mustache.render(template, {name: "Luke", id: 2});
        $('body').append(rendered);
    });
};






