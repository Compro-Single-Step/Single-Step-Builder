/**
 * Created with JetBrains WebStorm.
 * User: Tushar
 * Date: 2/6/17
 * Time: 3:24 PM
 */

const DOMParser = require('xmldom').DOMParser;
const Step = require('./Step');

module.exports = class StepXMLGenerator {

    generateXml (skillTemplate, attrValueMap){

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(skillTemplate,"text/xml");
        let stepJson = this.xmlToJson(xmlDoc);
        let step = new Step(stepJson[0], attrValueMap, this)
        let xmlString = step.generateXML();
        return xmlString;
        
    }

    // Changes XML to JSON
    xmlToJson  (xml) {

        // Create the return object
        let obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes && xml.attributes.length > 0) {
                obj["props"] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    let attribute = xml.attributes.item(j);
                    obj["props"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;

        }

        // do children
        if (xml.hasChildNodes()) {
            if(obj.props==undefined){
                obj = [];
                for(let i = 0; i < xml.childNodes.length; i++) {
                    let item = xml.childNodes[i];
                    if (item.nodeType == 3) { // text
                        continue;
                    }
                    obj.push(this.xmlToJson(item));
                }
            }else{
                let nodeName = xml.nodeName;

                for(let i = 0; i < xml.childNodes.length; i++) {
                    let item = xml.childNodes[i];
                    if (item.nodeType == 3) { // text
                        continue;
                    }
                    let child = this.xmlToJson(item);
                    if(child.props == undefined){
                        obj[xml.childNodes[i].nodeName] = child;
                    }else{
                        if(!obj[xml.childNodes[i].nodeName]){
                            obj[xml.childNodes[i].nodeName] = [];
                        }
                        obj[xml.childNodes[i].nodeName].push(child);
                    }
                }
            }
        }
        return obj;
   }

}
