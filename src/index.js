const core = require('@actions/core');
const awsHelper = require('./aws-helpers');
const path = require('path');
const run = async () => {
  try {
    const path_to_json = core.getInput('path_to_json');
    const aws_secret_name = core.getInput('aws_secret_name');
    const accessKeyId = core.getInput('AWS_EKS_ACCESS_KEY'),
      secretAccessKey = core.getInput('AWS_EKS_SECRET_KEY');

    if (!path_to_json || !aws_secret_name || !accessKeyId || !secretAccessKey) {
      core.warning(`${path_to_json + aws_secret_name + accessKeyId + secretFromAWS}`);
      return core.setFailed('No environments or parameters were received. Please check the documentation.');
    }

    let envConfigsFile = null;
    try {
      envConfigsFile = require(path.join(process.env.GITHUB_WORKSPACE, path_to_json));
    } catch (error) {
      return core.setFailed(
        `There were problems trying to read the file ${path_to_json} in ${__dirname}: ${error.message}`
      );
    }
    const environmentsByUser = Object.keys(envConfigsFile);

    const secretFromAWS = await awsHelper.getSecretsCredentialsFrom(aws_secret_name, {
      accessKeyId,
      secretAccessKey,
    });

    const environmentsOnAWS = Object.keys(secretFromAWS);
    const missingEnvs = environmentsByUser.filter((env) => environmentsOnAWS.includes(env));

    if (missingEnvs.length) {
      core.setFailed(`Missing environment vars on AWS. Missing Result ${missingEnvs.join(', ')}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

if (process.env.NODE_ENV !== 'test') {
  run();
}

module.exports.run = run;
