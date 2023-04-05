var format_input;

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
format_input = params.get("input");
date = params.get("date");
function suggestFormat() {
	var postBatchNumbers = document.querySelectorAll("#post_batch_number");
	var postSerialNumbers = document.querySelectorAll("#post_serial_number");
	var suggestBatch;
	var suggestSerial;
	if(format_input != null){
		randomSerial = (new RandExp(format_serial).gen()).split(".");
		randomBath = (new RandExp(format_batch).gen()).split(".");
		format_input1 = format_input;
		suggestSerial = format_input1 +"."+ randomSerial[2] +"."+ randomSerial[3] +"."+ randomSerial[4];
		suggestBatch = new RandExp(format_batch).gen();
	}else{
		suggestBatch = new RandExp(format_batch).gen();
		suggestSerial = new RandExp(format_serial).gen();
	}

	[].forEach.call(postBatchNumbers, function(ele) {
		ele.parentElement.querySelector('.c_format').innerHTML = suggestBatch;
	});

	[].forEach.call(postSerialNumbers, function(ele) {
		ele.parentElement.querySelector('.c_format').innerHTML = suggestSerial;
	});
}


jQuery(document).ready(function($) {
    $("#createForm button[type='submit']").text("Lưu");
    $("#editForm button[type='submit']").text("Cập nhật");
    //event click all
    $('#AllShow').click(function(){
        $('input[type=checkbox]').each(function () {
            if(!this.checked){
                $(this).trigger('click');
            }
        });
    });
    var table = $('#example').DataTable({
		language: {
			searchPanes: {
				title: ''
			},
			"info": "Hiển thị _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
			"zeroRecords": "Không có bản ghi nào",
			"infoEmpty": "Không có bản ghi nào để hiển thị",
			"infoFiltered": "(được lọc từ tất cả _MAX_ bản ghi)",
			"lengthMenu": "Hiển thị _MENU_ bản ghi",
			"search": "Tìm kiếm:",
			"paginate": {
				"first": "Đầu tiên",
				"last": "Cuối cùng",
				"next": "Tiếp",
				"previous": "Trước"
			},
		},
		dom: "BfrltipP",
		ajax: url_getdata,
		"columns": [
			{ "data": 'id' },
			{ "data": 'batch_number' },
			{ "data": 'serial_number' },
			{ "data": "item.number", defaultContent: ''},
			{ "data": 'weight' },
			{ "data": 'quality' },
			{ "data": 'qcerror.name' , defaultContent: ''},
			{ "data": 'description' },
			{ "data": 'date'},
			{ "data": 'created_at' },
			{ "data": 'updated_at' },
		],
		select: true,
		"lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
		order: [
			[0, 'desc']
		],
		searchPanes: true,
		columnDefs: [
			{
                target: 9,
                visible: false,
                searchable: false,
            },
            {
                target: 10,
                visible: false,
            },

			{
				searchPanes: {
					show: false,
					initCollapsed: true
				},
				targets: [0, 1, 2, 4, 6, 7, 9, 10]
			},
			{
				searchPanes: {
					show: true
				},
				targets: [3, 5, 8]
			},
		],
		buttons: [{
		extend: 'colvis',
		text: 'Hiển thị cột'
		}, {
			text: 'Sửa dòng',
			action: function() {
				var count = table.rows({
					selected: true
				}).count();
				
				if (count > 0) {
					let row_data = table.rows({
						selected: true
					}).data()[0];
					$("#exampleModal #post_Id").val(row_data.id);
					$("#exampleModal #post_batch_number").val(row_data.batch_number);
					$("#exampleModal #post_serial_number").val(row_data.serial_number);
					$("#exampleModal #post_quality").val(row_data.quality);
					$("#exampleModal #post_weight").val(row_data.weight);
					$("#exampleModal #post_error_message").val(row_data.error_id);
					$("#exampleModal #post_description").val(row_data.description);
					// var $radios = $('#exampleModal input:radio[name=postQuality]');
					// $radios.filter('[value='+ row_data.quality + ']').prop('checked', true);
					// let ele_quality = $(form).find('input[name="postQuality"]');


					$("#exampleModal #"+row_data.quality).prop("checked", true);
					if (row_data.quality == "NG" || row_data.quality == "QT") {
						$("#exampleModal #detail").removeClass("d-none");
						$("#exampleModal #postErrorMessage").removeAttr("readonly");
						$("#exampleModal #postDescription").removeAttr("readonly");
					} else {
						$("#exampleModal #detail").addClass("d-none");
						$("#exampleModal #postErrorMessage").attr('readonly', '');
						$("#exampleModal #postDescription").attr('readonly', '');
					}
					if (row_data.serial_number.includes("xxxx")) {
						flagSerialExist = true;
						$("#exampleModal #detail").removeClass("d-none");
						$("#exampleModal #postErrorMessage").removeAttr("readonly");
						$("#exampleModal #postDescription").removeAttr("readonly");
					}

					$("#exampleModal").modal('show');
				} else {
					toast_message("<div class='text-danger'>Hãy chọn 1 dòng cần chỉnh sửa!</div>", "Cảnh báo");
				}
			}
		},
		{
			text: 'Dữ liệu theo',
			extend: 'collection',
			buttons: [
				{
					text: 'Ngày',
					extend: date == 'today'? 'selected':'',
					action: function() {
						console.log("Ngày");
						var queryString = window.location.search;
						var urlParams = new URLSearchParams(queryString);
						urlParams.set('date', 'today');
						document.location.search = urlParams;

					}
				},
				{
					text: 'Tháng',
					extend: date == 'month'? 'selected':'',
					action: function() {
						console.log("Tháng");
						var queryString = window.location.search;
						var urlParams = new URLSearchParams(queryString);
						urlParams.set('date', 'month');
						document.location.search = urlParams;
					}
				},
				{
					text: 'Năm',
					extend: date == 'year'? 'selected':'',
					action: function() {
						console.log("Năm");
						var queryString = window.location.search;
						var urlParams = new URLSearchParams(queryString);
						urlParams.set('date', 'year');
						document.location.search = urlParams;
					}
				}
			],
		}
	],
	});
    $('input[type="checkbox"]').click(function(){
        // Get the column API object
        var column = table.column($(this).attr('data-column'));
        // Toggle the visibility
        column.visible(!column.visible());
    });

	$('.needs-validation').removeClass("d-none");
	$('[data-index="1"]').focus();

	$('.needs-validation').on('keydown', 'input', function(event) {
		if (event.which == 13) {
			event.preventDefault();
			var $this = $(event.target);
			var form = $this.closest('form');
			var index = parseFloat($this.attr('data-index'));
			nextFocus(index + 1, form);
		}
	});

    var forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach(function(form) {
		form.addEventListener('submit', function(event) {
			//change submit button
			var submitBtn = form.querySelector('button[name="submit"]');
			var txt_submitBtn = submitBtn.textContent;
			submitBtn.setAttribute('disabled', '');
			submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
			submitBtn.type = "button";

			if (!form.checkValidity()) {
				$(form).find(":invalid").first().focus();
				submitBtn.innerHTML = txt_submitBtn;
				submitBtn.type = "submit";
				submitBtn.removeAttribute('disabled');
				event.preventDefault();
				event.stopPropagation();
				form.classList.add('was-validated');
			} else {
				let url_ajax;
				let type_ajax;
				let ele_scanId = $(form).find('input[name="postScanId"]');
				let ele_locId = $(form).find('input[name="locationId"]');
				let ele_batchNumber = $(form).find('input[name="postBatchNumber"]');
				let ele_serialNumber = $(form).find('input[name="postSerialNumber"]');
				let ele_quality = $(form).find('input[name="postQuality"]:checked');
				let ele_weight = $(form).find('input[name="postweight"]');
				let ele_error_id = $(form).find('select[name="postErrorMessage"]');
				let ele_description = $(form).find('textarea[name="postDescription"]');
				if (form.parentElement.className == "modal-body") {
					url_ajax = url_edit_qcscan + ele_scanId.val();
					type_ajax = "PUT";
				} else {
					url_ajax = url_create_qcscan;
					type_ajax = "POST";
				}
                let batchNumber;
				if (ele_batchNumber.length > 0) {
					batchNumber = ele_batchNumber.val();
				} else {
					//cat tu serialnumber
					var str_serial = ele_serialNumber.val();
					let arr_serial = str_serial.split(".");
					let arr_batch = format_batch.split("\\.");
					arr_batch[0] = arr_batch[0].substring(1, 4) + arr_serial[1];
					arr_batch[2] = arr_serial[2];
					arr_batch[3] = arr_serial[3];
					batchNumber = arr_batch.join(".");
				}
                let serialNumber = ele_serialNumber.val();
				let quality = ele_quality.val();
				let weight = ele_weight.val();
				let error_id;
				if (ele_error_id.hasAttr('readonly')) {
					error_id = null;
				} else {
					error_id = ele_error_id.val()[0];
				}
				let description;
				if (ele_description.hasAttr('readonly')) {
					description = null;
				} else {
					description = ele_description.val();
				}
				let data;
                if(checkUdisc(batchNumber,serialNumber)==true){
					data = {
					'batch_number': batchNumber,
					'serial_number': serialNumber,
					'quality': quality,
					'weight': weight,
					'error_id': error_id,
					'description': description,
					'user_id': user_id,
					'item_type_id': item_type_id,
					'location_id' : ele_locId.val()
					}
				}else{
					toast_message("<div class='text-danger'>Batch number and Serial number is not matching the format</div>", "Cảnh báo");
					event.preventDefault();
					event.stopPropagation();
					submitBtn.innerHTML = txt_submitBtn;
					submitBtn.type = "submit";
					submitBtn.removeAttribute('disabled');
					return;
				}


                console.log('data');
                console.log(data);
				$.ajaxSetup({
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					}
				});
				$.ajax({
					type: type_ajax,
					url: url_ajax,
					data: data,
					dataType: "json",
					success: function(response) {
						if ($('#exampleModal').is(':visible')) {
							$('#exampleModal').modal('hide');
							toast_message("<div class='text-success'>Cập nhật thành công</div>", "Thông báo");
						} else {
							toast_message("<div class='text-success'>Lưu thành công</div>", "Thông báo");
						}
						//clear all input
						ele_scanId.val("");
						// ele_locId.val("");
						ele_batchNumber.val("");
						ele_serialNumber.val("");
						// ele_quality.val("");
						$(form).find('input[name="postQuality"][value="OK"]').prop('checked', true);
						ele_weight.val("");
						ele_error_id.val("");
						ele_description.val("");
						$(form).find("#detail").addClass("d-none");
						$(form).find("data-index").first().focus();
						form.classList.remove('was-validated');
						$(form).find('[data-index]').first().focus();

						$(form).find("#serial-exists").remove();
						//reload table
						table.ajax.reload();

					},
					error: function() {
						toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện lưu dữ liệu</div>", "Cảnh báo");
						return false;
					},
					complete: function(data) {
						submitBtn.innerHTML = txt_submitBtn;
						submitBtn.type = "submit";
						submitBtn.removeAttribute('disabled');
					}
				});
				event.preventDefault();
				event.stopPropagation();
			}
		}, false)
	});


});

$.fn.hasAttr = function(name) {  
    return this.attr(name) !== undefined;
};

function checkUdisc(batch, serial){
    if(itemName == 'UDISC'){
		var str_batch = batch;
		let arr_batch = str_batch.split(".");
		var str_serial = serial;
		let arr_serial = str_serial.split(".");
		if(arr_batch[1] == arr_serial[1] && arr_batch[2] == arr_serial[2]){
			return true;
		}else{		
			return false;
		}
    }else{
		return true;
	}
}
function nextFocus(index, form){
	var input = $(form).find('[data-index="' + index.toString() + '"]');
	if (input.length > 0 && !input.hasAttr("readonly")) {
		input.focus();
	} else {
		nextFocus(index + 1, form);
	}
}

function checkFormat(input, type, token) {
	$(input).closest('.needs-validation').find("#serial-exists").remove();
		if (!input.value.includes(format_input)&& format_input != null) {
			input.setCustomValidity('"' + input.value + '" is not matching the format.');
            return;
		}
		else{
			if(type == 'batchnumber'){
				pattern = format_batch;
			}else if(type == 'serialnumber'){  
				pattern = format_serial;
			}
			var re = new RegExp(pattern);
			let result = re.test(input.value);
			if(result){
				//
				input.setCustomValidity('');
				//check exists
				if (type == 'serialnumber') {
					$.ajax({
						type: 'post',
						url: url_check_serial_number,
						data: {
							serialNumber: input.value,
							item_type_id: item_type_id,
							_token: token
						},
						success: function(data) {
							if (data.success == false) {
								$(input).after('<div id="serial-exists" class="text-danger" <strong>'+ data.message +'<strong></div>');
								input.closest('.needs-validation').querySelector("#post_description").value = data.message;
								flagSerialExist = true;
								input.closest('.needs-validation').querySelector("#detail").classList.remove("d-none");
								input.closest('.needs-validation').querySelector("#post_error_message").removeAttribute("readonly");
								input.closest('.needs-validation').querySelector("#post_description").removeAttribute("readonly");
							} else {
								$(input).after('<div id="serial-exists" class="text-success" <strong>'+ data.message +'<strong></div>');
								input.closest('.needs-validation').querySelector("#post_description").value = "";
								flagSerialExist = false;
								input.closest('.needs-validation').querySelector("#detail").classList.add("d-none");
								input.closest('.needs-validation').querySelector("#post_error_message").setAttribute("readonly", "");
								input.closest('.needs-validation').querySelector("#post_description").setAttribute("readonly", "");
								if (input.value.includes("xxxx")) {
									$(input).closest('.needs-validation').find("#serial-exists").remove();
									$(input).after('<div id="serial-exists" class="text-danger" <strong> Số serial không xác định. (Hỏng tem, mất tem,...)<strong></div>');
									input.closest('.needs-validation').querySelector("#post_description").value = "Số serial không xác định. (Hỏng tem, mất tem,...)";
									flagSerialExist = true;
									input.closest('.needs-validation').querySelector("#detail").classList.remove("d-none");
									input.closest('.needs-validation').querySelector("#post_error_message").removeAttribute("readonly");
									input.closest('.needs-validation').querySelector("#post_description").removeAttribute("readonly");
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện lưu dữ liệu</div>", "Cảnh báo");
							return false;
							console.log(XMLHttpRequest);
							console.log(textStatus);
							console.log(errorThrown);
						},
						complete: function(data) {
							console.log(data);
						}
					});
				}
			}else{
				input.setCustomValidity('"' + input.value + '" is not matching the format.');
			}
			
		}

    }

function checkQuality(input) {
    if (input.value == "NG" || input.value == "QT") {
		input.closest('.needs-validation').querySelector("#detail").classList.remove("d-none");
		$("#postErrorMessage").value = "";
		$("#postDescription").value = "";
		input.closest('.needs-validation').querySelector("#post_error_message").removeAttribute("readonly");
		input.closest('.needs-validation').querySelector("#post_description").removeAttribute("readonly");
	} else {
		input.closest('.needs-validation').querySelector("#detail").classList.add("d-none");
		$("#postErrorMessage").value = "";
		$("#postDescription").value = "";
		input.closest('.needs-validation').querySelector("#post_error_message").setAttribute("readonly", "");
		input.closest('.needs-validation').querySelector("#post_description").setAttribute("readonly", "");
	}

    if (input.value == "OK" || input.value == "NG"|| input.value == "QT") {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('"' + input.value + '" is not a feeling.');
    }

   
}

function toast_message(message, title) {
	var toaster = document.getElementById('warningToast');
	toaster.querySelector('.me-auto').innerHTML = title; // could be dynamic value title
	toaster.querySelector('.toast-body').innerHTML = message; // could be dynamic value message
	var visibleToast = new bootstrap.Toast(toaster, {
		'autohide': true,
		'delay': 5000
	});
	visibleToast.show();
}
