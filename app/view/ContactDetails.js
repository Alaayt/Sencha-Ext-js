// app/view/ContactDetails.js
Ext.define("Youtube.view.ContactDetails", {
    extend: "Ext.window.Window",
    xtype: "contactdetails",
    title: "Contact Details",
    width: 400,
    modal: true,
    layout: "fit",
    items: [
        {
            xtype: "form",
            bodyPadding: 10,
            defaults: {
                xtype: "displayfield",
                anchor: "100%",
            },
            items: [
                { name: "name", fieldLabel: "Name" },
                {
                    name: "company",
                    fieldLabel: "Company",
                    renderer: function (value) {
                        //return "<b style='color:red'>"+ value["name"] + "</b>";
                        return `${value.name} - ${value.bs}`;
                    },
                },
                { name: "phone", fieldLabel: "Phone" },
                { name: "email", fieldLabel: "Email" },
                { name: "username", fieldLabel: "Username" },
            ],
        },
    ],
    buttons: [
        {
            text: "Close",
            handler: function (btn) {
                btn.up("window").close();
            },
        },
    ],
    setData: function (record) {
        this.down("form").getForm().loadRecord(record);
    },
});
