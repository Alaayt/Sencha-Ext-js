topSuite("Ext.grid.plugin.Clipboard",
    ['Ext.grid.Panel', 'Ext.grid.plugin.CellEditing', 'Ext.grid.plugin.Clipboard',
     'Ext.grid.selection.SpreadsheetModel', 'Ext.form.field.Text'],
function() {
    var store, cellediting, clipboard, grid, view, navModel, record, column, field, selModel, colRef,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore = function() {
            proxyStoreLoad.apply(this, arguments);

            if (synchronousLoad) {
                this.flushLoad.apply(this, arguments);
            }

            return this;
        };

    function makeGrid(editorCfg, clipboardCfg, gridCfg, storeCfg, locked, selModelCfg) {
        store = new Ext.data.Store(Ext.apply({
            fields: ['name', 'email', 'phone'],
            data: [
                { 'name': 'Lisa', 'email': 'lisa@simpsons.com', 'phone': '555-111-1224', 'age': 14, "organisation": 'simpsons', group: 'IT' },
                { 'name': 'Bart', 'email': 'bart@simpsons.com', 'phone': '555-222-1234', 'age': 12, "organisation": 'simpsons', group: 'IT' },
                { 'name': 'Homer', 'email': 'homer@simpsons.com', 'phone': '555-222-1244', 'age': 44, "organisation": 'simpsons', group: 'Finance' },
                { 'name': 'Marge', 'email': 'marge@simpsons.com', 'phone': '555-222-1254', 'age': 41, "organisation": 'simpsons', group: 'IT' }
            ],
            autoDestroy: true
        }, storeCfg));

        selModel = new Ext.grid.selection.SpreadsheetModel(Ext.apply({
            dragSelect: true,
            cellSelect: true,
            columnSelect: true,
            rowSelect: true,
            checkboxSelect: false
        }, selModelCfg));

        cellediting = new Ext.grid.plugin.CellEditing(Ext.merge({}, editorCfg));
        clipboard = new Ext.grid.plugin.Clipboard(Ext.merge({}, clipboardCfg));

        grid = new Ext.grid.Panel(Ext.apply({
            columns: [
                { header: 'Name',  dataIndex: 'name', editor: 'textfield', locked: locked },
                { header: 'Email', dataIndex: 'email', flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                { header: 'Phone', dataIndex: 'phone', editor: 'textfield', readOnly: true },
                { header: 'Age', dataIndex: 'age', editor: 'textfield', readOnly: true,
                renderer: function(val) {
                    return val / 2;
                } },
                { header: 'Organisation', dataIndex: 'organisation', readOnly: false },
                { header: 'Group', dataIndex: 'group' }
            ],
            store: store,
            selModel: 'spreadsheet',
            defaults: {
                flex: 1
            },
            plugins: [cellediting, clipboard],
            width: 600,
            height: 400,
            renderTo: Ext.getBody()
        }, gridCfg));

        view = grid.view;
        navModel = grid.getNavigationModel();
        selModel = grid.getSelectionModel();
        colRef = grid.getColumnManager().getColumns();
    }

    function startEdit(recId, colId) {
        record = store.getAt(recId || 0);
        column = grid.columns[colId || 0];

        // Skip non-editable columns
        while (!column.getEditor()) {
            column = column.nextSibling() || grid.columns[0];
        }

        cellediting.startEdit(record, column);
        field = column.field;
        waitsForFocus(field);
    }

    function clipboardAction(eventName) {
        var key;

        switch (eventName) {
            case "copy" :
                key = 67;
                break;

            case "paste" :
                key = 86;
                break;

            case "cut" :
                key = 88;
                break;
        }

        jasmine.fireKeyEvent(clipboard.getTarget(grid), 'keydown', key, /* shift */ null, /* ctrl */ true);
    }

    beforeEach(function() {
        // Override so that we can control asynchronous loading
        Ext.data.ProxyStore.prototype.load = loadStore;

        MockAjaxManager.addMethods();
    });

    afterEach(function() {
        // Undo the overrides.
        Ext.data.ProxyStore.prototype.load = proxyStoreLoad;

        tearDown();
        MockAjaxManager.removeMethods();
    });

    function tearDown() {
        store = cellediting = clipboard = grid = view = record = column = field = Ext.destroy(grid);

    }

    describe("System clipboard and plugin interaction", function() {
        beforeEach(function() {
            makeGrid({ pluginId: 'test-cell-editing' });
        });

        it("system clipboard should take precedence when actionableMode is true", function() {
            spyOn(clipboard, 'validateAction').andCallThrough();

            startEdit(0, 0);

            runs(function() {
                field.selectText();

                clipboardAction("copy");
                clipboardAction("cut");
                clipboardAction("paste");
                // here we are testing the validateAction method because it is the best
                // way of testing that the clipboard plugin did not disturb the system's
                // clipboard action.
                expect(clipboard.validateAction.callCount).toBe(3);

                for (var i = 0; i < clipboard.validateAction.callCount; i++) {
                    expect(clipboard.validateAction.calls[i].result).toBe(false);
                }
            });
        });
    });

    describe("Prevent pasting if editor is not defined to column", function() {
        var cell01, cell02, cellData, cellData2;

        beforeEach(function() {
            makeGrid({
                plugins: [{
                    ptype: 'cellediting',
                    clicksToEdit: 2
                }, {
                    ptype: 'clipboard'
                }]
            });
        });

        it("should allow to paste when column has editor", function() {
            spyOn(clipboard, 'validateAction').andCallThrough();
            runs(function() {
                cell01 = new Ext.grid.CellContext(grid.view).setPosition(0, 1);

                view.getSelectionModel().selectCells([1, 1], [1, 1]);

                clipboard.pasteClipboardData('text');
                clipboard.getHiddenTextArea().dom.value = cell01.getCell(true).innerText;
            });

            runs(function() {
                cell02 = new Ext.grid.CellContext(grid.view).setPosition(1, 1);

                // Focus cell 1, 1
                cell02.getCell(true).focus();
            });

            waitsFor(function() {
                return cell01.getCell(true).innerText === cell02.getCell(true).innerText;
            }, 'success');

            runs(function() {
                expect(cell01.getCell(true).innerText).toEqual(cell02.getCell(true).innerText);
            });
        });

        it("should allow to paste when column has editor and readOnly is true", function() {
            spyOn(clipboard, 'validateAction').andCallThrough();

            runs(function() {
                cell01 = new Ext.grid.CellContext(grid.view).setPosition(0, 1);

                view.getSelectionModel().selectCells([3, 3], [3, 3]);
                clipboard.pasteClipboardData('text');
                clipboard.getHiddenTextArea().dom.value = cell01.getCell(true).innerText;
            });

            runs(function() {
                cell02 = new Ext.grid.CellContext(grid.view).setPosition(3, 3);

                // Focus cell 4,4
                cell02.getCell(true).focus();
            });

            waitsFor(function() {
                return cell01.getCell(true).innerText === cell02.getCell(true).innerText;
            }, 'success');

            runs(function() {
                expect(cell01.getCell(true).innerText).toEqual(cell02.getCell(true).innerText);
            });

        });

        it("should allow to paste when column readOnly is false", function() {
            spyOn(clipboard, 'validateAction').andCallThrough();

            runs(function() {
                cell01 = new Ext.grid.CellContext(grid.view).setPosition(0, 1);

                view.getSelectionModel().selectCells([5, 5], [5, 5]);
                clipboard.pasteClipboardData('text');
                clipboard.getHiddenTextArea().dom.value = cell01.getCell(true).innerText;
            });

            runs(function() {
                cell02 = new Ext.grid.CellContext(grid.view).setPosition(5, 5);

                // Focus cell 5,5
                cell02.getCell(true).focus();
            });

            waitsFor(function() {
                return cell01.getCell(true).innerText === cell02.getCell(true).innerText;
            }, 'success');

            runs(function() {
                expect(cell01.getCell(true).innerText).toEqual(cell02.getCell(true).innerText);
            });

        });

        it("should prevent paste when column doesn't have editor", function() {
            spyOn(clipboard, 'validateAction').andCallThrough();

            runs(function() {
                cell01 = new Ext.grid.CellContext(grid.view).setPosition(0, 1);
                view.getSelectionModel().selectCells([6, 6], [6, 6]);
                clipboard.pasteClipboardData('text');
                clipboard.getHiddenTextArea().dom.value = cell01.getCell(true).innerText;
            });

            runs(function() {
                cell02 = new Ext.grid.CellContext(grid.view).setPosition(6, 6);

                // Focus cell 6,6
                cell02.getCell(true).focus();
            });

            waitsFor(function() {
                return cell01.getCell(true).innerText !== cell02.getCell(true).innerText;
            }, 'success');

            runs(function() {
                expect(cell01.getCell(true).innerText).not.toEqual(cell02.getCell(true).innerText);
            });

        });

        it("should allow paste when column does have editor and perform renderer operation", function() {
            spyOn(clipboard, 'validateAction').andCallThrough();

            runs(function() {
                cell01 = new Ext.grid.CellContext(grid.view).setPosition(2, 4);

                view.getSelectionModel().selectCells([4, 4], [4, 4]);
                clipboard.pasteClipboardData('text');
                clipboard.getHiddenTextArea().dom.value = cell01.getCell(true).innerText;
            });

            runs(function() {
                cell02 = new Ext.grid.CellContext(grid.view).setPosition(4, 4);

                // Focus cell 4,4
                cell02.getCell(true).focus();
            });

            waitsFor(function() {
                return parseInt(cell01.getCell(true).innerText) === cell02.getCell(true).innerText * 2;
            }, 'success');

            runs(function() {
                expect(parseInt(cell01.getCell(true).innerText)).toEqual(cell02.getCell(true).innerText * 2);
            });

        });
    });
});
