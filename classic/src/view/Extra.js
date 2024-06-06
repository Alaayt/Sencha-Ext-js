Ext.define("Youtube.view.main.Extra", {
    extend: "Ext.grid.Panel",
    xtype: "extra",
    title: 'Grid Testing',
    store: { type: 'extraApi' },
    controller: 'extra',
    bbar:{
        xtype: 'pagingtoolbar',
        displayInfo: true,
        store: { type: 'extraApi' }
    },
    columns: [
        { text: 'Name', dataIndex: 'name', flex: 1,
            filter:{
                type:'string',
                //options: ['Leanne Graham',"John","bruce"]
            }
        },
        { text: 'Email', dataIndex: 'email', flex: 1 },
        { text: 'Phone', dataIndex: 'phone', flex: 1 },
        { text: 'Website', dataIndex: 'website', flex: 1 },
        
    ],
    plugins:'gridfilters',
    id:'testGrid',
    selModel: {
        injectCheckbox: 'first',
        checkOnly:true,
        model: 'SIMPLE',
        type:'checkboxmodel',
        },
        buttons: [
            
                
                {
                    text:"Show Popup",
                    handler: function()
                    {
                        pop= Ext.create('Youtube.view.PopUp');
                        pop.show();
                        //console.warn('abc')
                    }
                }
            
            
        ],
    
});
