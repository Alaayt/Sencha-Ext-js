/**
 * This base class is used for menu items that are shared across all column menus. These
 * menu items must be added and remove on-the-fly since they appear to be in all column
 * menus but can in fact only be in one at a time.
 */
Ext.define('Ext.grid.menu.Shared', {
    extend: 'Ext.menu.Item',

    config: {
        grid: null
    },

    doDestroy: function() {
        this.setGrid(null);
        this.callParent();
    },

    updateGrid: function(grid, oldGrid) {
        var me = this;

        if (oldGrid) {
            oldGrid.removeSharedMenuItem(me);
        }

        me.grid = grid;

        if (grid) {
            grid.addSharedMenuItem(me);
        }
    },

    onBeforeShowColumnMenu: function(menu /* , column, grid */) {
        var items = menu.items.items,
            len,
            isExist = false,
            i;

        len = items.length;

        // do not add the item if it exists already
        for (i = 0; i < len; i++) {
            if (items[i].id === this.id) {
                isExist = items[i];
                break;
            }
        }

        if (!isExist) {
            menu.add(this);
        }
    },

    onColumnMenuHide: function(menu /* , column, grid */) {
        if (!this.destroyed) {
            menu.remove(this, /* destroy= */false);
        }
    }
});
