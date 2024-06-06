Ext.define('Youtube.view.PopUp', {
    extend:'Ext.window.Window',
    height:200, width:400, 
    layout:'fit',
    items:{
        xtype:'grid',
        broder:false,
        columns:[{header:'Name',},{header:'Email',}],
        store:[]

    }

})