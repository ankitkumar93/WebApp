var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: "AKIAICVAG4NUXCKA3OBA",
    secretAccessKey: "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",
	region: 'us-west-2'
});
const fs = require('fs');
var ec2 = new AWS.EC2();

var params = {
	ImageId: "ami-d732f0b7",
	InstanceType: "t2.micro",
	MinCount: 1,
	MaxCount: 1,
	SecurityGroupIds : ['sg-d7eb2aae'],		// Enter your security group id
	SecurityGroups : ['DevOps'],	// Enter your security group name
	KeyName : "devopsKeyPair"					// Enter your key pair name here
	//create-tags --resources i-xxxxxxxx --tags Key=Name,Value=MyInstance
}

var inventory = "inventory"


// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { 
  	console.log("Could not create instance", err); 
  	return; 
  }

  var instanceId = data.Instances[0].InstanceId;  
  var params1 = {
    InstanceIds: [instanceId]
  };
  ec2.waitFor('systemStatusOk', params1, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      ec2.describeInstances(params1, function(error, response){
        if(error){ console.log("Could not get Instance details ", error); return; }
        var instanceIP = response.Reservations[0].Instances[0].PublicIpAddress;
        console.log(instanceIP);
      });
    }
  });
});

//ansible-playbook -i inventory playbook.yml