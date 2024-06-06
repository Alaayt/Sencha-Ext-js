Ext.define('Youtube.store.ExtraApi',{
    extend: 'Ext.data.Store',
    alias:'store.extraApi',
    pageSize:2,
        proxy: {
            type: 'ajax',
            url: 'https://jsonplaceholder.typicode.com/users'
            },
        autoLoad:true
    
})