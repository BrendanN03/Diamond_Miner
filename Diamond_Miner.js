/*
 * BN
 * Last updated on 4/1/21
 * Diamond Miner
 * Game where the goal is to mine as many diamonds as you can
 * It contains upgrades that can be bought to increase the amount of diamonds you can earn 
 */

var LIGHT_BLUE = new Color(100, 200, 250);
var BROWN = new Color(121, 96, 76);

//keeps track of the player's total diamonds and the upgrade costs
var money = 0;
var pickUpgradeCost = 25;
var mineUpgradeCost = 100;

var pickLevel = 0;  //how many times the pickaxe has been upgraded
var mineLevel = 0;  //how many times the mine has been upgraded
var dpc = 1;        //when "dpc" is referred to in this program, it stands for diamonds per click

//arrays for all the displays that change throughout the program
var char = [];          //keeps track of the character display
var pickaxe =[];        //holds shape objects for the pickaxe in standard position
var pickaxeDown =[];    //holds shape objects for the pickaxe in mining animation
var topBar = [];        //keeps track of money display and levels display
var pickUpgrader = [];  //keeps track of the pick upgrade cost display
var mineUpgrader = [];  //keeps track of the mine upgrade cost display

function start() { 
    setSize(400, 480);                  //sets canvas size
    setMainBackground();                //biggest function that sets up all initial conditions
    mouseClickMethod(mouseForMain);     //sets what happens when the mouse button is clicked
    mouseDownMethod(mouseHold);	        //sets what happens when the mouse button is held
    mouseUpMethod(mouseRelease);		//sets what happens when the mouse button is released
    println("Welcome to Diamond Miner!");
    showInstructions();                 //displays game instructions
}

//function mouseForMain controls everything that happens when the mouse is clicked
function mouseForMain(e){
    var clicked_position = position(e.getX(), e.getY());
    
    //if tap mine, the money should increase and the amount of money displayed should be updated
    if(clicked_position == "mine") {
        money += dpc;
        topBar[0].setText(money);
    }
    
    //if tap help, the instructions should shown in the console
    if(clicked_position == "help") {
        showInstructions();
    }
    
    if(clicked_position == "leftUpgrade") {
        moveChar("leftUpgrade");
        
        if(money < pickUpgradeCost) {   //case of when user does not have enough diamonds for upgrade
            println("Not enough diamonds. You need " + (pickUpgradeCost - money) 
                    + " more diamonds for this upgrade.");
                    
        //primary aspect of clicking the pick upgrader
        }else{
            //money should reduce, money display should be updated on the screen
            println("Pick upgrade completed. Your diamonds per click increased by 5.");
            money -= pickUpgradeCost;
            topBar[0].setText(money);
            
            //pick level should increase by 1, pick upgrade cost should increase, dpc should increase
            pickLevel += 1;
            pickUpgradeCost += Math.pow(pickLevel, 3)*5;
            dpc = 5*pickLevel + 25*mineLevel;
            
            updateLevels();
        }
    }
    
    if(clicked_position == "rightUpgrade") {
        moveChar("rightUpgrade");
        
        if(money < mineUpgradeCost) {   //if the user does not have enough diamonds for this upgrade
            println("Not enough diamonds. You need " + (mineUpgradeCost - money) 
                    + " more diamonds for this upgrade.");
        
        //primary aspect of clicking the mine upgrader  
        }else{
            
            //money should reduce, money display should be updated on the screen
            println("Mine upgrade completed. Your diamonds per click increased by 25.");
            money -= mineUpgradeCost;
            topBar[0].setText(money);
            
            //mine level increases by 1, mine upgrade cost increases, dpc increases
            mineLevel += 1;
            mineUpgradeCost += Math.pow(mineLevel,4)*5;
            dpc = 5*pickLevel + 25*mineLevel;
            
            updateLevels();
        }
        
    }
}

//this variable is used for mouseHold and mouseRelease
//it gets shown when the mouse is held, and gets hidden when the mouse is released
var diamondAnimation = drawDiamond(getWidth()/2, getHeight()/2-50);

//function mouseHold controls everything that happens when the mouse is held
function mouseHold(e){
    //if hold mine
    if(position(e.getX(), e.getY()) == "mine") {
        
        moveChar("mine");
        
        //change the character display by changing the pickaxe state to mining animation
        for(var i = char.length - pickaxeDown.length; i < char.length; i++){
	        remove(char[i]);
	        char[i] = pickaxeDown[i-(char.length - pickaxeDown.length)];
	        add(char[i]);
	    }
	    
	    //adds diamond icon above the mine
        for(var i = 0; i < diamondAnimation.length; i++){
            add(diamondAnimation[i]);
        }
    }
}

//function mouseRelease controls everything that happens when the mouse is released
//updates the character display with the pickaxe in its standard state and removes diamond animation
function mouseRelease(e){
    for(var i = char.length - pickaxe.length; i < char.length; i++){
        remove(char[i]);
	    char[i] = pickaxe[i - (char.length - pickaxe.length)];
	    add(char[i]);
	}
	
	for(var i = 0; i < diamondAnimation.length; i++){
        remove(diamondAnimation[i]);
    }
}


//sets up all initial conditions
//fills arrays, adds initial object arrays to the screen
function setMainBackground(){ 
    
    /* objects that are constantly displayed in the background
     * no arrays */
        add(drawRect(getWidth(), 80, Color.BLACK, 0, 0));       //bottom black line of top bar                     
        add(drawRect(getWidth(), 70, BROWN, 0, 0));             //brown filling of top bar 
        add(drawLine(10, Color.BLACK, 265, 0, 265, 70));        //black line seperating money and levels
        
        var diamondIcon = drawDiamond(25, 35);                  //draws a diamond icon centered at (25,35)
        for(var i = 0; i < diamondIcon.length; i++){
            add(diamondIcon[i]);
        }
        
        add(drawRect(30, 40, Color.WHITE, getWidth()-30, 0));   //white rect of help icon
        add(drawText("?", Color.BLACK, 30, 375, 35));           //question mark of help icon
        add(drawRect(getWidth(), getHeight()-80, Color.GRAY, 0, 80));   //whole gray background
        add(drawRect(100, 100, Color.RED, getWidth()/2-50, (getHeight()-80)/2 + 80 - 50)); //actual mine
        add(drawText("Click", Color.BLACK, 20, getWidth()/2-30, (getHeight()+80)/2)) //"click" text on mine
        add(drawText("Pick Level:", Color.BLACK, 10, 275, 20));  //char level
        add(drawText("Mine Level:", Color.BLACK, 10, 275, 40));  //mine level
        add(drawText("Total DPC:", Color.BLACK, 10, 275, 60));  //diamonds per click
    
    
    /* objects that display the 4 variables in the top bar which can be updated
        * money, display1, display2, display 3
     * array topBar[] */
        topBar.push(drawText(money, LIGHT_BLUE, 20, 50, 45));       //money
        topBar.push(drawText(pickLevel, Color.BLACK, 10, 345, 20));  //total dpc
        topBar.push(drawText(mineLevel, Color.BLACK, 10, 345, 40));  //pick level
        topBar.push(drawText(dpc, Color.BLACK, 10, 345, 60));  //mine level
        
        for(var i = 0; i < topBar.length; i++){
            add(topBar[i]);
	    }
    
    /* objects that make up the pickaxe and its animation
     * arrays pickaxe[], pickaxeDown[] */
        //pickaxe in default form (uses pickaxe[])
        pickaxe.push(drawLine(20, BROWN, 120, 320, 130, 240));
    	pickaxe.push(drawLine(20, LIGHT_BLUE, 80, 260, 135, 240));
    	pickaxe.push(drawLine(20, LIGHT_BLUE, 125, 240, 180, 270));
    	//pickaxe in mining form (uses pickaxeDown[])
    	pickaxeDown.push(drawLine(20, BROWN, 120, 320, 130, 240));
            pickaxeDown[0].rotate(90);
    	pickaxeDown.push(drawLine(20, LIGHT_BLUE, 160, 280, 135, 240));
    	pickaxeDown.push(drawLine(20, LIGHT_BLUE, 160, 280, 135, 320));
     

    /* objects that make up the user character
     * array char[] */
        char.push(drawOval(80, 120, Color.BLUE, getWidth()/2-125, (getHeight()+80)/2));
        char.push(drawOval(60, 100, Color.GREEN, getWidth()/2-125, (getHeight()+80)/2));
    	char.push(drawRect(50, 50, Color.BLUE, getWidth()/2-150, getHeight()/2-50));
    	char.push(drawRect(10, 10, Color.GREEN, getWidth()/2-140, getHeight()/2-40));
    	char.push(drawRect(10, 10, Color.GREEN, getWidth()/2-120, getHeight()/2-40));
    	char.push(drawRect(30, 10, Color.GREEN, getWidth()/2-140, getHeight()/2-20));
    	char.push(drawRect(30, 10, Color.GREEN, getWidth()/2-140, getHeight()/2-60));
    	
    	//adds pickaxe to character display 
    	for(var i = 0; i < pickaxe.length; i++){
    	    char.push(pickaxe[i]);
    	}
    	
    	for(var i = 0; i < char.length; i++){
	        add(char[i]);
	    }
	    
	    
	 /* objects that display the 2 upgraders
      * arrays perClickUpgrader[], autoClickUpgrader */
        pickUpgrader.push(drawRect(100, 50, Color.YELLOW, getWidth()/2 - 150, getHeight()-50)); //left
        pickUpgrader.push(drawText(pickUpgradeCost, Color.BLACK, 15, 60, getHeight()-17));
        pickUpgrader.push(drawText("Pickaxe Upgrader", Color.BLACK, 8, 57, getHeight()-38));
        pickUpgrader.push(drawText("$ Next Upgrade Cost", Color.BLACK, 6, 57, getHeight()-5));
        
        for(var i = 0; i < pickUpgrader.length; i++){
            add(pickUpgrader[i]);
        }
        
        mineUpgrader.push(drawRect(100, 50, Color.YELLOW, getWidth()/2 + 50, getHeight()-50)); //right
        mineUpgrader.push(drawText(mineUpgradeCost, Color.BLACK, 15, 258, getHeight()-17));
        mineUpgrader.push(drawText("Mine Upgrader", Color.BLACK, 8, 264, getHeight()-38));
        mineUpgrader.push(drawText("$ Next Upgrade Cost", Color.BLACK, 6, 258, getHeight()-5));
        
        for(var i = 0; i < mineUpgrader.length; i++){
            add(mineUpgrader[i]);
        }
}

//displays instructions as lines of text in the console when prompted
function showInstructions(){
    println("Click the red square to mine for diamonds");
    println("Increase the amount of diamonds per click by buying upgrades");
    println("Buy upgrades by clicking the yellow boxes at the bottom");
    println("The costs for each upgrade are displayed on the yellow box");
    println("Press the ? button in the top right to display the directions again");
    println("Goal: get as many diamonds as you can");
    println("");
}

//updates canvas display with pick level, mine level, dpc, pick upgrade cost, and mine upgrade cost 
function updateLevels(){
    //pick level will be updated on the screen
    remove(topBar[1]);
    topBar[1] = drawText(pickLevel, Color.BLACK, 10, 345, 20);  
    add(topBar[1]);
    
    //mine level will be updated on the screen
    remove(topBar[2]);
    topBar[2] = drawText(mineLevel, Color.BLACK, 10, 345, 40);  
    add(topBar[2]);
            
    //diamonds per click will be updated on the screen
    remove(topBar[3]);
    topBar[3] = drawText(dpc, Color.BLACK, 10, 345, 60);  
    add(topBar[3]);
            
    //pick upgrade cost will be updated on the screen
    remove(pickUpgrader[1]);
    pickUpgrader[1] = drawText(pickUpgradeCost, Color.BLACK, 15, 60, getHeight()-17);
    add(pickUpgrader[1]);
    
    //mine upgrade cost will be updated on the screen
    remove(mineUpgrader[1]);
    mineUpgrader[1] = drawText(mineUpgradeCost, Color.BLACK, 15, 258, getHeight()-17);
    add(mineUpgrader[1]);
}

function moveChar(newLocation){
    if(newLocation == "leftUpgrade"){
        if(char[0].getY() < 300){                   //if at mine
            for(var i = 0; i < char.length; i++){
                char[i].move(20,150);
            }
        }else if(char[0].getX() > getWidth()/2){    //if at rightUpgrade
            for(var i = 0; i < char.length; i++){
                char[i].move(-200,0);
            }
        }
        
    }else if(newLocation == "rightUpgrade"){
        if(char[0].getY() < 300){                   //if at mine
            for(var i = 0; i < char.length; i++){
                char[i].move(220,150);
            }
        }else if(char[0].getX() < getWidth()/2){    //if at leftUpgrade
            for(var i = 0; i < char.length; i++){
                char[i].move(200,0);
            }
        }
        
    }else if(newLocation == "mine"){
        if(char[0].getY() > 300){
            if(char[0].getX() < getWidth()/2){      //if at leftUpgarde
                for(var i = 0; i < char.length; i++){
                    char[i].move(-20,-150);
                }
            }else{                                  //if at rightUpgrade
                for(var i = 0; i < char.length; i++){
                    char[i].move(-220,-150);
                }
            }
        }
    }
}
//returns one of the 4 locations where the mouse is able to click
    //mine, help button, pickaxe upgrade button, mine upgrade button
function position(x, y){
    if(x >= getWidth()/2-50 && x <= getWidth()/2+50 &&
    y >= (getHeight()-80)/2 + 80 - 50 && y <= (getHeight()-80)/2 + 80 + 50){
        return "mine";
    }
    
    if(x >= getWidth()-30 && x <= getWidth() && 
    y >= 0 && y <= 40){
        return "help";
    }
    
    if(x >= getWidth()/2-150 && x <= getWidth()/2-50 && 
    y >= getHeight() - 50 && y <= getHeight()){
        return "leftUpgrade";
    }
    
    if(x >= getWidth()/2+50 && x <= getWidth()/2+150 && 
    y >= getHeight() - 50 && y <= getHeight()){
        return "rightUpgrade";
    }
}

//given parameters of position, returns a diamond icon
function drawDiamond(x, y){
    var diamondIcon = [];
    diamondIcon.push(drawOval(40, 40, LIGHT_BLUE, x, y));
    diamondIcon.push(drawLine(3, Color.BLACK, x, y+15, x-16, y-1));
    diamondIcon.push(drawLine(3, Color.BLACK, x, y+15, x+16, y-1));
    diamondIcon.push(drawLine(3, Color.BLACK, x-16, y-1, x-10, y-11));
    diamondIcon.push(drawLine(3, Color.BLACK, x+16, y-1, x+10, y-11));
    diamondIcon.push(drawLine(3, Color.BLACK, x-10, y-11, x+10, y-11));
    return diamondIcon;
}

//returns an oval object with all needed parameters for this program
function drawOval(width, height, color, x, y){
	var oval = new Oval(width, height);
	oval.setColor(color);
	oval.setPosition(x, y);
	return oval;
}

//returns a rectangle object with all needed parameters for this program
function drawRect(width, height, color, x, y){
    var rect = new Rectangle(width, height);
    rect.setPosition(x, y);
    rect.setColor(color);
    return rect;
}

//returns a line object with all needed parameters for this program
function drawLine(width, color, x1, y1, x2, y2){
    var line = new Line(x1, y1, x2, y2);
    line.setLineWidth(width);
    line.setColor(color);
    return line;
}

//returns a text object with all needed parameters for this program
function drawText(text, color, s, x, y){
    var text = new Text(text, s +"pt Arial");
    text.setPosition(x, y);
    text.setColor(color);
    return text;
}
