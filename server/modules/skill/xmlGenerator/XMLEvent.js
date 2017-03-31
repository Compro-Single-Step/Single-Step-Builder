module.exports = class XMLEvent {


    constructor  (args, compRef){
        this.compRef = compRef;
        this.id = args.props.id;
        this.desc = args.props.desc;
        if(args.props.followup){
            this.followup = args.props.followup;
        }

        // structur of one validation/ validate node inside an event
        /*this.validations = [
            {
                "props": {
                    "followUp": "",
                    "targetAttrSet": "",
                    "operator": ""
                }
                "compsToValidate": [
                    {
                        "id": "compId1",
                        "validationSet": "ValidationSetName"
                    }
                    {
                        "id": "compId2",
                        "validationSet": "ValidationSetName"
                    }
                ]
            }
        ];*/

        if(args.validate){
            this.generateValidations(args.validate);
        }
    }

    generateValidations (validations){
        this.validations = [];
        for(let i=0; i<validations.length; i++){

            let currValidation = {
                "props": { },
                "compsToValidate": []
            };

            let currValProps = Object.keys(validations[i]["props"]);
            for(let j=0; j<currValProps.length; j++){
                currValidation["props"][currValProps[j]] = validations[i]["props"][currValProps[j]];
            }
            
            let currValidationComps = validations[i]["comp"];
            for(let j=0; j<currValidationComps.length; j++){
                if(currValidationComps[j]["props"]["multiple-occurence"]=="true"){
                    let validationSet = this.getCompValidationSets(currValidationComps[j]["props"]);
                    for(let k=0; k<validationSet.length; k++){
                        let currValidationComp = {
                            "id": currValidationComps[j]["props"]["id"],
                            "validationSet": validationSet[k]
                        };
                        currValidation["compsToValidate"].push(currValidationComp);
                    }
                }else{
                    let currValidationComp = {
                        "id": currValidationComps[j]["props"]["id"],
                        "validationSet": currValidationComps[j]["props"]["validation-set"]
                    };
                    currValidation["compsToValidate"].push(currValidationComp);
                }
            }

            this.validations[i] = currValidation;
        }
    }

    getCompValidationSets (validationComp){
        let validationsSet = this.compRef.getCompValidationSets(validationComp["id"], validationComp["dependency-set"]);
        return validationsSet;
        /*switch(validationComp["based-on"]){

            "finalAttrSet" :


                break;

            default:
                break;

        }*/
    }

    generateXML (){
        let eventNode = '<event id="'+this.id+'" desc="'+this.desc+'" >';
        eventNode += this.generateValidateXMLNode();
        eventNode += '</event>';
        return eventNode;
    }

    generateValidateXMLNode (){

        let xmlString = "";

        for(let idx = 0; idx<this.validations.length; idx++){
            let currValidation = this.validations[idx];

            xmlString += '<validate';

            if(currValidation.props.followup){
                xmlString += ' followup="'+ currValidation.props.followup+'"';
            }

            if(currValidation.props.operator){
                xmlString += ' operator="'+currValidation.props.operator+'"';
            }

            if(currValidation.props["target-attribute-set"]){
                xmlString += ' target-attribute-set="'+currValidation.props["target-attribute-set"]+'"';
            }

            xmlString +=  ' >';
                
                

            xmlString += this.generateCompNodes(currValidation);
            xmlString += '</validate>';
        }

        return xmlString;
    }

    generateCompNodes (validationNode){
        let xmlString = "";

        for(let idx=0; idx<validationNode.compsToValidate.length; idx++){
            xmlString += '<comp id="'+ validationNode.compsToValidate[idx].id +'" validation-set="'+ validationNode.compsToValidate[idx].validationSet +'"/>'
        }

        return xmlString;
    }

}