function tilify () {
    
    var big_tile_size = 0;
    var medium_tile_size = 0;
    var small_tile_size = 0;
    
    function calculateWidths () {
        var tiles_Container_width = $('.tiles-container').width();
        var page_Width_Class = 'xs';
        var all_Possible_Width_Classes = 'xs sm md lg';
        
        big_tile_size = tiles_Container_width / 3;
        medium_tile_size = big_tile_size / 2;
        small_tile_size = medium_tile_size / 2;
        
        if (tiles_Container_width >= 1200) {
            
            page_Width_Class = 'lg';
            big_tile_size = tiles_Container_width / 4;
            medium_tile_size = big_tile_size / 2;
            small_tile_size = medium_tile_size / 2;
            
        } else if (tiles_Container_width >= 992) {
            page_Width_Class = 'md';
            
        } else if (tiles_Container_width >= 768) {
            page_Width_Class = 'sm';
            
        } else {
            page_Width_Class = 'xs';
            
            big_tile_size = tiles_Container_width / 2;
            medium_tile_size = big_tile_size / 2;
            small_tile_size = medium_tile_size / 2;            
        }
        
        $('body').removeClass('xs sm md lg').addClass(page_Width_Class);
    }
    
    function applyTileSize () {
        $('.tile.big').css({
            'height': big_tile_size,
            'width': big_tile_size
        });
        
        $('.tile.medium').css({
            'height': medium_tile_size,
            'width': medium_tile_size
        });
        
        $('.tile.small').css({
            'height': small_tile_size,
            'width': small_tile_size
        });
    }
    
    /*
    * This function will 
    * 1. Shuffle the elements of smallTilesArray
    * 2. Balance the no of small tiles by making it multiple of 4, by adding dummy small tiles
    */
    function balanceSmallTiles () {
        var smallTiles = $('.tile.small.real');
        smallTiles = shuffleTiles(smallTiles);
        var residue = smallTiles.length % 4;
        //console.log(residue);
        if (residue != 0) {
            //console.log(smallTiles);
            var noOfDummyTilesNeeded = 4-residue;
            for(var i=0; i<noOfDummyTilesNeeded; i++) { //console.log("i="+i);
                smallTiles.push($('<div class="small dummy tile"><span>D' +i+ '</span></div>')[0]);
            }
        }
        //console.log(smallTiles);
        return(smallTiles);
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
    
    /*
    * This function will group the small tiles into 4 to make Medium Tiles,
    * and Then combining with real medium tiles, it will return an array of medium tiles
    */
    function groupSmallToMedium (smallTilesArray) {
        var mediumTiles = $('.tile.medium.real');
        mediumTiles = shuffleTiles(mediumTiles);
        
        var smallToMidContainer = null;
        var containerNo = 0;
        
        smallToMidContainer = null; // $('<div class="smallToMidContainer" id="s2mC_'+containerNo+'"></div>');
        
        
        smallTilesArray.each(function(index){
            //console.log($(this)[0]);
            
            if(index % 4 == 0) {
                if (smallToMidContainer != null) {
                   mediumTiles.push(smallToMidContainer[0]);
                }
                containerNo++; 
                smallToMidContainer = $('<div class="smallToMidContainer" id="s2mC_'+containerNo+'"></div>');
            }
            smallToMidContainer.add($(this)[0]);
        });
        
        mediumTiles.push(smallToMidContainer[0]);
        
        //console.log(smallToMidContainer);
        
        console.log(mediumTiles);
        return(mediumTiles);
    }
    
    function reStrutureTiles () {
        //balance the no of small tiles by adding dummy small tiles
        var smallTiles = balanceSmallTiles();
        
        //group the small tiles into 4 to make medium tiles
        var mediumTiles = groupSmallToMedium(smallTiles);
        
        
        
        var bigTiles = $('.tile.big');
        
        //var smallTiles = $('.tile.small');
        
        
        var restructuredHtml = '';
        
        var reUL = $('<ul></ul>');
        
        bigTiles.each(function(){
            //console.log($(this)[0]);
            //restructuredHtml += $(this)[0];
            reUL.append($(this));
            //console.log(reUL);
        });
        mediumTiles.each(function(){
            //restructuredHtml += $(this)[0];
            reUL.append($(this));
        });
        smallTiles.each(function(){
            //restructuredHtml += $(this)[0];
            reUL.append($(this));
        });
        
        //console.log(reUL);
        $('.tiles-container').html(reUL);
    }
    
    function structurePage () {
        calculateWidths();        
        reStrutureTiles();
        applyTileSize();
    }
    
    structurePage();
    
    
    $(window).resize(function(){
        setTimeout(structurePage, 200);
    });
}