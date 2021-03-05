// set variables
const apiUrl = "https://5u9ddnz7v5.execute-api.us-east-1.amazonaws.com" //update api url 
const baseBucket = "subtitle-and-translate-media" //update base bucket name


// function to get the filename of the file to upload then call
// getUrl() to get the presigned put url to upload the file

function getFileName(fileName) {
  var name = fileName.files.item(0).name
  document.getElementById('custom-file-label').innerHTML = name;
  getUrl(name, setUploadForm)
}

// function to call the get upload api to get the 
// presigned put url to upload the file then call
// setUploadForm() to populate the uploadForm

function getUrl(fileName, callback) {
  var request = new XMLHttpRequest();
  var params = "filename=" + fileName;

  request.open("GET", apiUrl + "/upload?" + params);
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

// function to set the values in the hidden form uploadForm
// used to upload the file using a presigned put url 

function setUploadForm(data) {
  document.getElementById("key").value = data.fields.key;
  document.getElementById("AWSAccessKeyId").value = data.fields.AWSAccessKeyId;
  document.getElementById("x-amz-security-token").value = data.fields["x-amz-security-token"];
  document.getElementById("policy").value = data.fields.policy;
  document.getElementById("signature").value = data.fields.signature;
  document.getElementById("uploadForm").action = data.url
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
        "inputMediaBucket": baseBucket,
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
  request.open("POST", apiUrl + "/job");
    
  
  request.setRequestHeader("Accept", "*/*");  
  request.setRequestHeader("Access-Control-Allow-Origin", "*");
  request.setRequestHeader("Authorization", "");
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


function getJobList(){

document.getElementById("jobList").innerHTML = "Loading...";  

var request = new XMLHttpRequest();
request.open("GET", apiUrl + "/job");
  

request.setRequestHeader("Accept", "*/*");  
request.setRequestHeader("Access-Control-Allow-Origin", "*");
request.setRequestHeader("Authorization", "");
request.setRequestHeader('Content-Type', 'application/json');

request.send();

request.onload = function () {
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    var html = `<table class="table">
    <thead>
      <tr>
        <th scope="col">Job ID</th>
        <th scope="col">Job Status</th>
        <th scope="col">Filename</th>
        <th scope="col">Launch Video</th>
      </tr>
    </thead>
    <tbody>`
    
      for(var i in data.data){
        html+=`<tr>
        <th scope="row">`+ data.data[i].jobId + `</th>
        <td>`+ data.data[i].jobStatus + `</td>
        <td>`+ data.data[i].fileName + `</td>
        <td><a href="javascript:launchVideo('`+ data.data[i].playbackUrl + `');">Launch Video</a></td>
      </tr>`
      }
      html+= `</tbody>
      </table>`
      document.getElementById("jobList").innerHTML = html;

      console.log(data)

  } else {
    console.log("error");
  }
};

};

function launchVideo(url){
  
  window.open(
    '/player.html?url='+url,
    '_blank' 
  );

};

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
