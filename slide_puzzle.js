var game_start = false;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var name = document.getElementById("name").value;
    
    
    var img = new Image();
    img.src = 'https://static.wixstatic.com/media/5f2ed7_1753fdf3b17640d4a961e0708bca4e3c~mv2.png';
    img.addEventListener('load', draw_board, false);
    
    c.addEventListener("click", on_click);
    c.addEventListener("mouseover", mouse_hover);
    
    isMobileDevice()
    
    var n = 3; //size of puzzle
    var blank = n*n; //number for blank square
    var box_w = c.width/n;
    var box_h = c.height/n;
    var img_coords = []
    console.log(box_w);
    
    var board = [];
    var win = false;
    var moves = 0

    //initialize the grid
    //make_board()
    var starting_board = []
    //draw_board()

    
    function isMobileDevice() {
        if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)){
            c.width = 100;
            c.height = 100;
        
        }
    };
    
//____________________________________________________________________________________
    function start_btn(){
        name = document.getElementById("name").value;
        if (name !=""){
            document.getElementById("name_input").style.display = "none";
            c.style="border:1px solid #000000;"
            game_start=true;
            /*
            moves = 0;
            var d = new Date();
            start_time=d.getTime();
            draw_board()*/
            reset();
        }
        else{
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.textAlign = "center";
            ctx.font = "50px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("Please enter a name", c.width/2, c.height/2);
        }
    }
    
    function reset(){
        moves = 0;
        var d = new Date();
        start_time=d.getTime();
        win = false;
        board=[];
        make_board()
        starting_board=board
        draw_board()

    }

    function make_board(){
        /*
        for (var i=0; i<5; i++){
            x1 = Math.floor(Math.random() * n)
            y1 = Math.floor(Math.random() * n)
            x2 = Math.floor(Math.random() * n)
            y2 = Math.floor(Math.random() * n)
            t = board[y1][x1]
            board[y1][x1] = board[y2][x2]
            board[y2][x2] = t
        }
        */
        
        //initialize board as a 1D list from 0 to n*n
        fboard = []
        i = 1
        for (var y = 1; y <= n; y++) {
            for (var x = 1; x <= n; x++) {
                fboard.push(i)
                img_coords.push([x-1,y-1])
                i++
            }
        }
        //randomize
        //randomly swap 2 squares for n*n*2 times
        for (var i=0; i<n*n*2; i++){
            x1 = Math.floor(Math.random() * n*n)
            x2 = Math.floor(Math.random() * n*n)
            t = fboard[x1]
            fboard[x1] = fboard[x2]
            fboard[x2] = t
        }
        console.log(fboard)
        
        //check if solvable
        solvable = false
        inv=0
        blank_spot=0
        for(var i = 0; i<fboard.length; i++){
            if (fboard[i]!= blank){
                for(var j = i+1; j<fboard.length; j++){
                    if(fboard[i] > fboard[j] && fboard[j]!=blank){
                        inv++
                    }
                }
            }
            else{
                blank_spot=i
            }
          
        }
        
        if(n%2==0){
            r = Math.floor(blank_spot / n)
            solvable = (inv + (n-1) - r) % 2 == 0
        }
        else{
            solvable = inv%2==0 
        }
        
        //if unsolvable, make solvable
        if(!solvable){
            if(fboard[0]!=blank && fboard[1]!=blank){
                t = fboard[0]
                fboard[0] = fboard[1]
                fboard[1] = t
            }
            else{
                t = fboard[fboard.length-1]
                fboard[fboard.length-1] = fboard[fboard.length-2]
                fboard[fboard.length-2] = t
            }
        }
        console.log(fboard)
        //puts the 1d list into a 2d array
        var i=0
        for (var y = 0; y < n; y++) {
            board.push([])
            for (var x = 0; x < n; x++) {
                board[y].push(fboard[i])
                i++
            }
        }
    }
    

    
    function mouse_hover(event){
//        console.log(event.clientX);
//        console.log(event.clientY);
    }

    function on_click(event){
        //console.log(event.clientX);
        //console.log(event.clientY);
        if(game_start && !win){
            box_coords = get_box_cords(event.clientX, event.clientY);
            blank_coord = get_blank_coord(box_coords[0], box_coords[1])
            if(blank_coord != -1){
    //            console.log(blank_coord)
                //switch
                swap(box_coords, blank_coord)
                moves++
                draw_board()
                console.log(check_solved())
            }
            if(check_solved()){
                solved()
            }
        }
    }
    
    //runs when the player s
    function solved(){
        ctx.clearRect(0, 0, c.width, c.height);

        win = true
        d = new Date();
        end_time = (d.getTime()-start_time); 

        secret = (end_time+name.length)*moves + n
        console.log(secret)
       
        colors = [
            "#FFF0DE",
            "#FADBD8",
            "#E0FFF9",
            "#DACCEA",
            "#CBEFCB",
            "#D5CEDB",
            "#D3D3D3"
        ]
        
        
        ctx.beginPath();
        ctx.rect(0,0,c.width,c.height);
        ctx.fillStyle = colors[secret%colors.length];
        ctx.fill();
        
        win_img = [
            "https://static.wixstatic.com/media/5f2ed7_62243d32769f4e5b9dfa661f5ab92ab2~mv2.png",
            "https://static.wixstatic.com/media/5f2ed7_6c681560e200472297d5c7811544ab20~mv2.png",
            "https://static.wixstatic.com/media/5f2ed7_002ce7e900434cc79adda9ca64155372~mv2.png"
        ]
        
        var bg = new Image(500,500);
        bg.src = win_img[secret%win_img.length];
        bg.addEventListener('load', function() {
            ctx.drawImage(bg,0,0)
            var win_message=[
                'Congratulations',
                'Excellent job',
                'Nice work',
                'You did it',
                'Awesome',
            ]
            
            ctx.textAlign = "center";
            ctx.font = "50px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(win_message[secret%win_message.length], c.width/2, c.height/2 - 80);
            ctx.fillText(name, c.width/2, c.height/2 - 30);
            

            ctx.textAlign = "center";
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.fillText('You completed the ' + n + 'x'+ n +' puzzle', c.width/2, c.height/2 );   
            
            ctx.textAlign = "center";
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.fillText('Time: ' + end_time/1000 + ' seconds', c.width/2, c.height/2 + 80);   
            ctx.fillText('You made ' + moves +' moves' , c.width/2, c.height/2 + 120); 
            
            ctx.textAlign = "center";
            ctx.font = "8px Arial";
            ctx.fillStyle = "gray";
            ctx.fillText(secret, 10, 10);
            
        }, false);             
        
    }
    
    //check if the board is solved
    function check_solved(){
        var i = 1
        for (var y = 0; y < n; y++) {
            for (var x = 0; x < n; x++) {
                if(board[y][x] != i){
                    return false
                }
                i++
            }
        }
        console.log(moves)
        return true
    }
    
    //swaps the locations of 2 boxes
    function swap(box1, box2){
        t = board[box1[0]][box1[1]]
        board[box1[0]][box1[1]] =  board[box2[0]][box2[1]]
        board[box2[0]][box2[1]] = t
    }
    
    //get the coordinates of the blank box around the selected box. returns -1 if the blank box is not around it.
    function get_blank_coord(x, y){
        if(x>0 && board[x-1][y] == blank){
            return [x-1, y]
        }
        if(x<n-1 && board[x+1][y] == blank ){
            return [x+1, y]
        }
        if(y>0 && board[x][y-1] == blank ){
            return [x, y-1]
        }
        if(y<n-1 && board[x][y+1] == blank ){
            return [x, y+1];
        }
        return -1;
    }

    //get the coords of the box based on mouse coords
    function get_box_cords(x, y){
        xcoord = Math.floor(x/box_w);
        ycoord = Math.floor(y/box_h);
        return [ycoord, xcoord];
    }
    
    
    //draws the whole board
    function draw_board(){
        if(!game_start){
        }
        else{
            ctx.clearRect(0, 0, c.width, c.height);
            for (var x = 0; x < board.length; x++) {
                for (var y = 0; y < board[0].length; y++) {
                    draw_box(board[y][x], x*box_w, y*box_h)
                }
            }     
        }
    }
    
    
    //draw single box
    function draw_box(num, x, y){
        //console.log(num)
        ctx.beginPath();
        ctx.lineWidth = "2";    
        ctx.strokeStyle = "black";
        ctx.rect(x,y, box_w, box_h);
        if(num != blank){
            ctx.fillStyle = "#BEE2E2";
            ctx.fill();
            ctx.drawImage(img, img_coords[num-1][0] * img.width/n,img_coords[num-1][1] * img.height/n, img.width/n, img.height/n, 
            x,y, box_w, box_h);        
            /*
            ctx.textAlign = "center";
            ctx.font = "24px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(num, x+box_w/2, y+box_h/2);
            */
        }
        else{
        ctx.fillStyle = "#000000";
            ctx.fill();
        }
        ctx.stroke();
    }