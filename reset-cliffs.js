var tool = tiled.registerTool("Reset cliffs", {
    name: "Reset cliffs",

    mousePressed: function(button, xClick, yClick, modifiers) {
        const editor = this.getEditor();
        const brush = tiled.mapEditor.currentBrush.layerAt(0);

        if (brush.tileAt(2, 2) == null)
        {
            tiled.alert("Please select (in your tileset by dragging) the cliff first. You should select at least 3x3 tiles, up to 3x5 tiles.");
            return;
        }


        var groundTile = brush.tileAt(1, 1); // use the middle tile as the ground tile

        this.initializeBuffer();

        for (var x = 0; x < this.map.width; x++)
            for (var y = 0; y < this.map.height; y++)
            {
                // if this is a ground tile and is an edge tile...
                if (this.map.currentLayer.tileAt(x, y) != null && this.shouldBeTurnedIntoAGroundTile(x, y, brush)) {
                    this.writeTileToBuffer(x, y, groundTile);
                }

                if (this.map.currentLayer.tileAt(x, y) != null && this.shouldBeDeleted(x, y, brush)) {
                    this.writeTileToBuffer(x, y, null);
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

    shouldBeTurnedIntoAGroundTile: function(x, y, brush) {
        var tile = this.map.currentLayer.tileAt(x, y);
        // if it's a top edge tile...
        if (tile == brush.tileAt(0, 0))
            return true;
        if (tile == brush.tileAt(1, 0))
            return true;
        if (tile == brush.tileAt(2, 0))
            return true;
        // if it's a left/right middle edge tile...
        if (tile == brush.tileAt(0, 1))
            return true;
        if (tile == brush.tileAt(2, 1))
            return true;
        // if it's a bottom edge tile...
        if (tile == brush.tileAt(0, 2))
            return true;
        if (tile == brush.tileAt(1, 2))
            return true;
        if (tile == brush.tileAt(2, 2))
            return true;
        return false;
    },

    shouldBeDeleted: function(x, y, brush) {
        // return true if the tile is any of the "below the bottom edge" tiles (i.e., a tile at brush Y 3 or 4)
        var tile = this.map.currentLayer.tileAt(x, y);
        if (tile == brush.tileAt(0, 3))
            return true;
        if (tile == brush.tileAt(0, 4))
            return true;
        if (tile == brush.tileAt(1, 3))
            return true;
        if (tile == brush.tileAt(1, 4))
            return true;
        if (tile == brush.tileAt(2, 3))
            return true;
        if (tile == brush.tileAt(2, 4))
            return true;
        return false;
    },

});
