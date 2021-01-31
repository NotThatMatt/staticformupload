function getUrl(fileName, callback) {
  var request = new XMLHttpRequest();
  var params = "filename=" + fileName;

  request.open("GET", "https://5u9ddnz7v5.execute-api.us-east-1.amazonaws.com/upload?" + params);
  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("authorization", "superSecret");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");

  request.send();

  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      callback(data);
      console.log(data)
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
  callback()
  document.getElementById("uploadForm").reset()
  document.getElementById('custom-file-label').innerHTML="Choose file"
  
}

function submitJob(filename){
  var targets = document.getElementsByClassName('form-check-input')
  var filename = document.getElementById('custom-file-label').innerHTML
  var jobForm=document.getElementById("jobParams")

  var json = {
    "Inputs": 
    {
        "inputMediaBucket": "subtitle-and-translate-media",
        "inputMediaKey": "input-media/"+filename,
        "mediaFile": filename,
        "mediaFormat": "mp4",
        "sourceLanguageShort": "en",
        "sourceLanguageFull": "en-US"
    },
    "Targets":
            [
      ]
}

    var sourceSubtitle = {
      "translate": {
        "translate": "n",
        "targetLanguageShort": "en",
        "targetLanguageFull": "en-US"
      },
      "subtitle": {
        "createSubtitle": "y",
        "subtitleType": "srt"
      },
      "polly:": {
        "createAudio": "n"
      }
    }
    
    json.Targets.push(sourceSubtitle)

    for (var i=0; i<targets.length; i++)  {
      if (targets[i].checked){
        lang=targets[i].value.split('|')
        
        target = {
          "translate": {
              "translate": "y",
              "targetLanguageShort": lang[0],
             "targetLanguageFull": lang[1],
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
      json.Targets.push(target)
    }
    }

  var request = new XMLHttpRequest();
  request.open("POST", "https://5u9ddnz7v5.execute-api.us-east-1.amazonaws.com/job");
  
  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("authorization", "superSecret");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");
  request.setRequestHeader('Content-Type', 'application/json');
  
  request.send(JSON.stringify(json));
  
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      console.log("api called")
      console.log(data);
    } else {
      console.log("error");
    }
  };
  jobForm.reset()
}

