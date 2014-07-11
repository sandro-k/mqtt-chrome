/**
 * Created by sandro on 23.05.14.
 */





var inspector = {

    connectionsCount: 4,

    headerIds: {
        header: "#header"
    },

    connectionIds: {
        connectionName: "#connectionName",
        conSubID: "#connectionSubscriptionTemplate",
        connectionMenu: ".connections .nav",
        connectionMain: "section.main"
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
//        prefix: "template/",
//        suffix: ".mustache",
        addSubscription: "template/addSubscriptionTemplate.mustache",
        subscription: "template/subscriptionTemplate.mustache",
        newConnection: "template/newConnectionTemplate.mustache",
        newConnectionSubscription: "template/newConnectionSubscriptionTemplate.mustache",
        newConnectionStyle: "template/connectionStyleTemplate.mustache",
        header: "template/headerTemplate.mustache",
        newNotification: "template/newNotificationTemplate.mustache"
    },

    templateCache: {
        // empty strings just for auto complete
        addSubscription: "",
        subscription: "",
        newConnection: "",
        newConnectionSubscription: "",
        newConnectionStyle: "",
        header: "",
        newNotification: ""
    },

    templateCounter: 0,

    init: function () {
        // pre load all templates

        for (var key in inspector.template) {
            $.get(inspector.template[key] + "?=" + key, function (template) {
                var key = this.url.split("?=")[1];
                // save cached template at same key as before but in extra object
                inspector.templateCache[key] = template;
                console.log(inspector.template.length);
                inspector.templateCounter++;
                if (inspector.templateCounter === Object.keys(inspector.template).length) {
                    $(document).trigger("headerTemplateLoaded");
                }
            });
        }

        inspector.registerEventListener();
    },

    registerEventListener: function () {
        $(document).on('headerTemplateLoaded', inspector.attatchHeader);
    },

    attatchHeader: function () {
        var rendered = Mustache.render(inspector.templateCache.header, {});
        $("#header").append(rendered);
    },

    saveModal: function (elementID, id) {
        switch (elementID) {
            case inspector.connectionActions.addConnection :
//                inspector.addConnection();
                inspector.addConnection();
                break;
            case inspector.connectionActions.addSubscription:
                inspector.addSubscription(id);
                break
        }
    },


    addConnection: function () {
        var value = {
            connectionClass: "connection-" + inspector.connectionsCount,
            name: $(inspector.connectionIds.connectionName).val(),
            connection: "connected",
            target: "#addSubscription" + inspector.connectionsCount
        }

        // reuse preloaded template
        var rendered = Mustache.render(inspector.templateCache.newConnection, value);
        // append to view
        $(inspector.connectionIds.connectionMenu).append(rendered);


        var template = inspector.templateCache.newConnectionSubscription;
        Mustache.parse(template);   // optional, speeds up future uses
        rendered = Mustache.render(template, value);
        $(inspector.connectionIds.connectionMain).append(rendered);

        inspector.addSubscriptionModal({name: value.name, id: inspector.connectionsCount});

        template = inspector.templateCache.newConnectionStyle;
        var color = Color($("#connectionColor").val());
        var value = {id: inspector.connectionsCount,
            color: color.rgbString(),
            color10: color.lighten('0.10').rgbString(),
            color30: color.lighten('0.30').rgbString(),
            color40: color.lighten('0.40').rgbString(),
            color50: color.lighten('0.50').rgbString()};

        console.log(value)
        rendered = Mustache.render(
                template,
                value);

        // todo appand to head if proper computed
//        $("head").append(rendered);

        inspector.connectionsCount += 1;

    },

    updateConnection: function () {
        // todo
    },

    addSubscription: function (id) {
        var value = {name: ""};

        value.name = $(inspector.subscriptionIDs.addSubscription + id).find(inspector.subscriptionIDs.subscribeTopic).val();
        value.qos = 1;
        value.id = id;

        $.get(inspector.template.subscription, function (template) {
            var rendered = Mustache.render(template, value);
//            $('body').append(rendered);
            var wrapper = $(".main div.connection-" + id + "-wrapper");
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
                $(element).removeClass("col-sm-12 col-lg-12 collapsed-extra-padding-left").addClass("col-sm-9 col-lg-10");
                break;
            case 1:
                $(element).removeClass("col-sm-9 col-lg-10").addClass("col-sm-12 col-lg-12");
                if (element.hasClass("collapsed-extra-padding-left")) {
                    $(element).removeClass("collapsed-extra-padding-left");
                } else {
                    $(element).addClass("collapsed-extra-padding-left");
                }

                break;
        }
    },

    addNotification: function (notification) {
        var render = Mustache.render(inspector.templateCache.newNotification, notification)
        $(".notifications-content").append(render);
    }

}


$("#generateRandomId").click(function () {
    $("#clientIdInput").val(token());
});


$("body").on("click", ".save-button", function () {
    var modal = $(this).closest(".modal");
    var id = modal.data('id');
    inspector.saveModal(this.id, id);
    modal.modal('hide')
});


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
            badge.text("Messages: 0/" + badge.text().split("/")[1]);
        } else {
            $that.removeClass($that.data("up")).addClass($that.data("down"));
        }
    });
});


//$("body").on("click", ".save-button", function () {

$('body').on("click", '[data-toggle="message"]', function(){
    var $that = $(this);
    var $target = $that.parent().find("code");

    $that.toggleClass("in");

    $that.parent().removeClass("prettyprinted");
    if ($that.hasClass("in")){
        $target.html(JSON.stringify($(this).data('message'), null, 2));
    } else {
        $target.html($(this).data('message-short'));
    }
    PR.prettyPrint();


});

$('[data-toggle="collapse"]').click(function () {
    var $that = $(this);

    // if target is collapsed
    if ($($(this).data('target')).hasClass("in")) {
        $that.removeClass($that.data("down")).addClass($that.data("up"));
    } else {
        $that.removeClass($that.data("up")).addClass($that.data("down"));
    }
//    $($(this).data('target')).toggle(function () {
//        if ($(this).is(":visible")) {
//            $that.removeClass($that.data("down")).addClass($that.data("up"));
//        } else {
//            $that.removeClass($that.data("up")).addClass($that.data("down"));
//        }
//    });
});

// a helper function to hide/show (toggle) left and right menus
$(".toggle-menu").click(function () {
    var $that = $(this);

//    collapsed
    console.log($($(this).data('target')).width());
    console.log($($(this).data('target')));


    $($(this).data('target')).toggleClass("collapsed-custom").promise().done(function () {
        var element = $(".content-wrapper");
        if (($(this).css("display") === "none") || $(this).hasClass("collapsed-custom")) {
            // increase size

//            $(this).animate({
//                left: ((this.width() * -1) + 39) + "px"
//            }, 500 );

            $(this).css({ left: ((this.width() * -1) + 39) + "px" });
            element.data("size", element.data('size') + 1);
        } else {
            // decrease size
            element.data("size", element.data('size') - 1);
//            $(this).css({ left: "" });
            $(this).removeAttr('style');
            $("#notifications").hide(0, function () {
                $(this).show()
            });

        }
        inspector.adjustsize(element, this);

        var icon = $that.find($that.data("icon-class"));
        if ($(this).hasClass('collapsed-custom')) {

            icon.removeClass($that.data("up")).addClass($that.data("down"));
            icon.attr('data-original-title', icon.data('title-up'));
            console.log(icon.data());
//            $that.find(".glyphicon").removeClass($that.data("up")).addClass($that.data("down"));
//            $that.find(".fa").removeClass($that.data("up")).addClass($that.data("down"));
        } else {
            icon.removeClass($that.data("down")).addClass($that.data("up"));
            icon.attr('data-original-title', icon.data('title-down'));
            console.log(icon.data());
//            $that.find(".glyphicon").removeClass($that.data("down")).addClass($that.data("up"));
//            $that.find(".fa").removeClass($that.data("down")).addClass($that.data("up"));
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

$(function () {
    inspector.init();


});

function loadUser() {
    $.get(inspector.template.addSubscription, function (template) {
        var rendered = Mustache.render(template, {name: "Luke", id: 2});
        $('body').append(rendered);
    });
};

$.fn.redraw = function () {
    $(this).each(function () {
        var redraw = this.offsetHeight;
    });
};

function addFakeNotifications() {
//    var objects = [
//        {succes: "ok",
//            connectionID: "connection-1",
//            connectionURL: "test.mosquitto.org",
//            icon: "glyphicon-ok"},
//        {succes: "fail",
//            connectionID: "connection-2",
//            connectionURL: "dev.rabbitmq.com",
//            icon: "glyphicon-remove"},
//        {succes: "ok",
//            connectionID: "connection-3",
//            connectionURL: "m2m.eclipse.org",
//            icon: "glyphicon-ok"}
//    ];

//    var id = Math.floor((Math.random() * 3));
//    console.log(id);
//    inspector.addNotification(objects[id]);
}


// just debug

var object1 = {
    "id": "387",
    "name": "greenhouse",
    "description": "The sensorbox of the greenhouse on my terrace",
    "datastreams": [
        {
            "id": "9347",
            "name": "temperature",
            "description": "Temperature"
        },
        {
            "id": "9348",
            "name": "Humidity",
            "description": "Humidity"
        }
    ]
}

function testJsonTemplate() {
    console.log((object1));
    console.log(printJson(object1));


}


$(function () {
//    $("#xxxx").append(printJson2(object1));
//    $("#xxxx").append(JSON.stringify(object1));
//    $("#xxxx").append("<span class=\"badge\">more[...]</span>");
//    $("#xxxx").append("<span class=">Collapse <i class="fa fa-2x glyphicon-btn fa-angle-double-down collapsed" data-toggle="collapse" data-target="#connectionNav" data-up="fa-angle-double-down" data-down="fa-angle-double-up"></i> </span>");



    $.get("template/messages/jsonTemplate.hbs", function (source) {

        var template = Handlebars.compile(source);
        var context = {
            id : _.uniqueId(),
            type: "JSON",
            "contentRaw": JSON.stringify(object1),
            content: JSON.stringify(object1, null, 2)
        };

        console.log(context)

        var html = template(context);
        $("#jsonExample").append(html);
    });


//    $("#jsonExample").append("<button type=\"button\" class=\"btn ababab in\" data-toggle=\"collapse\" data-target=\".ababab\">simple collapsible</button>");
//    $("#jsonExample").append("<div id=\"message-xxx\"  class=\"collapse ababab\"><pre class=\"prettyprint\"><div class='code-head'>JSON</div>" + JSON.stringify(object1, null, 2) + "</pre></div>");
});

function printJson2(object) {
    var output = "";
    if (_.isObject(object) && !_.isArray(object)) {

        output += "{";
        _.each(_.pairs(object), function (item, count, items) {
//            console.log(item);
            if (_.isArray(item[1])) {
                output += '<span class="badge">';
                output += item[0];
                output += '</span>';

                output += ": [";

                _.each(item[1], function (element, id, values) {

                    output += printJson2(element);

                    if (id !== values.length - 1) {
                        output += ",";

                    } else {
//                        output += '</br>';
                    }
                });

                output += "]";

            } else if (_.isObject(item[1])) {

            } else {
                output += '<span class="badge">';
                output += item[0] + ": " + item[1];
                output += '</span>';
                if (count !== items.length - 1) {
                    output += ", ";
                }
            }
        });
        output += "}";
//        console.log("}");
    }
    return output;
}

function printJson(object) {
    if (_.isObject(object) && !_.isArray(object)) {
        _.each(_.pairs(object), printJson);
//        _.each(_.pairs(object), test);
    } else if (_.isArray(object)) {
        if (_.isObject(object[1]) && !_.isArray(object[1])) {
            console.log("isObject: " + object[1]);
            console.log(object[0] + ": " + printJson(object[1]));
        } else if (_.isArray(object[1])) {
            console.log("isArray:" + (_.pairs(object[1])));
            //(_.each((object[1]), _.pairs))

            //console.log(object[0] +": "+ printJson(object[1]));
        } else {
            console.log(object[0] + ": " + object[1]);
        }

    }


//    if (_.isObject(object) && !_.isArray(object)){
//        console.log("is object:"+ object)
//        var pairs = _.pairs(object);
//        _.each(pairs, printJson);
//    } else if (_.isArray(object)){
//        if (_.isObject(object[1])){
//            console.log(object[0]+": "+ printJson(object[1]));
//        } else {
//            console.log(object[0]+": "+object[1]);
//        }
//    } else {
//        console.log("XX:"+ object)
//    }
}

function test(tt) {
    console.log(tt);
}

function test2() {
    $.get("template/test.handelbars", function (source) {
        console.log(source);
        var template = Handlebars.compile(source);
        var context = {title: "My New Post", body: "This is my first post!"}
        var html = template(context);
        $("#target").append(html);
        console.log(html);

    });
}


String.prototype.trunc =
        function (n, useWordBoundary) {
            var toLong = this.length > n,
                    s_ = toLong ? this.substr(0, n - 1) : this;
            s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
//            return  toLong ? s_ + '&hellip;' : s_;
            return  s_;
        };


Handlebars.registerHelper('abr', function (text, length, useWordBoundary) {
    if (text !== undefined){
        console.log(text);
        return text.trunc(length, useWordBoundary);
    } else {
        return "";
    }
});






