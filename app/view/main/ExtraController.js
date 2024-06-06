Ext.define("Youtube.view.main.ExtraController", {
    extend: "Ext.app.ViewController",
    alias: "controller.extra",
    init: function () {
        this.control({
            "#another": {
                click: "callOnClick",
            },
        });
    },
    callOnClick: function () {
        alert("hello from Controller")
    },
});
