$(document).ready(function(){

    var canvas = $('canvas');
    var canvasWidth = canvas.width() - 100;
    var canvasHeight = canvas.height() - 100;
    var originalLineWidth = canvasWidth / 4;
    var linedrawn = [];

    init();

    function reset(){
        linedrawn = [];
        originalLineWidth = 30;
        $('canvas').clearCanvas();
    }

    function draw(linesToDraw){
        var opt = {};
        _.each(linesToDraw, function(line){
            var result = _.where(linedrawn, {x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2});
            if (result.length == 0){
                opt = {
                    strokeStyle: '#0000',
                    strokeWidth: 0.5,
                    translateX: 0.5,
                    translateY: 0.5
                };
                opt['x1'] = line.x1;
                opt['y1'] = line.y1;
                opt['x2'] = line.x2;
                opt['y2'] = line.y2;
                canvas.drawLine(opt);
                linedrawn.push(line);
            }
        });
    }

    function generate(n, ratio, newLines){
        //if(n > 30 && n <= 60){
        //    originalLineWidth = 15;
        //}else if(n > 60 && n <= 99){
        //    originalLineWidth = 10;
        //}else if(n > 99){
        //    originalLineWidth = 10;
        //    ratio /= 2;
        //}
        if (ratio > 0){
            originalLineWidth = originalLineWidth / Math.pow(ratio, ratio/4);
        }else{
            originalLineWidth = originalLineWidth / Math.pow(ratio/4, ratio);
        }

        for(var i = 0; i <= n; i++){
            newLines = generateLines(ratio, newLines);
            draw(newLines);
        }
    }

    function generateLines(ratio, newLines){
        var width = originalLineWidth * ratio;
        var generatedLines = [];
        if(newLines == null){
            var line = new Line((canvasWidth/2) - (width/2), canvasHeight/2,
                                (canvasWidth/2) + (width/2), canvasHeight/2);
            generatedLines.push(line);
        }else{
            _.each(newLines, function(line){
                var result1 = _.where(linedrawn, {x1: line.x1, y1: line.y1})
                    .concat(_.where(linedrawn, {x2: line.x1, y2: line.y1}));


                var result2 = _.where(linedrawn, {x1: line.x2, y1: line.y2})
                    .concat(_.where(linedrawn, {x2: line.x2, y2: line.y2}));

                if(line.isVertical()){
                    //new line 1
                    if(result1.length < 2){
                        generatedLines.push(new Line(line.x1 - (width/2), line.y1, line.x1 + (width/2), line.y1));
                    }
                    //new line 2
                    if(result2.length < 2){
                        generatedLines.push(new Line(line.x2 - (width/2), line.y2, line.x2 + (width/2), line.y2));
                    }
                }else{
                    //new line 1
                    if(result1.length < 2){
                        generatedLines.push(new Line(line.x1, line.y1 - (width/2), line.x1, line.y1 + (width/2)));
                    }
                    //new line 2
                    if(result2.length < 2){
                        generatedLines.push(new Line(line.x2, line.y2 - (width/2), line.x2, line.y2 + (width/2)));
                    }
                }
            });
        }
        return generatedLines;
    }

    function Line(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.isVertical = function(){
            return x1 == x2;
        }
    }

    function init(){
        $('#formScale').submit(function(e){
            e.preventDefault();
            reset();
            generate($('#inputGeneration').val(), $('#inputScale').val());
        });

        $('.btn-clear').click(reset);
        generate(0, 1);
    }

});
