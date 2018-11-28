interface Rechthoek {
    x: number;
    y: number;
    width:number;
    height:number;
}

interface Positie {
    x: number;
    y: number;

}

class KaartElement {
    protected name: String;
    protected rechthoek : Rechthoek;

    constructor(jsonObject) {
        this.name = jsonObject.name;
        if (jsonObject.rectangle) {
            this.rechthoek = {x: jsonObject.rectangle.x, y: jsonObject.rectangle.y, width:
                jsonObject.rectangle.width, height: jsonObject.rectangle.height }
        }
    }

    drawOnCanvas (transformer : Transformer, canvas : HTMLCanvasElement) {
    }

}

class Gebied extends KaartElement {  
    protected kaartElementLijsten : KaartElement[][];
    protected posities : Positie[] = [];
    protected soort : Number = 0;

    constructor(jsonObject) {
        super(jsonObject);
        this.kaartElementLijsten = [];

        
        // Zoek de objecten die binnen het gebied zitten
        for (let objectLijst of jsonObject.objectlijsten) {
            var kaartElementLijst : KaartElement[] = [];
            for (let kaartObject of objectLijst.lijst) {                
                let kaartElement = KaartElementFactory.kaartElementFromJson(kaartObject);
                kaartElementLijst.push (kaartElement);
            }
            if (kaartElementLijst.length > 0 ){
                this.kaartElementLijsten.push (kaartElementLijst);
            }
        }

        // Zoek de posities van dit gebied
        if (jsonObject.posities) {
            for (let positieJSON of jsonObject.posities) {
                let positie : Positie = {x: positieJSON.x, y: positieJSON.y};
                this.posities.push(positie);
            }
        }

        this.soort = jsonObject.soort;
    }

    drawOnCanvas (transformer : Transformer, canvas : HTMLCanvasElement) {


        // let leftBottom  = transformer.translatePoint ({x: this.myStartPoint.x, y: this.myStartPoint.y});
        // let rightBottom = transformer.translatePoint ({x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y});

        // let rightTop = transformer.translatePoint ({x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y + this.mySize.height});
        // let leftTop  = transformer.translatePoint ({x: this.myStartPoint.x, y: this.myStartPoint.y + this.mySize.height});

        if (this.posities.length > 0) {
            let context = canvas.getContext ("2d");

            context.beginPath();            
            let startPoint = transformer.translatePoint ({x: this.posities[0].x, y: this.posities[0].y});
            context.moveTo(startPoint.x, startPoint.y);

            let currentPos = 0 

            while (currentPos < this.posities.length) {
                let translated = transformer.translatePoint ({x: this.posities[currentPos].x, y: this.posities[currentPos].y});
                context.lineTo(translated.x, translated.y);
                currentPos++;
            }
            context.lineTo(startPoint.x, startPoint.y);
            
            context.closePath();

            
            if (this.soort >= 0 && this.soort < 1000) {                
                context.fillStyle = this.styleForSoort(this.soort);
                context.fill();
            }
            

            // context.stroke();
    

        }
        for (let objectlijsten of this.kaartElementLijsten) {
            for (let tekenObject of objectlijsten) {
                if (tekenObject != null) {
                    tekenObject.drawOnCanvas (transformer, canvas);
                }
            }
        }

        
    }

    styleForSoort (soort : Number ) : string {
        switch (soort){
            case 0: return 'rgb(63, 191, 63)'
            case 1: return 'rgb(63, 191, 63)'
            case 2: return 'rgb(255, 127, 63)';
            case 3: return 'rgb(191, 191, 191)';
            case 4: return 'rgb(63, 127, 63)';
            case 5: return 'rgb(0, 127, 127)';
            case 6: return 'rgb(91, 127, 91)';
            case 7: return 'rgb(63,127,63)';
            case 8: return 'rgb(63, 127, 63)';
            case 9: return 'rgb(10, 10, 30)';
            case 10: return 'rgb(63, 191, 255)';
            default:  
                window.console.log (soort);
                return 'yellow';
        }

       
    }
}

class Kaart extends Gebied {
    constructor(jsonObject) {
        super(jsonObject);
    }    
}

class Straat extends KaartElement {
    protected soort : Number = 0;
    protected posities : Positie[] = [];

    constructor(jsonObject) {
        super(jsonObject);
        this.soort = jsonObject.soort;

        if (jsonObject.posities) {
            for (let positieJSON of jsonObject.posities) {
                let positie : Positie = {x: positieJSON.x, y: positieJSON.y};
                this.posities.push(positie);
            }
        }

    }    

    drawOnCanvas (transformer : Transformer, canvas : HTMLCanvasElement) {

        if (this.posities.length > 0) {
            let context = canvas.getContext ("2d");

            context.beginPath();            
            let startPoint = transformer.translatePoint ({x: this.posities[0].x, y: this.posities[0].y});
            context.moveTo(startPoint.x, startPoint.y);

            let currentPos = 0 

            while (currentPos < this.posities.length) {
                let translated = transformer.translatePoint ({x: this.posities[currentPos].x, y: this.posities[currentPos].y});
                context.lineTo(translated.x, translated.y);
                currentPos++;
            }
            
            // context.closePath();

            context.fillStyle = 'gray';
            // context.fill();
            
            context.lineWidth = 0.2;
            context.stroke();
    

        }
    }
}


class KaartElementFactory {
    static kaartElementFromJson (json) {

        switch (json.classname) {
            case "gids.data.Gebied": return new Gebied (json);
            case "gids.data.Straat": return new Straat (json);
        }
    }
}

// Canvas functions
interface Size {
    width:number
    height:number
}
class Transformer {
    public canvasSize : Size = null

    translatePoint (p: Positie){
        // let x = p.x * this.canvasSize.width;
        // let y = (1 - p.y) * this.canvasSize.height;

        let halfWidth = this.canvasSize.width / 2 ;
        let halfHeight = this.canvasSize.height / 2;

        let x = halfWidth + halfWidth * p.x;
        let y = halfHeight + halfHeight * p.y        
        return {x: x, y: y};        
    }


}

class RotateTransformer extends Transformer {
    constructor (public angleToRotateInDeg=10) {
        super();
    }

    // Hoek uitrekenen tot boven scharnierpunt
    // Lengte uitrekenen
    // Nieuw punt uitrekenen aan de hand daarvan
    translatePoint(p : Positie) : Positie {
        let upperLeft : Positie = {x: -0.01, y: 1.01}

        let sideA = upperLeft.y - (p.y + 1)/2;
        let sideB = upperLeft.x + (p.x + 1)/2;
        let sideC = Math.sqrt (sideA * sideA + sideB * sideB);

        let differenceInRad = this.angleToRotateInDeg / 180 * Math.PI;
        let angleInRad = Math.atan (sideA / sideB);
        let angleToRotateInRad = angleInRad + differenceInRad;

        let sideANew = upperLeft.x + Math.cos (angleToRotateInRad) * sideC;
        let sideBNew = upperLeft.y - Math.sin (angleToRotateInRad) * sideC;
                
        return super.translatePoint({x: sideANew, y: sideBNew});
    } 


}





function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'gids.json', true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == 200) {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }


let normalMap  = <HTMLCanvasElement>  document.getElementById("normalMap");
let rotatedMap = <HTMLCanvasElement>  document.getElementById("rotatedMap");

loadJSON(function(response) {
        var actualJSON = JSON.parse(response);


    let kaart = new Kaart(actualJSON);
    window.console.debug (kaart);

    // Draw normal map
    let transformer = new Transformer();
    transformer.canvasSize = {width: normalMap.width, height: normalMap.height};

    kaart.drawOnCanvas (transformer, <HTMLCanvasElement> normalMap );

    // Draw rotated map
    let rotatedTransformer = new RotateTransformer(45);
    rotatedTransformer.canvasSize = {width: rotatedMap.width, height: rotatedMap.height};

    kaart.drawOnCanvas (rotatedTransformer, <HTMLCanvasElement> rotatedMap );


});
