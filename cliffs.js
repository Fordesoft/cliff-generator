var tool = tiled.registerTool("GenerateCliffs", {
    name: "Generate cliffs",

    mousePressed: function(button, xClick, yClick, modifiers) {
        const editor = this.getEditor();
        const brush = tiled.mapEditor.currentBrush.layerAt(0);

        if (brush.tileAt(2, 2) == null)
        {
            tiled.error("Please select (in your tileset by dragging) the cliff first. You should select at least 3x3 tiles, up to 3x5 tiles.");
            return;
        }

        this.initializeBuffer();

        for (var x = 0; x < this.map.width; x++)
            for (var y = 0; y < this.map.height; y++)
            {
                // if this tile is empty...
                if (this.map.currentLayer.tileAt(x, y) == null)
                {
                    // if there's a tile up-right of it, place the "bottom-left" tile here.
                    if (this.map.currentLayer.tileAt(x + 1, y - 1) != null) {
                        this.writeTileToBuffer(x, y, brush.tileAt(0, 2));
                        // if there are tiles below the bottom-left one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(0, 3) != null)
                            this.writeTileToBuffer(x, y + 1, brush.tileAt(0, 3));
                        if (brush.tileAt(0, 4) != null)
                            this.writeTileToBuffer(x, y + 2, brush.tileAt(0, 4));
                    }
                    // if there's a tile up-left of it
                    if (this.map.currentLayer.tileAt(x - 1, y - 1) != null) {
                        this.writeTileToBuffer(x, y, brush.tileAt(2, 2));
                        // if there are tiles below the bottom-right one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(2, 3) != null)
                            this.writeTileToBuffer(x, y + 1, brush.tileAt(2, 3));
                        if (brush.tileAt(2, 4) != null)
                            this.writeTileToBuffer(x, y + 2, brush.tileAt(2, 4));
                    }
                    // if there's a tile directly above it, place the "bottom middle" tile here.
                    else if (this.map.currentLayer.tileAt(x, y - 1) != null) {
                        this.writeTileToBuffer(x, y, brush.tileAt(1, 2));
                        // if there are tiles below the bottom-middle one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(1, 3) != null)
                            this.writeTileToBuffer(x, y + 1, brush.tileAt(1, 3));
                        if (brush.tileAt(1, 4) != null)
                            this.writeTileToBuffer(x, y + 2, brush.tileAt(1, 4));
                    }
                    // if there's a tile down-left of it, place the "top-right" tile here.
                    if (this.map.currentLayer.tileAt(x - 1, y + 1) != null) {
                        this.writeTileToBuffer(x, y, brush.tileAt(2, 0));
                    }
                    // if there's a tile down-right of it, place the "top-left" tile here.
                    if (this.map.currentLayer.tileAt(x + 1, y + 1) != null) {
                        this.writeTileToBuffer(x, y, brush.tileAt(0, 0));
                    }
                    // if there's a tile directly below it, place the "top middle" tile here.
                    else if (this.map.currentLayer.tileAt(x, y + 1) != null)
                        this.writeTileToBuffer(x, y, brush.tileAt(1, 0));
                    // if there's a tile directly left of it, place the "right middle" tile here.
                    else if (this.map.currentLayer.tileAt(x - 1, y ) != null)
                        this.writeTileToBuffer(x, y, brush.tileAt(2, 1));
                    // if there's a tile directly right of it, place the "left middle" tile here.
                    else if (this.map.currentLayer.tileAt(x + 1, y ) != null)
                        this.writeTileToBuffer(x, y, brush.tileAt(0, 1));
                    // if there's a tile directly right of it, place the "left middle" tile here.
                    else if (this.map.currentLayer.tileAt(x + 1, y ) != null)
                        this.writeTileToBuffer(x, y, brush.tileAt(0, 1));
                }
            }

        this.applyBuffer(editor);
    },

    getEditor: function() {
        var cliffsLayer = this.map.currentLayer; // TODO: get a reference to the "cliffs" layer instead, so that the tiles aren't drawn onto the selected layer.
        return cliffsLayer.edit();
    },

    // makes a record of a tile we want to place.  we do this, instead of writing directly to editor.setTile(), simply because we don't want our changes to mess up the algorithm as it's in progress (we'dbe placing tiles while it's still detecting edges).
    writeTileToBuffer: function(x, y, tile) {
        this.tileBuffer[x][y] = tile;
    },

    initializeBuffer() {
        // initialize the 2D array
        this.tileBuffer = [];
        for (var x = 0; x < this.map.width; x++)
            this.tileBuffer[x] = [];

        // copy existing tile values from the map into the buffer
        for (var x = 0; x < this.map.width; x++)
            for (var y = 0; y < this.map.height; y++)
                this.tileBuffer[x][y] = this.map.currentLayer.tileAt(x, y);
    },

    applyBuffer: function(editor) {
        for (var x = 0; x < this.map.width; x++)
            for (var y = 0; y < this.map.height; y++)
                editor.setTile(x, y, this.tileBuffer[x][y]);
        editor.apply();
    }
});
