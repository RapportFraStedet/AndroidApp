function uploadCamera(){if(window.FormData){var b=$("#rapportForm")[0],b=new FormData(b);$(".current > span").hasClass("animate")&&$(".current > span").removeClass("animate");var a=new XMLHttpRequest;a.open("POST",Rfs.url+"/api/SaveFormsData.aspx",!0);a.onerror=function(){alert("error")};a.onload=function(){$(".current > span").width("100%");if(this.status==200)location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvittering";else{var a=JSON.parse(this.response);$("#errorMessage").html("<h3>"+a.Message+
"</h3><p>"+a.ExceptionMessage+"</p>");location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvitteringfejl"}};a.upload.onprogress=function(a){a.lengthComputable&&$(".current > span").width(a.loaded/a.total*100+"%")};a.send(b)}else b=$("#rapportForm")[0],b.action=Rfs.url+"/api/SaveFormsData.aspx",b.method="post",b.enctype="multipart/form-data",b.target="hiddenIFrame",b.submit(),$(".current > span").width("100%"),$(".current > span").hasClass("animate")||$(".current > span").addClass("animate"),location=
"#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvittering"}var stream=null;
function markupCamera(b){var a="<div data-role='fieldcontain'>";a+="<label for='"+b.Id+"' class='ui-input-text'>";b.Required==1&&(a+="<em>*</em>");a+=b.Name+"</label><div class='cameraButtons'>";html5File()&&(a+="<div data-role='button' data-inline='true'",b.Permission==1&&(a+=" class='ui-disabled'"),a+=">Fotoalbum<input data-role='none' class='fotoselect' type='file' name='B"+b.Id+"'/></div>");html5Camera()&&(a+="<a href='#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kamera/"+b.Id+"' data-role='button' data-inline='true' data-transition='slide'",
b.Permission==1&&(a+=" class='ui-disabled'"),a+=">Kamera</a>");a+="<input type='hidden' id='"+b.Id+"' name='"+b.Id+"' val=''";b.Required==1&&(a+=" class='required'");a+="/>";a+="<img id='A"+b.Id+"' width='100%' style='display: none;'/>";a+="</div></div>";return a}
$("#PhotoPage").on("pageshow",function(){var b=$(window).height(),a=$("#PhotoPage").children(":jqmData(role=content)"),c=b;a.outerHeight()!==b&&(c-=a.outerHeight()-a.height(),$("#Photo").css("height",c));b=$("#photoButton");a=$(window).width();c=b.outerWidth();b.css("left",(a-c)/2);window.URL=window.URL||window.webkitURL;navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;navigator.getUserMedia({video:!0},function(a){var b=
document.querySelector("video");b.src=window.URL.createObjectURL(a);stream=a;b.onloadedmetadata=function(){}},function(){$("#PhotoErrorMessage").html("<p>Fejl ved adgang til kameraet!</p>");$("#PhotoError").popup("open")})});
function snapshot(){if(stream){var b=document.querySelector("video"),a=document.querySelector("canvas");a.width=b.videoWidth;a.height=b.videoHeight;a.getContext("2d").drawImage(b,0,0);b=$("#"+imageId);b.length>0&&b.val("");$("#A"+imageId).attr("src",a.toDataURL("image/jpeg")).css("display","inline");$("#"+imageId).val(a.toDataURL("image/jpeg"));a=$("input[name='B"+imageId+"']");if(a.length>0)a.unbind("change"),a[0].outerHTML=a[0].outerHTML,$("input[name='B"+imageId+"']").bind("change",Rfs.inputChanged);
stream.stop()}backToFormular()};
