import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';

import { PreviewService } from '../../../_services/preview.service';
import { LoaderService } from '../../../_services/loader.service';
import { BuilderModelObj } from '../../shared/builder-model.service';
import { skillManager } from '../../shared/skill-manager.service';
import { initialTestConfig } from './test-config';


declare var Messenger: any;
declare const $;
declare const window;

@Component({
    selector: 'app-preview-modal',
    templateUrl: './preview-modal.component.html',
    styleUrls: ['./preview-modal.component.scss']
})
export class PreviewModalComponent implements OnInit {

    @ViewChild('previewModalDialog') public PreviewModalDialog: ModalDirective;

    taskInfo: Object;
    testMethods: Array<string>;
    finalTestConfig: Object;
    renderingConfig: Object;
    bindedValues: Object;
    launchScenario: string;
    previewWindow;
    builderModelSrvc;
    methodCheckboxes: Object;
    stepsArray: Array<string>;
    selectAll: Boolean;
    userIP: string;
    methodObject: Object;


    constructor(private previewService: PreviewService, private LoaderService: LoaderService) {
        this.taskInfo = {};
        this.testMethods = [];
        this.renderingConfig = {
            'environment': []
        };
        this.bindedValues = {};
        this.finalTestConfig = { 'script': {}, 'run': {} };
        this.builderModelSrvc = BuilderModelObj;
        this.methodCheckboxes = {};
        this.stepsArray = [];
        this.selectAll = false;
    }

    getIP() {
        $.getJSON('https://jsonip.com?callback=?', function (data) {
            alert('Your IP address is :- ' + data.ip);
        });
    }

    ngOnInit() {
    }

    setTaskData(taskID, stepIndex, templateID, stepText) {
        this.taskInfo['taskID'] = taskID;
        this.taskInfo['stepIndex'] = stepIndex;
        this.taskInfo['devTemplateID'] = templateID;
        this.taskInfo['stepText'] = stepText;
        this.getUserIP((ip) => {
            this.userIP = ip;
            //this.finalTestConfig['run']['user']['ip']= ip;
        });

        //If check to stop server calls on every click of preview button
        if (!this.taskInfo['testTemplateID']) {
            //Fetch test template ID
            this.previewService.getTestTemplateID(this.taskInfo['devTemplateID'])
                .subscribe((testTemplateID) => {
                    this.taskInfo['testTemplateID'] = testTemplateID[0].test_template_id;

                    //Fetch All Test Methods
                    this.previewService.getTestMethods(this.taskInfo['testTemplateID'])
                        .subscribe(methodsObj => {

                            this.methodObject = methodsObj['pathways'];
                            this.renderingConfig['pathways'] = [];
                            const steps = methodsObj['pathways'][0];
                            this.stepsArray = [];
                            for (const stepIndex in steps) {
                                if (steps.hasOwnProperty(stepIndex)) {
                                    if (typeof steps[stepIndex] === 'object') {
                                        this.stepsArray.push('Step ' + stepIndex);
                                    } else {
                                        this.stepsArray.unshift('checkbox');
                                    }
                                }
                            }

                            const pathways = methodsObj['pathways'];
                            pathways.forEach((element, index) => {
                                const pathway = [];
                                for (const step in element) {
                                    if (element.hasOwnProperty(step)) {
                                        if (typeof steps[step] === 'object') {
                                            //element[step].index = parseInt(element[step].index) + 1;
                                            pathway.push(element[step]);
                                        } else {
                                            pathway.unshift('checkbox');
                                        }
                                    }
                                }
                                this.methodCheckboxes[index + 1] = false;
                                this.renderingConfig['pathways'].push(pathway);
                            });

                            this.updateOSList();
                        });
                });

            //Rendering step and methods
            this.renderingConfig['environment'] = initialTestConfig['options']['environment'];


            // for (const key in steps) {
            //     if (steps.hasOwnProperty(key)) {
            //         this.renderingConfig['steps'].push(steps[key]);
            //         const step = this.renderingConfig['steps'][key];
            //         this.methodCheckboxes[key] = {};
            //         this.renderingConfig['steps'][parseInt(key) - 1]['methods'].forEach((element) => {
            //             element.index = parseInt(element.index) + 1;
            //             this.methodCheckboxes[key][element.index] = false;
            //         });
            //     }
            // }
            //TO BE REMOVED
            //this.taskInfo['testTemplateID'] = 'dummy';

            //Fill Default values
            this.bindedValues = {
                'launchScenario': 'preview',
                'environment': initialTestConfig['defaults']['environment'],
                'browser': initialTestConfig['defaults']['browser'],
                'os': initialTestConfig['defaults']['os'],
                'screenresolution': '1200X900',
                'brversion': 1,
            };
        }
        this.PreviewModalDialog.show();
    }

    runPreview() {
        if (this.bindedValues['launchScenario'] === 'preview') {
            //Launch Preview Simulation
            this._previewTask((data) => {
                if (data['Url']) {
                    this.previewWindow = this.previewService.previewSimulation(data['Url']);
                    this.LoaderService.setLoaderVisibility(false);
                }
            });
        }
        else if (this.bindedValues['launchScenario'] === 'test') {
            //Configure the payload JSON to be send to the server for Automation Testing
            this._configurePayload();

            //Launch Automation Test
            this._previewTask((data) => {
                if (data['Url']) {
                    this.LoaderService.setLoaderVisibility(false);
                    this.finalTestConfig['run']['config']['app']['url'] = data['Url'];
                    this.previewService.startAutomationTest(this.finalTestConfig)
                    // .subscribe(response=>{

                    // },
                    // error=>{
                    //     this.displayErrorMessage('Error occurred in Automation Test, please check your test config.');
                    // });
                }
            });
        }
        else { }

        this.PreviewModalDialog.hide();
    }

    updateOSList() {
        this.renderingConfig['os'] = initialTestConfig['options']['os'][this.bindedValues['environment']];
        this.updateBrowserList();
    }

    updateBrowserList() {
        this.renderingConfig['browser'] = initialTestConfig['options']['browser'][this.bindedValues['os']];
    }

    updateMethodsCheckbox({ event }) {
        let isChecked = event.target.checked;

        for (let pathway in this.methodCheckboxes) {
            if (this.methodCheckboxes.hasOwnProperty(pathway)) {
                this.methodCheckboxes[pathway] = isChecked;
            }
        }
    }

    updateSelectAllsCheckbox({ event }) {
        if (!event.target.checked) {
            this.selectAll = false;
        }
    }

    displayErrorMessage(errorText) {
        Messenger.options = {
            extraClasses: 'messenger-fixed messenger-on-top',
            theme: 'block'
        }
        Messenger().post({
            message: errorText,
            type: 'error',
            showCloseButton: true,
            hideAfter: 5
        });
    }

    getTypeOf(value) {
        return typeof value;
    }

    private _previewTask(callback) {
        this.previewService.previewTask(this.taskInfo['taskID'], this.taskInfo['stepIndex'], this.taskInfo['devTemplateID'], this.taskInfo['stepText'])
            .subscribe(response => {
                let data = response.json();
                callback(data);
            },
            (error) => {
                this.LoaderService.setLoaderVisibility(false);
                error = error.json();
                this.displayErrorMessage('Error occurred in Step preview, please check your inputs.');
            });
    }

    private _configurePayload() {
        //Calculate Task Scenario
        this.finalTestConfig['script'] = this._configureTaskScenario(this.taskInfo);

        //Calculate params
        let stepUIState = this.builderModelSrvc.getState();
        let testParams = stepUIState['testParams'];
        this.finalTestConfig['script']['params'] = this.builderModelSrvc.evaluateParams(stepUIState, testParams, skillManager.skillTranslator);

        //Calculate methods config
        this.finalTestConfig['script']['pathways'] = this._configureMethodsConfig(this.methodCheckboxes)

        //calculate run params
        this.finalTestConfig['run']['config'] = this._configureRunParams(this.bindedValues);
        console.log(this.finalTestConfig);
    }

    private _configureTaskScenario(taskInfo) {
        return {
            test_template_id: taskInfo['testTemplateID'],
            step_number: taskInfo['stepIndex'],
            task_id: taskInfo['taskID']
        }
    }

    private _configureMethodsConfig(methodCheckboxConfig) {
        let pathwayArray = [];

        let tempObj = {}
        for (let stepNumber in methodCheckboxConfig) {
            if (methodCheckboxConfig[stepNumber]) {
                pathwayArray.push(this.methodObject[parseInt(stepNumber) - 1]);
                // let pathway = this.renderingConfig['pathways'][parseInt(stepNumber) - 1];
                // let methods = '';
                // for (let i = 1; i < pathway.length; i++) {
                //     methods += pathway[i].index;
                // }
                // pathwayArray.push(methods);
            }
            // tempObj[stepNumber] = [];
            // for (let methodNumber in methodCheckboxConfig[stepNumber]) {
            //     if (methodCheckboxConfig[stepNumber][methodNumber])
            //         tempObj[stepNumber].push(methodNumber);
            // }
        };
        return pathwayArray;
    }

    private _configureRunParams(runParamConfig) {

        return {
            'env': runParamConfig['environment'],
            'os': runParamConfig['os'],
            'resolution': runParamConfig['screenresolution'],
            'app': {
                'url': '',
                'public': 'false',
                'build': ''
            },
            'browser': {
                'node': runParamConfig['client'],
                'name': runParamConfig['browser'],
                'version': runParamConfig['brversion'],
            },
            'user': {
                'ip': this.userIP,
                'userdata': {}
            }
        }
    }

    getUserIP(callback) {
        var ip_dups = {};

        //compatibility for firefox and chrome
        var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var useWebKit = !!window.webkitRTCPeerConnection;


        //minimal requirements for data connection
        var mediaConstraints = {
            optional: [{ RtpDataChannels: true }]
        };

        var servers = { iceServers: [{ urls: 'stun:stun.services.mozilla.com' }] };

        //construct a new RTCPeerConnection
        var pc = new RTCPeerConnection(servers, mediaConstraints);

        function handleCandidate(candidate) {
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            var ip_addr = ip_regex.exec(candidate)[1];

            //remove duplicates
            if (ip_dups[ip_addr] === undefined) {
                callback(ip_addr);
            }

            ip_dups[ip_addr] = true;
        }

        //listen for candidate events
        pc.onicecandidate = function (ice) {
            //skip non-candidate events
            if (ice.candidate) {
                handleCandidate(ice.candidate.candidate);
            }
        };

        //create a bogus data channel
        pc.createDataChannel('');

        //create an offer sdp
        pc.createOffer(function (result) {
            //trigger the stun server request
            pc.setLocalDescription(result, function () { }, function () { });

        }, function () { });
    }
}
