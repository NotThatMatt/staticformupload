function getUrl(fileName, callback) {
  var request = new XMLHttpRequest();
  var params = "filename=" + fileName;

  request.open("POST", "https://tw3tm6kx97.execute-api.us-east-1.amazonaws.com/test1?" + params);
  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("Authorization", "true");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");

  request.send();

  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      callback(data);
    } else {
      console.log("error");
    }
  };
}

function setUploadForm(data) {
  document.getElementById("key").value = data.fields.key;
  document.getElementById("AWSAccessKeyId").value = data.fields.AWSAccessKeyId;
  document.getElementById("x-amz-security-token").value = data.fields["x-amz-security-token"];
  document.getElementById("policy").value = data.fields.policy;
  document.getElementById("signature").value = data.fields.signature;
}

function getFileName(fileName) {
  var name = fileName.files.item(0).name
  document.getElementById('custom-file-label').innerHTML = name;
  getUrl(name, setUploadForm)
}

function submitForm(callback) {
  document.getElementById("uploadForm").submit()
  filename = document.getElementById('custom-file-label').innerHTML
  callback(filename)
  document.getElementById("uploadForm").reset()
  document.getElementById('custom-file-label').innerHTML=""
  
}


function submitJob(filename){
  console.log("submitJob reached")
  var jobForm = document.getElementById("jobParams")
  
  var json = {
    "file": filename,
    "source": jobForm.source.value,
    "spanishtarget": jobForm.spanishOptions.value,
    "frenchtarget": jobForm.frenchOptions.value,
    "germantarget": jobForm.germanOptions.value
};

  var request = new XMLHttpRequest();
  request.open("POST", "https://tw3tm6kx97.execute-api.us-east-1.amazonaws.com/job");
  
  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("Authorization", "true");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");
  request.setRequestHeader('Content-Type', 'application/json');
  
  request.send(JSON.stringify(json));
  
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      console.log(data);
    } else {
      console.log("error");
    }
  };
  jobForm.reset()
}


function testChecked(){
  // var found_it

  // for (var i=0; i<document.jobParams.spanishOptions.length; i++)  {
  // if (document.jobParams.spanishOptions[i].checked)  {
  
  // found_it = document.jobParams.spanishOptions[i].value

  // alert(found_it)
  
  // }
  // }

  var targets = document.getElementsByClassName('form-check-input')
  var filename = document.getElementById('custom-file-label').innerHTML
  console.log(filename)
  var request = {
    "input": 
    {
        "inputMediaBucket": "subtitle-and-translate-media",
        "inputMediaKey": "input-media/"+filename,
        "mediaFile": filename,
        "mediaFormat": "mp4",
        "sourceLang": "us-en"
    },
    "targets":
            [
      ]
}

    for (var i=0; i<targets.length; i++)  {
      if (targets[i].checked){
        lang=targets[i].value.split('|')
        
        target = {
          "translate": {
              "translate": "y",
              "targetLangShort": lang[0],
             "targetLangFull": lang[1],
          },
          "subtitle": {
              "createSubtitle": "y",
              "subtitleType": "srt"
          },
          "polly:": {
              "createAudio": "y",
              "voiceId": lang[2],
          }
      }
      request.targets.push(target)
      console.log(request)
    }
    }


}
