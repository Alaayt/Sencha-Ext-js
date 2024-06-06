
Ext.application({
    extend: 'Youtube.Application',

    name: 'Youtube',

    requires: [
        'Youtube.*'
    ],
    launch: function () {
        viewport = Ext.getCmp('viewport');
        target = viewport.down('#viewport-target');
        view = Ext.create('Youtube.view.main.Extra');
        target.add(view);
    },

        mainView: 'Youtube.view.extraApi',
    autoCreateViewport: true
});
