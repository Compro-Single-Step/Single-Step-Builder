const mongoose = require("mongoose");

const skillConfigRepoSchema = new mongoose.Schema({
    template_id: "string",
    ui_config_path: "string",
    io_map_path: "string",
    skill_xml_path: "string",
    data_model_path: "string"
}, {
    collection: 'skill_config_repo'
});

const skillConfigTypes = {
    "UI_CONFIG": "ui_config_path",
    "IO_MAP": "io_map_path",
    "XML": "skill_xml_path",
    "MODEL": "data_model_path"
};

skillConfigRepoSchema.statics = {
    getSkillConfigPath: function (templateId, configType, callback) {

        let projection = { "_id": false };
        projection[configType] = true;

        this.find({ "template_id": templateId }, projection, (error, data) => {
            callback(data[0][configType], error);
        });
    }
};

let skillConfigRepo = mongoose.model('skill_config_repo', skillConfigRepoSchema);

module.exports = {
    skillConfigRepo: skillConfigRepo,
    skillConfigTypes: skillConfigTypes
};