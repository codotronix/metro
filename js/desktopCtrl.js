(function(){
    angular.module('barickOSApp')
    
    /*****************************************************************************
     * The desktopCtrl
     *****************************************************************************/    
    .controller('desktopCtrl', ['$scope', '$http', function($scope, $http){
        $http.get('data/tiles.json').then(function(res){
            //$scope.tiles = res.data;
            tilify(res.data);
        }, function(err){
            console.log(err);
        });
    }])
    



/*******************************************************************************
*************************** The Helper Functions *******************************
*******************************************************************************/
function tilify (tiles) {
    var big_tile_size = 0;
    var medium_tile_size = 0;
    var small_tile_size = 0;
    var smallTiles = [];
    var mediumTiles = [];
    var bigTiles = [];
    var page_Width_Class = 'xs';
    
    //console.log($('.tiles-container').width());
    
    /*
    * Initialize all global variables
    */
    function initVars(){
        big_tile_size = 0;
        medium_tile_size = 0;
        small_tile_size = 0;
        smallTiles = [];
        mediumTiles = [];
        bigTiles = [];
    }
    
    
    /*
    * calculate height and width of the tiles depending on the tiles_container width
    */
    function calculateWidths () {
        var tiles_Container_width = $('.tiles-container').width() - 17;     //17px = width of scrollbar
        page_Width_Class = 'xs';
        var all_Possible_Width_Classes = 'xs sm md lg';
        
        small_tile_size = Math.floor(tiles_Container_width / 12);
        
        if (tiles_Container_width >= 1200) {
            
            page_Width_Class = 'lg';
            small_tile_size = Math.floor(tiles_Container_width / 16);
            
        } else if (tiles_Container_width >= 992) {
            page_Width_Class = 'md';
            
        } else if (tiles_Container_width >= 768) {
            page_Width_Class = 'sm';
            
        } else {
            page_Width_Class = 'xs';    
            small_tile_size = Math.floor(tiles_Container_width / 4);
        }
        
        medium_tile_size = small_tile_size * 2;
        big_tile_size = medium_tile_size * 2;
        
        $('.tiles-container').removeClass('xs sm md lg').addClass(page_Width_Class);
    }
    
    
    /*
    * This function will simply iterate over tiles array 
    * and fill them into 3 arrays : smallTiles, mediumTiles, bigTiles
    */    
    function categorizeTiles () {
        var tileSize = '';
        for(var i in tiles) {
            tileSize = tiles[i].size;
            if (tileSize == "big") {
                bigTiles.push(makeTileHtml(tiles[i]));
            } else if (tileSize == "medium") {
                mediumTiles.push(makeTileHtml(tiles[i]));
            } else if (tileSize == "small") {
                smallTiles.push(makeTileHtml(tiles[i]));
            }
        }
    }
    
    
    /*
    * This function will take a tile, and return tile-HTML-String 
    */
    function makeTileHtml (tile) {
        tile.bgColor = tile.bgColor || '#000';
        var tileHtml =  '<div class="ui-state-default tile ' + tile.size + ' real" id="' + tile.id + '" title="' + tile.name + '">'
                     +     '<div class="tileInnerContainer" style="background:' + tile.bgColor + '">';
        
        if(tile.iconType == "font") {
            tileHtml +=         '<span class="fontIcon ' + tile.icon + '"></span>';                                    
        }
        
        
        
        
             tileHtml+=         '<label class="name">'
                     +              tile.name
                     +          '</label>'
                     +     '</div>'
                     + '</div>';
        
        return(tileHtml);
    }   
    
    
    /*
    * This function will group 4 small tiles to make a medium tile
    * after balancing the xtra small tiles with dummy tiles
    */
    function groupSmallsToMedium () {
        var residueSmallTiles = smallTiles.length % 4;
        if(residueSmallTiles != 0) {
            var noOfDummyTiles = 4 - residueSmallTiles;            
            
            for (var i=0; i<noOfDummyTiles; i++) {
                var dummyTileHtml =  '<div class="tile small dummy">'
                                    +     '<div class="tileInnerContainer">'
                                    +     '</div>'
                                    + '</div>'; 
                smallTiles.push(dummyTileHtml);
            }
        }      
        
        //var no_s2mC = 1;
        var s2mC = '<div class="s2mC">';            //s2mC stands for "small to medium container"
        for(var i=0; i<smallTiles.length; i++) {
            s2mC += smallTiles[i];
            
            if((i+1)%4 == 0) {
                s2mC += '</div>';
                mediumTiles.push(s2mC);
                s2mC = '<div class="s2mC">';
            }
        }        
    }
    
    /*
    * This function will group 4 medium tiles to make a big tile
    * after balancing the xtra/residue medium tiles with dummy tiles
    */
    function groupMediumToBig () {
        mediumTiles = shuffleTiles(mediumTiles);
        var residueMediumTiles = mediumTiles.length % 4;
        if(residueMediumTiles != 0) {
            var noOfDummyTiles = 4 - residueMediumTiles;            
            
            for (var i=0; i<noOfDummyTiles; i++) {
                var dummyTileHtml =  '<div class="tile medium dummy">'
                                    +     '<div class="tileInnerContainer">'
                                    +         "dM" + i
                                    +     '</div>'
                                    + '</div>'; 
                smallTiles.push(dummyTileHtml);
            }
        }      
        
        //var no_s2mC = 1;
        var m2bC = '<div class="m2bC">';            //m2bC stands for "medium to big container"                        
        for(var i=0; i<mediumTiles.length; i++) {
            m2bC += mediumTiles[i];
            
            if((i+1)%4 == 0) {
                m2bC += '</div>';
                bigTiles.push(m2bC);
                m2bC = '<div class="m2bC">';
            }
        }        
    }
    
    
    /*
    * This function adds Everything to DOM
    */
    function addToDOM () {    
        $('.tiles-container').html(shuffleTiles(bigTiles));
        
        //on xs devices we will not group mediums to make big
        if(page_Width_Class == "xs") {
            $('.tiles-container').append(shuffleTiles(mediumTiles));
        }
        
    }
    
    
    /*
    * This function adds different tile sizes to dom tiles
    */
    function applyTileSize () {
        $('.tile.small').css({
            'width': small_tile_size + 'px',
            'height': small_tile_size + 'px'
        })
        
        $('.tile.medium, .s2mC').css({
            'width': medium_tile_size + 'px',
            'height': medium_tile_size + 'px'
        })
        
        $('.tile.big, .m2bC').css({
            'width': big_tile_size + 'px',
            'height': big_tile_size + 'px'
        })
    }
    
    /*
    * This function will shuffle the elements of an array and return the new array
    */
    function shuffleTiles (tilesArray) {
        var noOfShuffle = Math.round(Math.random() * 10);
        var yesOrNo = 0;
        var temp = null;
        
        for(var j=0; j<= noOfShuffle; j++) {            
            for(var i=0; (i+1) < tilesArray.length; i++) {                
                yesOrNo = Math.round(Math.random() * 1);    // 1=Yes, 0=No                
                if(yesOrNo == 1) {
                    temp = tilesArray[i];
                    tilesArray[i] = tilesArray[i+1];
                    tilesArray[i+1] = temp;
                }
            }            
        }        
        return(tilesArray);
    }
    
    
    function doTilify () {
        initVars();
        calculateWidths();
        categorizeTiles();        
        groupSmallsToMedium();
        //on xs devices we will not group mediums to make big
        if(page_Width_Class != "xs") {groupMediumToBig();}        
        addToDOM();
        applyTileSize();
        initDragging();
        //tapNHoldTile();
    }
    
    doTilify();
    
    $(window).resize(function(){
        setTimeout(doTilify, 200);
    });
    
    /*
    * This function initiates jq-ui-dragging on tiles-container
    */
    function initDragging () {
        $( ".tiles-container, .m2bC, .s2mC" ).sortable();
        //$('.s2mC').append('<div class="handle" style="position:absolute;left:5px;right:5px;top:3px;height:15px;background:rgba(0,55,120,.5);"></div>')
    }
    
    var timeout_id = 0;
    var hold_time = 2500;
    /*
    * Code for Tap and Hold on a Tile
    */
    function tapNHoldTile () {
        
        $('.tile.real').mousedown(function(elem) {
            timeout_id = setTimeout(function(){
                showTileMenu(elem.target);
            }, hold_time);
        }).bind('mouseup mouseleave', function() {
            clearTimeout(timeout_id);
        });

        function showTileMenu(elem) {
          console.log($(elem).closest('.tile'));
            
            var tile = $(elem).closest('.tile');
            var tileID = tile.attr('id');
            var sizeToDo = '';
            
            if(tile.hasClass('small')) {sizeToDo = 'big';}
            else if(tile.hasClass('big')) {sizeToDo = 'medium';}
            else if(tile.hasClass('medium')) {sizeToDo = 'small';}
            
            modifyTile(tileID, "size", sizeToDo);
        }
    }
    
    function modifyTile(tileID, property, value){
        for(var i in tiles) {
            if (tiles[i].id == tileID) {
                tiles[i][property] = value;
                break;
            }
        }
        
        doTilify();
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
    
})()