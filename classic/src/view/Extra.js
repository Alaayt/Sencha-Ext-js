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
        { text: 'Phone', dataIndex: 'phone', flex: 1,
        renderer: function(value) {
            return '<span class="custom-phone-column">' + value + '</span>';
        } 
         },
        { text: 'Website', dataIndex: 'website', flex: 1 },
        //{ text: 'operation', flex: 1 },
        {
            xtype: 'actioncolumn',
            width: 100,
            items: [
                {
                    iconCls: 'x-fa fa-eye',
                    tooltip: 'View Details',
                    getClass: function(v, meta, rec) {
                        return 'x-fa fa-eye custom-action-button';
                    },
                    handler: function(grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        console.log(record);
                        var detailsWindow = Ext.create('Youtube.view.ContactDetails');
                        detailsWindow.setData(record);
                        detailsWindow.show();
                    }
                },
                {
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Contact',
                    handler: function(grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        var editWindow = Ext.create('Youtube.view.EditContact');
                        editWindow.setData(record);
                        editWindow.show();
                    }
                }
            ]
        }
        
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
