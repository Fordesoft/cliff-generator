var tool = tiled.registerTool("GenerateCliffs", {
    name: "Generate cliffs",

    mousePressed: function(button, xClick, yClick, modifiers) {
        const editor = this.getEditor();
        const brush = tiled.mapEditor.currentBrush.layerAt(0);

        if (brush.tileAt(2, 2) == null)
        {
            tiled.alert("Please select (in your tileset by dragging) the cliff first. You should select at least 3x3 tiles, up to 3x5 tiles.");
            return;
        }

        this.initializeBuffer();

        for (var x = 0; x < this.map.width; x++)
            for (var y = 0; y < this.map.height; y++)
            {
                // if this is a ground tile and is an edge tile...
                if (this.map.currentLayer.tileAt(x, y) != null && this.isEdge(x, y)) {

                    if (this.isBottomLeftCorner(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(0, 2));
                        // if there are tiles below the bottom-left one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(0, 3) != null)
                            this.writeTileToBuffer(x, y + 1, brush.tileAt(0, 3));
                        if (brush.tileAt(0, 4) != null)
                            this.writeTileToBuffer(x, y + 2, brush.tileAt(0, 4));
                    }

                    else if (this.isBottomRightCorner(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(2, 2));
                        // if there are tiles below the bottom-right one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(2, 3) != null)
                            this.writeTileToBuffer(x, y + 1, brush.tileAt(2, 3));
                        if (brush.tileAt(2, 4) != null)
                            this.writeTileToBuffer(x, y + 2, brush.tileAt(2, 4));
                    }

                    else if (this.isBottomMiddle(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(1, 2));
                        // if there are tiles below the bottom-middle one in the tileset, put them below the tile we just placed (for up to 2 tiles atm-maybe expand this infinitely later via a loop, if there's demand)
                        if (brush.tileAt(1, 3) != null)
                            this.writeTileToBuffer(x, y + 1, brush.tileAt(1, 3));
                        if (brush.tileAt(1, 4) != null)
                            this.writeTileToBuffer(x, y + 2, brush.tileAt(1, 4));
                    }

                    else if (this.isTopLeftCorner(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(0, 0));
                    }

                    else if (this.isTopRightCorner(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(2, 0));
                    }

                    else if (this.isTopMiddle(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(1, 0));
                    }

                    else if (this.isLeftEdge(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(0, 1));
                    }

                    else if (this.isRightEdge(x, y)) {
                        this.writeTileToBuffer(x, y, brush.tileAt(2, 1));
                    }
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

    tileBufferAt: function(x, y) {
        if (x < 0 || y < 0 || x >= this.tileBuffer.length || y >= this.tileBuffer[x].length)
            return null;

        return this.tileBuffer[x][y];
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
    },

    isEdge: function(x, y) {
        if (this.map.currentLayer.tileAt(x - 1, y - 1) == null)
            return true;
        if (this.map.currentLayer.tileAt(x + 1, y - 1) == null)
            return true;
        if (this.map.currentLayer.tileAt(x - 1, y) == null)
            return true;
        if (this.map.currentLayer.tileAt(x + 1, y) == null)
            return true;
        if (this.map.currentLayer.tileAt(x, y + 1) == null)
            return true;
        if (this.map.currentLayer.tileAt(x, y - 1) == null)
            return true;
        if (this.map.currentLayer.tileAt(x - 1, y + 1) == null)
            return true;
        if (this.map.currentLayer.tileAt(x + 1, y + 1) == null)
            return true;
        return false;
    },

    isBottomLeftCorner: function(x, y) {
        if (this.map.currentLayer.tileAt(x - 1, y) != null) // if a tile is to the left
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) != null) // if a tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) == null) // if no tile is above
            return false;
        return true;
    },

    isBottomRightCorner: function(x, y) {
        if (this.map.currentLayer.tileAt(x + 1, y) != null) // if a tile is to the right
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) != null) // if a tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) == null) // if no tile is above
            return false;
        return true;
    },

    isBottomMiddle: function(x, y) {
        if (this.map.currentLayer.tileAt(x + 1, y) == null) // if no tile is to the right
            return false;
        if (this.map.currentLayer.tileAt(x - 1, y) == null) // if no tile is to the left
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) != null) // if a tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) == null) // if no tile is above
            return false;
        return true;
    },

    isLeftEdge: function(x, y) {
        if (this.map.currentLayer.tileAt(x - 1, y) != null) // if a tile is to the left
            return false;
        if (this.map.currentLayer.tileAt(x + 1, y) == null) // if no tile is to the right
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) == null) // if no tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) == null) // if no tile is above
            return false;
        return true;
    },

    isRightEdge: function(x, y) {
        if (this.map.currentLayer.tileAt(x + 1, y) != null) // if a tile is to the right
            return false;
        if (this.map.currentLayer.tileAt(x - 1, y) == null) // if no tile is to the left
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) == null) // if no tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) == null) // if no tile is above
            return false;
        return true;
    },

    isTopLeftCorner: function(x, y) {
        if (this.map.currentLayer.tileAt(x - 1, y) != null) // if a tile is to the left
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) == null) // if no tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) != null) // if a tile is above
            return false;
        return true;
    },

    isTopRightCorner: function(x, y) {
        if (this.map.currentLayer.tileAt(x + 1, y) != null) // if a tile is to the right
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) == null) // if no tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) != null) // if a tile is above
            return false;
        return true;
    },

    isTopMiddle: function(x, y) {
        if (this.map.currentLayer.tileAt(x + 1, y) == null) // if no tile is to the right
            return false;
        if (this.map.currentLayer.tileAt(x - 1, y) == null) // if no tile is to the left
            return false;
        if (this.map.currentLayer.tileAt(x, y + 1) == null) // if no tile is below
            return false;
        if (this.map.currentLayer.tileAt(x, y - 1) != null) // if a tile is above
            return false;
        return true;
    },
});
