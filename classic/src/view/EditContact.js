// app/view/EditContact.js
Ext.define('Youtube.view.EditContact', {
    extend: 'Ext.window.Window',
    xtype: 'editcontact',
    title: 'Edit Contact',
    width: 400,
    modal: true,
    layout: 'fit',
    items: [
        {
            xtype: 'form',
            bodyPadding: 10,
            defaults: {
                xtype: 'textfield',
                anchor: '100%'
            },
            items: [
                { name: 'name', fieldLabel: 'Name', allowBlank: false },
                { name: 'email', fieldLabel: 'Email', allowBlank: false },
                { name: 'phone', fieldLabel: 'Phone', allowBlank: false },
                { 
                    xtype: 'fieldset',
                    //xtype: 'fieldcontainer',
                    //fieldLabel: 'Company',
                    layout: 'anchor',
                    title: 'Company',
                    defaults: {
                        xtype: 'textfield',
                        flex: 1,
                        margin: '0 5 0 0'
                    },
                    items: [
                        { name: 'companyName', fieldLabel: 'Name', allowBlank: false },
                        { name: 'companyBs', fieldLabel: 'BS', allowBlank: false }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save',
            formBind: true,
            disabled: true,
            handler: function(btn) {
                var win = btn.up('window'),
                    form = win.down('form').getForm(),
                    record = form.getRecord();
                
                if (form.isValid()) {
                    var companyName = form.findField('companyName').getValue();
                    var companyBs = form.findField('companyBs').getValue();
                    record.set('company', { name: companyName, bs: companyBs });
                    form.updateRecord(record);
                    win.close();
                }
            }
        },
/*
        {
            text: 'Save',
            formBind: true,
            disabled: true,
            handler: function(btn) {
                var win = btn.up('window'),
                    form = win.down('form').getForm(),
                    record = form.getRecord();

                if (form.isValid()) {
                    var emailName = form.findField('emailName').getValue();
                    var emailHost = form.findField('emailHost').getValue();
                    var contactData = {
                        name: form.findField('name').getValue(),
                        phone: form.findField('phone').getValue(),
                        email: {
                            name: emailName,
                            host: emailHost
                        }
                    };

                    // Send the data to the server
                    Ext.Ajax.request({
                        url: '/api/contacts',
                        method: 'POST',
                        jsonData: contactData,
                        success: function(response) {
                            var resp = Ext.decode(response.responseText);
                            Ext.Msg.alert('Success', 'Contact saved successfully.');
                            win.close();
                        },
                        failure: function(response) {
                            var resp = Ext.decode(response.responseText);
                            Ext.Msg.alert('Failure', 'Failed to save contact.');
                        }
                    });
                }
            }
        },

        */
        {
            text: 'Cancel',
            handler: function(btn) {
                btn.up('window').close();
            }
        },
    ],
    setData: function(record) {
        this.down('form').getForm().loadRecord(record);

        var company = record.get('company');
        this.down('form').getForm().setValues({
            companyName: company.name,
            companyBs: company.bs
        });

    }
});