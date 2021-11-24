var tool = tiled.registerTool("PlaceRectangles", {
    name: "Generate cliffs",

    mousePressed: function(button, xClick, yClick, modifiers) {
        const editor = this.getEditor();
        const brush = tiled.mapEditor.currentBrush.layerAt(0);

        if (brush.tileAt(2, 2) == null)
        {
            tiled.error("Please select (in your tileset by dragging) the cliff first. You should select at least 3x3 tiles, up to 3x5 tiles.");
            return;
        }

        for (var x = 0; x < this.map.width; x++)
            for (var y = 0; y < this.map.height; y++)
            {
                // if this tile is empty...
                if (this.map.currentLayer.tileAt(x, y) == null)
                {
                    // if there's a tile up-right of it, place the "bottom-left" tile here.
                    if (this.map.currentLayer.tileAt(x + 1, y - 1) != null) {
                        editor.setTile(x, y, brush.tileAt(0, 2));
                        // if there are tiles below the bottom-left one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(0, 3) != null)
                            editor.setTile(x, y + 1, brush.tileAt(0, 3));
                        if (brush.tileAt(0, 4) != null)
                            editor.setTile(x, y + 2, brush.tileAt(0, 4));
                    }
                    // if there's a tile up-left of it, place the "bottom-right" tile here.
                    if (this.map.currentLayer.tileAt(x - 1, y - 1) != null) {
                        editor.setTile(x, y, brush.tileAt(2, 2));
                        // if there are tiles below the bottom-right one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(2, 3) != null)
                            editor.setTile(x, y + 1, brush.tileAt(2, 3));
                        if (brush.tileAt(2, 4) != null)
                            editor.setTile(x, y + 2, brush.tileAt(2, 4));
                    }
                    // if there's a tile directly above it, place the "bottom middle" tile here.
                    else if (this.map.currentLayer.tileAt(x, y - 1) != null) {
                        editor.setTile(x, y, brush.tileAt(1, 2));
                        // if there are tiles below the bottom-middle one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(1, 3) != null)
                            editor.setTile(x, y + 1, brush.tileAt(1, 3));
                        if (brush.tileAt(1, 4) != null)
                            editor.setTile(x, y + 2, brush.tileAt(1, 4));
                    }
                    // if there's a tile down-left of it, place the "up-right" tile here.
                    if (this.map.currentLayer.tileAt(x - 1, y + 1) != null) {
                        editor.setTile(x, y, brush.tileAt(0, 2));
                    }
                    // if there's a tile down-right of it, place the "up-left" tile here.
                    if (this.map.currentLayer.tileAt(x + 1, y + 1) != null) {
                        editor.setTile(x, y, brush.tileAt(0, 0));
                    }
                    // if there's a tile directly below it, place the "top middle" tile here.
                    else if (this.map.currentLayer.tileAt(x, y + 1) != null)
                        editor.setTile(x, y, brush.tileAt(1, 0));
                    // if there's a tile directly left of it, place the "right middle" tile here.
                    else if (this.map.currentLayer.tileAt(x - 1, y ) != null)
                        editor.setTile(x, y, brush.tileAt(2, 1));
                    // if there's a tile directly right of it, place the "left middle" tile here.
                    else if (this.map.currentLayer.tileAt(x + 1, y ) != null)
                        editor.setTile(x, y, brush.tileAt(0, 1));
                    // if there's a tile directly right of it, place the "left middle" tile here.
                    else if (this.map.currentLayer.tileAt(x + 1, y ) != null)
                        editor.setTile(x, y, brush.tileAt(0, 1));
                }
            }

        editor.apply();
    },

    getEditor: function() {
        var cliffsLayer = this.map.currentLayer; // TODO: get a reference to the "cliffs" layer instead, so that the tiles aren't drawn onto the selected layer.
        return cliffsLayer.edit();
    },
});
