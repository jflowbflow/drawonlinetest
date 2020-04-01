var colorPicker = []
var myColor = 0;
var playerCount = 01;

let buttons = [];

var sentCount = 0;

function setup()
{
    createCanvas(1920, 1080);
    graphics = createGraphics(475, 100);
    
    //input = createInput();

    //background(0,0,255);
    
    //buttonBlue = createButton('blue');
    
    //createCanvas(400, 400);
    
    //button = new uiBox();
    //button.init(100, 200, 110);
    
    background(51);
    
    colorPicker[0] = [255, 125, 119];
    colorPicker[1] = [120, 207, 253];
    colorPicker[2] = [250, 244, 122];
    colorPicker[3] = [248, 129, 255];
    colorPicker[4] = [121, 255, 238];
    colorPicker[5] = [255, 168, 138];
    colorPicker[6] = [134, 144, 255];
    colorPicker[7] = [182, 254, 127];
    colorPicker[8] = [252, 130, 162];
    colorPicker[9] = [134, 223, 255];
    
    //button = createButton('blue');
    //button.position(25, 25);
    //console.log("hmm " + button);
    
    
    //myColor = colorPicker[1];
    
    
    // BELOW IS IS IMPORTANT
    socket = io.connect('https://drawonline.herokuapp.com/'); //https://drawonline.herokuapp.com/
    socket.on('mouse', newDrawing);
    socket.on('activePlayers', updatePlayerCount);
    
    for (let i = 0; i < 10; i++)
        {
            let b = new Box(25 + (45*i), 63, i);
            buttons.push(b);
            //console.log("hey " + i);
        }
    
    //box = new Box(25, 70, 0);
    
    //box2 = new Box(70, 70, 1);
    //console.log(box.x);
    initToolbar();
    
    var r = Math.floor(Math.random()*10);
    buttons[r].colorSelect(r);
}

function updatePlayerCount(count)
{
    playerCount = count;
    //console.log("count = " + count);
}

class Box {
    
    constructor(x, y, c) 
    {
        this.x = x;
        this.y = y;
        this.brightness = 100;
        this.c = c;
    }
    
    show()
    {
        push();
        stroke(colorPicker[this.c]);
        let color = [colorPicker[this.c][0], colorPicker[this.c][1], colorPicker[this.c][2], this.brightness];
    
        
        
        if (myColor == this.c)
            {
                noStroke();
                
                push();
                fill(0);
                ellipse(this.x, this.y, 45); 
                pop();
                fill(color);
                ellipse(this.x, this.y, 40);   
                //console.log("xx");
            }
        else
            {
                fill(color);
                ellipse(this.x, this.y, 30);
                //console.log("yy");
            }
        pop();
    }
    
    clickedOn(mX, mY)
    {
        let d = dist(mX, mY, this.x, this.y);
        if (d < 22)
            {  
                
                for(let i = 0; i < 10; i ++)
                    {
                        buttons[i].colorSelect(this.c);
                    }
            }
    }
    colorSelect(index)
    {
        if (index == this.c)
            {
                myColor = this.c;
                this.brightness = 255;
                //console.log("????>?");
            }
        else
            {
                this.brightness = 100;
            }
    }
}

function initToolbar()
{
    
}

/*
function uiBox()
{
    this.init = function(x, y, c)
    {
        this.x = x;
        this.y = y;
        this.c = c;
    };

    
    this.show = function()
    {
        push();
        stroke(0, 255, 0);
        fill(0, 255, 0);
        rect(50, 50, 55, 55);
        pop();
    };
    
    
}*/

function newDrawing(data)
{
    noStroke();
    fill(colorPicker[data.c]);
    ellipse(data.x, data.y, 25,25);
    
}

function mousePressed()
{
    for (let i = 0; i < 10; i++)
    {
            buttons[i].clickedOn(mouseX, mouseY);
    }
}

function mouseDragged()
{
    //console.log('Sending: ' + mouseX + ',' + mouseY);
    sentCount++;
    //console.log('sent ' + sentCount);
    var data = 
        {
        x: mouseX,
        y: mouseY,
        c: myColor
        }
    newDrawing(data);
    
    socket.emit('mouse', data); // << THIS IS IMPORTANT
}

//setInterval(saveImage, 1000*10)

function saveImage()
{
    //save("output.png");
}

function draw()
{

    graphics.background(255);
    graphics.noFill();
    graphics.stroke(255);
    graphics.ellipse(mouseX, mouseY, 50, 50);
    
    image(graphics, 0, 0);
        textSize(40);
    textAlign(CENTER, CENTER);
    fill(0);
    text("Welcome to Draw Online!", 230, 25);
    
    textSize(12);
    text("Players Online : " + playerCount, 420, 93);
    text("by @joshuabgad", 52, 93);
    
    //button.show();
    for (let i = 0; i < 10; i++)
        {
            buttons[i].show();
        }
}