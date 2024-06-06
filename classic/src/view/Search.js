Ext.define('Youtube.view.Search', {
    extend: 'Ext.form.Panel',
    title: 'Form Tutorial',
    defaultType: 'textfield',
    items: [
        {
            fieldLabel: 'First Name',
            name: 'firstName',

        },
        {
            fieldLabel: 'First Name',
            name: 'lastName',

        },
        {
            fieldLabel: 'Email',
            name: 'email',

        },
        {
            fieldLabel: 'DOB',
            name: 'dob',
            xtype: 'datefield',
        },
    ],
    buttons: [
        {
            text: 'Submit me',
            handler: function (btn) 
            {
                var form = this.up('form').getForm();
                var data = form.getValues();
                console.warn("print the form data:", data);
            }
        }
    ]
        });