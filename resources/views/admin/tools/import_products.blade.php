<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#importPackboxItemMapModal"> Import </button>
<style>
    #processingImport {
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #0000001a;
        display: none;
    }
    #processingImport .fa{
        color: #1b67ff;
    }
</style>
{{-- <div class="spinner-border text-primary spinner"></div> --}}
<div id="processingImport">
    <div class="overlay">
        <i class="fa fa-spinner fa-spin text-primary"></i>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="importPackboxItemMapModal" tabindex="-1" aria-labelledby="importPackboxItemMapModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="importPackboxItemMapModalLabel">Import Product Map</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="importForm">
          {{ csrf_field() }}
          <div class="form-group">
            <input type="file" name="fileupload" required="true" class="form-control-file" accept=".xlsx, .xlsm, .xls" id="importFile">
          </div>
          <div class="form-group">
            <label for="inputWorker">product</label>
            <select class="form-control form-control-lg" id="inputWorker">
                @foreach ($products as $product) <option value="{{ $product->id }}">{{ $product->name }}</option> @endforeach
            </select>
          </div>
          <div class="form-group">
            <label for="inputSheets">Choose Sheets</label>
            <link rel="stylesheet" href="{{ asset('css/choices.min.css') }}">
            <script src="{{ asset('js/choices.min.js') }}"></script>
            <script src="{{ asset('js/jquery.dataTables.min.js') }}"></script>
            <script src="{{ asset('js/dataTables.bootstrap4.min.js') }}"></script>
            <select id="inputSheets" placeholder="Select sheets" multiple>
              
            </select> 
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="importData">Import Data</button>
      </div>
    </div>
  </div>
</div>
<script src="{{ asset('js/tjszip.min.js') }}"></script>
<script>
  let sheetLabels = [];
  let query_task = null;
  'use strict'; // v2.3.2
  var result, zip = new JSZip(),
  	processStartTime, s, i, index, id;

  var getTab = function(base64file) {

  	zip = zip.load(base64file, {
  		base64: true
  	});
  	result = "";
    sheetLabels = [];
  	processStartTime = Date.now();

  	if (s = zip.file('xl/workbook.xml')) {
  		s = s.asText();

  		s = s.split('<sheet ');
  		i = s.length;
  		while (--i) {
  			id = s[i].substr(s[i].indexOf('name="') + 6);
        var sheetName = id.substring(0, id.indexOf('"'));
        var optionSheet = `<option value='${sheetName}'>${sheetName}</option>`;
        sheetLabels.push(sheetName);
        result += optionSheet;
      }
  	}
    query_task.removeActiveItems();
    reset();
  }

  var handleFileSelect = function(evt) {
  	var files = evt.target.files;
  	var file = files[0];

  	if (files && file) {
  		var reader = new FileReader();

  		reader.onload = function(readerEvt) {
  			var binaryString = readerEvt.target.result;
  			getTab(btoa(binaryString));
  		};

  		reader.readAsBinaryString(file);
  	}else{
      sheetLabels = [];
      query_task.removeActiveItems();
      reset();
    }
  };

  if (window.File && window.FileReader && window.FileList && window.Blob) {
  	document.getElementById('importFile').addEventListener('change', handleFileSelect, false);
  } else {
  	alert('The File APIs are not fully supported in this browser.');
  }

  $(document).ready(function(){
    query_task = new Choices('#inputSheets', {
      removeItemButton: true,
    //  maxItemCount:5,
      searchResultLimit:5,
    //  renderChoiceLimit:5
    }); 
  });
  function defaults() {
    return sheetLabels.map((lbl, i) => ({value: lbl, label: lbl}));
  }
  function reset() {
    query_task.clearChoices();
    query_task.setChoices(defaults(), 'value', 'label', false);
  }
</script>

<script>

    $('#importData').on('click', function () {

        var formData = new FormData();
        formData.append('sheets', $('#inputSheets').val());
        formData.append('_token', $('input[name="_token"]').val());
        formData.append('product_id', $('#inputWorker').val());
        // Attach file
        formData.append('file', $('input[type=file]')[0].files[0]); 
        // Your code.
        if($('#importFile').val() != ""){
            document.getElementById("processingImport").style.display = "block";
            $('#importPackboxItemMapModal').modal('hide');
            var url = window.location.href; 
            console.log(url);
            $.ajax({
                type: "POST",
                url: "import",
                data: formData,
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function(response, textStatus) {
                  console.log(response);
                    // if (response.success) {
                    //   toastr.success('Import data successfull.', 'Success!');
                    // } else {
                    //   toastr.warning('Import data failed.', 'Failed!');
                    // }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    toastr.error('The import failed.', 'Error!');
                    console.log(XMLHttpRequest);
                    console.log("2"+textStatus);
                    console.log("3"+errorThrown);
                },
                complete: function(data) {
                    document.getElementById("processingImport").style.display = "none";
                }
            });
        }else{
            toastr.warning('Please choose file for import data.', 'Warning!');
        }
    });

</script>