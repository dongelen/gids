var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var KaartElement = /** @class */ (function () {
    function KaartElement(jsonObject) {
        this.name = jsonObject.name;
        if (jsonObject.rectangle) {
            this.rechthoek = { x: jsonObject.rectangle.x, y: jsonObject.rectangle.y, width: jsonObject.rectangle.width, height: jsonObject.rectangle.height };
        }
    }
    KaartElement.prototype.drawOnCanvas = function (transformer, canvas) {
    };
    return KaartElement;
}());
var Gebied = /** @class */ (function (_super) {
    __extends(Gebied, _super);
    function Gebied(jsonObject) {
        var _this = _super.call(this, jsonObject) || this;
        _this.posities = [];
        _this.soort = 0;
        _this.kaartElementLijsten = [];
        // Zoek de objecten die binnen het gebied zitten
        for (var _i = 0, _a = jsonObject.objectlijsten; _i < _a.length; _i++) {
            var objectLijst = _a[_i];
            var kaartElementLijst = [];
            for (var _b = 0, _c = objectLijst.lijst; _b < _c.length; _b++) {
                var kaartObject = _c[_b];
                var kaartElement = KaartElementFactory.kaartElementFromJson(kaartObject);
                kaartElementLijst.push(kaartElement);
            }
            if (kaartElementLijst.length > 0) {
                _this.kaartElementLijsten.push(kaartElementLijst);
            }
        }
        // Zoek de posities van dit gebied
        if (jsonObject.posities) {
            for (var _d = 0, _e = jsonObject.posities; _d < _e.length; _d++) {
                var positieJSON = _e[_d];
                var positie = { x: positieJSON.x, y: positieJSON.y };
                _this.posities.push(positie);
            }
        }
        _this.soort = jsonObject.soort;
        return _this;
    }
    Gebied.prototype.drawOnCanvas = function (transformer, canvas) {
        // let leftBottom  = transformer.translatePoint ({x: this.myStartPoint.x, y: this.myStartPoint.y});
        // let rightBottom = transformer.translatePoint ({x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y});
        // let rightTop = transformer.translatePoint ({x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y + this.mySize.height});
        // let leftTop  = transformer.translatePoint ({x: this.myStartPoint.x, y: this.myStartPoint.y + this.mySize.height});
        if (this.posities.length > 0) {
            var context = canvas.getContext("2d");
            context.beginPath();
            var startPoint = transformer.translatePoint({ x: this.posities[0].x, y: this.posities[0].y });
            context.moveTo(startPoint.x, startPoint.y);
            var currentPos = 0;
            while (currentPos < this.posities.length) {
                var translated = transformer.translatePoint({ x: this.posities[currentPos].x, y: this.posities[currentPos].y });
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
        for (var _i = 0, _a = this.kaartElementLijsten; _i < _a.length; _i++) {
            var objectlijsten = _a[_i];
            for (var _b = 0, objectlijsten_1 = objectlijsten; _b < objectlijsten_1.length; _b++) {
                var tekenObject = objectlijsten_1[_b];
                if (tekenObject != null) {
                    tekenObject.drawOnCanvas(transformer, canvas);
                }
            }
        }
    };
    Gebied.prototype.styleForSoort = function (soort) {
        switch (soort) {
            case 0: return 'rgb(63, 191, 63)';
            case 1: return 'rgb(63, 191, 63)';
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
                window.console.log(soort);
                return 'yellow';
        }
    };
    return Gebied;
}(KaartElement));
var Kaart = /** @class */ (function (_super) {
    __extends(Kaart, _super);
    function Kaart(jsonObject) {
        return _super.call(this, jsonObject) || this;
    }
    return Kaart;
}(Gebied));
var Straat = /** @class */ (function (_super) {
    __extends(Straat, _super);
    function Straat(jsonObject) {
        var _this = _super.call(this, jsonObject) || this;
        _this.soort = 0;
        _this.posities = [];
        _this.soort = jsonObject.soort;
        if (jsonObject.posities) {
            for (var _i = 0, _a = jsonObject.posities; _i < _a.length; _i++) {
                var positieJSON = _a[_i];
                var positie = { x: positieJSON.x, y: positieJSON.y };
                _this.posities.push(positie);
            }
        }
        return _this;
    }
    Straat.prototype.drawOnCanvas = function (transformer, canvas) {
        if (this.posities.length > 0) {
            var context = canvas.getContext("2d");
            context.beginPath();
            var startPoint = transformer.translatePoint({ x: this.posities[0].x, y: this.posities[0].y });
            context.moveTo(startPoint.x, startPoint.y);
            var currentPos = 0;
            while (currentPos < this.posities.length) {
                var translated = transformer.translatePoint({ x: this.posities[currentPos].x, y: this.posities[currentPos].y });
                context.lineTo(translated.x, translated.y);
                currentPos++;
            }
            // context.closePath();
            context.fillStyle = 'gray';
            // context.fill();
            context.lineWidth = 0.2;
            context.stroke();
        }
    };
    return Straat;
}(KaartElement));
var KaartElementFactory = /** @class */ (function () {
    function KaartElementFactory() {
    }
    KaartElementFactory.kaartElementFromJson = function (json) {
        switch (json.classname) {
            case "gids.data.Gebied": return new Gebied(json);
            case "gids.data.Straat": return new Straat(json);
        }
    };
    return KaartElementFactory;
}());
var Transformer = /** @class */ (function () {
    function Transformer() {
        this.canvasSize = null;
    }
    Transformer.prototype.translatePoint = function (p) {
        // let x = p.x * this.canvasSize.width;
        // let y = (1 - p.y) * this.canvasSize.height;
        var halfWidth = this.canvasSize.width / 2;
        var halfHeight = this.canvasSize.height / 2;
        var x = halfWidth + halfWidth * p.x;
        var y = halfHeight + halfHeight * p.y;
        return { x: x, y: y };
    };
    return Transformer;
}());
var RotateTransformer = /** @class */ (function (_super) {
    __extends(RotateTransformer, _super);
    function RotateTransformer(angleToRotateInDeg) {
        if (angleToRotateInDeg === void 0) { angleToRotateInDeg = 10; }
        var _this = _super.call(this) || this;
        _this.angleToRotateInDeg = angleToRotateInDeg;
        return _this;
    }
    // Hoek uitrekenen tot boven scharnierpunt
    // Lengte uitrekenen
    // Nieuw punt uitrekenen aan de hand daarvan
    RotateTransformer.prototype.translatePoint = function (p) {
        var upperLeft = { x: -0.01, y: 1.01 };
        var sideA = upperLeft.y - (p.y + 1) / 2;
        var sideB = upperLeft.x + (p.x + 1) / 2;
        var sideC = Math.sqrt(sideA * sideA + sideB * sideB);
        var differenceInRad = this.angleToRotateInDeg / 180 * Math.PI;
        var angleInRad = Math.atan(sideA / sideB);
        var angleToRotateInRad = angleInRad + differenceInRad;
        var sideANew = upperLeft.x + Math.cos(angleToRotateInRad) * sideC;
        var sideBNew = upperLeft.y - Math.sin(angleToRotateInRad) * sideC;
        return _super.prototype.translatePoint.call(this, { x: sideANew, y: sideBNew });
    };
    return RotateTransformer;
}(Transformer));
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'gids.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
var normalMap = document.getElementById("normalMap");
var rotatedMap = document.getElementById("rotatedMap");
loadJSON(function (response) {
    // Parse JSON string into object
    var actualJSON = JSON.parse(response);
    var kaart = new Kaart(actualJSON);
    window.console.debug(kaart);
    // Draw normal map
    var transformer = new Transformer();
    transformer.canvasSize = { width: normalMap.width, height: normalMap.height };
    kaart.drawOnCanvas(transformer, normalMap);
    // Draw rotated map
    var rotatedTransformer = new RotateTransformer(45);
    rotatedTransformer.canvasSize = { width: rotatedMap.width, height: rotatedMap.height };
    kaart.drawOnCanvas(rotatedTransformer, rotatedMap);
});
