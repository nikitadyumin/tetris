/**
 * Created by ndyumin on 01.06.2015.
 */

define(function(require) {
    var Settings = require('game/Settings');
    describe("game settings file", function() {
        it("should contain all the necessary info", function() {
            expect(Settings.COL_COUNT).toBeDefined();
            expect(Settings.ROW_COUNT).toBeDefined();
            expect(Settings.INTERVAL).toBeDefined();
        });
    });
});
