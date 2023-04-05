var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var date = urlParams.get('date');
var filterS = urlParams.get('filter');
var token = $('meta[name="csrf-token"]').attr('content');
function updateSuggest() {
	var postBatchNumbers = document.querySelectorAll("#postBatchNumber");
	var postSerialNumbers = document.querySelectorAll("#postSerialNumber");

	[].forEach.call(postBatchNumbers, function(ele) {
		ele.parentElement.querySelector('.c_format').innerHTML = new RandExp(format_batch).gen();
	});

	[].forEach.call(postSerialNumbers, function(ele) {
		ele.parentElement.querySelector('.c_format').innerHTML = new RandExp(format_serial).gen();
	});
}

$.fn.dataTable.ext.buttons.editRow = {
    text: 'Chỉnh sửa dòng',
    action: function(e, table, node, config) {
		var count = table.rows({
			selected: true
		}).count();
		if (count > 0) {
			let row_data = table.rows({
				selected: true
			}).data()[0];
			// cập nhật input edit form
			$("#editModal #postScanId").val(row_data.id);
			$("#editModal #postBatchNumber").val(row_data.batch_number);
			$("#editModal #postSerialNumber").val(row_data.serial_number);
			$("#editModal #postweight").val(row_data.weight);
			var $radios = $('#editModal input:radio[name=postQuality]');
			$radios.filter('[value='+ row_data.quality + ']').prop('checked', true);
			$("#editModal #postErrorMessage").val(row_data.error_id);
			$("#editModal #postDescription").val(row_data.description);
			if (row_data.quality == "NG" || row_data.quality == "QT") {
				$("#editModal #detail").removeClass("do-none");
				$("#editModal #detail").addClass("do-block");
				$("#editModal #postErrorMessage").removeAttr("readonly");
				$("#editModal #postDescription").removeAttr("readonly");
			} else {
				$("#editModal #detail").removeClass("do-block");
				$("#editModal #detail").addClass("do-none");
				$("#editModal #postErrorMessage").attr('readonly', '');
				$("#editModal #postDescription").attr('readonly', '');
			}
			if (row_data.serial_number !=null && row_data.serial_number.includes("xxxx")) {
				flagSerialExist = true;
				$("#editModal #detail").removeClass("do-none");
				$("#editModal #detail").addClass("do-block");
				$("#editModal #postErrorMessage").removeAttr("readonly");
				$("#editModal #postDescription").removeAttr("readonly");
			}
			$("#editModal").modal('show');
		} else {
			toast_message("<div class='text-danger'>Hãy chọn 1 dòng cần chỉnh sửa!</div>", "Cảnh báo");
		}
	}
};

jQuery(document).ready(function($) {
	$("#createForm button[type='submit']").text("Lưu");
	$("#editForm button[type='submit']").text("Cập nhật");
	
	var table = $('#qcscantable').DataTable({
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
		searchPanes: {
			layout: 'columns-6',
			show: true,
			// initCollapsed: true,
			dtOpts: {
				paging: true,
				pagingType: 'numbers',
				searching: false
			}
		},
		dom: "BfrtlipP",
		processing: true,
		ajax: url_get_qcscan,
		"columns": [{
				"data": "id"
			},
			{
				"data": "batch_number"
			},
			{
				"data": "serial_number"
			},
			{
				"data": "qcitem", defaultContent: '',
				"render": function (data, type, row) {
					if (data == null) {
						return;
					}
					dataArr = data.item.number.split('.');
                    var colorStr = dataArr.pop();
						switch (colorStr) {
							case 'R':
								return "<span style='color:red'>" + colorStr + "</span>";
							case 'G':
								return "<span style='color:green'>" + colorStr + "</span>";
							case 'B':
								return "<span style='color:blue'>" + colorStr + "</span>";
							case 'Y':
								return "<span style='color:yellow'>" + colorStr + "</span>";
							
							case 'P':
								return "<span style='color:purple'>" + colorStr + "</span>";
							case 'W':
							default:
								return colorStr;
						}
                }
			},
			{
				"data": "quality",
				"render": function (data, type, row) {
                    switch (data) {
						case 'NG':
							return "<span style='color:red'>" + data + "</span>";
						case 'OK':
							return "<span style='color:green'>" + data + "</span>";
						default:
							return data;
					}
                }
			},
			{
				"data": "weight"
			},
			{
				"data": "qcerror.name",
				defaultContent: ''
			},
			{
				"data": "description"
			},
			{
				"data": "date"
			},
			{
				"data": "created_at"
			},
			{
				"data": "updated_at"
			},
			{
				"data": "user.name", defaultContent: '',
			}
		],
		columnDefs: [{
				target: 1,
				visible: b_batch,
			},
			{
				target: 2,
				visible: b_serial,
			},
			{
				target: 8,
				visible: false,
			},
			{
				target: 10,
				visible: false,
			},
			{
				target: 11,
				visible: false,
			},
			{
				searchPanes: {
					show: false,
					initCollapsed: true
				},
				targets: [0, 2, 5, 6, 7, 9, 10, 11]
			},
			{
				searchPanes: {
					show: true
				},
				targets: [1, 3, 4, 8]
			},

		],
		select: true,
		order: [
			[0, 'desc']
		],
		lengthChange: true,
		// lengthMenu: [10, 20, 50, 100, 200, 500],
		lengthMenu: [ [10, 25, 50, 100, 200, 500, -1], [10, 25, 50, 100, 200, 500, "All"] ],
		// buttons: [ 'copy', 'excel', 'pdf', {extend: 'colvis', text: 'Show'} ],
		buttons:
		[
			{
				extend: 'colvis',
				text: 'Hiển thị cột'
			},
			'editRow',
			'excel',
			{
				text: 'Dữ liệu theo',
				extend: 'collection',
				buttons: [
					{
						text: 'Ngày',
						extend: date == 'today'? 'selected':'',
						action: function() {
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
							var queryString = window.location.search;
							var urlParams = new URLSearchParams(queryString);
							urlParams.set('date', 'year');
							document.location.search = urlParams;
						}
					}
				],
			}

		],
		initComplete: function() {
			table.buttons().container()
				.appendTo($('.col-md-6:eq(0)', table.table().container()));
		}
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

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation');

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function(form) {
		form.addEventListener('submit', function(event) {
			//change submit button
			var submitBtn = form.querySelector('button[name="submit"]');
			var txt_submitBtn = submitBtn.textContent;
			submitBtn.setAttribute('disabled', '');
			submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
			submitBtn.type = "button";
			let ele_serialNumber = $(form).find('input[name="postSerialNumber"]');
			let ele_batchNumber = $(form).find('input[name="postBatchNumber"]');
			
			if (ele_batchNumber.length > 0) {
				checkFormat(ele_batchNumber[0], 'batchnumber', token);
			}
			if (ele_serialNumber.length > 0) {
				checkFormat(ele_serialNumber[0], 'serialnumber', token);
			}

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
					batchNumber = null;
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
						'location_id': location_id
					}
				}else{
					toast_message("<div class='text-danger'>Số lô và số serial không khớp.</div>", "Cảnh báo");
					if (ele_batchNumber.length > 0) {
						ele_batchNumber[ 0 ].setCustomValidity('"' + ele_batchNumber.val() + '" is not matching the format.');
					}
					if (ele_serialNumber.length > 0) {
						ele_serialNumber[ 0 ].setCustomValidity('"' + ele_serialNumber.val() + '" is not matching the format.');
					}
					event.preventDefault();
					event.stopPropagation();
					submitBtn.innerHTML = txt_submitBtn;
					submitBtn.type = "submit";
					submitBtn.removeAttribute('disabled');
					return;
				}

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
						if ($('#editModal').is(':visible')) {
							$('#editModal').modal('hide');
							toast_message("<div class='text-success'>Cập nhật thành công</div>", "Thông báo");
						} else {
							toast_message("<div class='text-success'>Lưu thành công</div>", "Thông báo");
						}
						//clear all input
						ele_scanId.val("");
						ele_batchNumber.val("");
						ele_serialNumber.val("");
						$(form).find('input[name="postQuality"][value="OK"]').prop('checked', true);
						ele_weight.val("");
						ele_error_id.val("");
						ele_description.val("");
						$(form).find("#postErrorMessage").attr('readonly', true)
						$(form).find("#postDescription").attr('readonly', true);
						$(form).find("#detail").addClass("do-none");
						$(form).find("#detail").removeClass("do-block");
						$(form).find("data-index").first().focus();
						form.classList.remove('was-validated');
						$(form).find('[data-index]').first().focus();
						flagSerialExist = false;
						$(form).find("#serial-exists").remove();
						

						//reload table
						table.ajax.reload();

					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện lưu dữ liệu</div>", "Cảnh báo");
						return false;
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
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

function nextFocus(index, form) {
	var input = $(form).find('[data-index="' + index.toString() + '"]');
	if (input.length > 0 && !input.hasAttr("readonly")) {
		input.focus();
	} else {
		nextFocus(index + 1, form);
	}
}

var currentValue = 0;
function handleClickQuality(input) {
	if (flagSerialExist || input.value == "NG" || input.value == "QT") {
		input.closest('.needs-validation').querySelector("#detail").classList.remove("do-none");
		input.closest('.needs-validation').querySelector("#detail").classList.add("do-block");
		input.closest('.needs-validation').querySelector("#postErrorMessage").removeAttribute("readonly");
		input.closest('.needs-validation').querySelector("#postDescription").removeAttribute("readonly");
	} else {
		input.closest('.needs-validation').querySelector("#detail").classList.remove("do-block");
		input.closest('.needs-validation').querySelector("#detail").classList.add("do-none");
		input.closest('.needs-validation').querySelector("#postErrorMessage").setAttribute("readonly", "");
		input.closest('.needs-validation').querySelector("#postDescription").setAttribute("readonly", "");
	}
}

function checkFormat(input, type, token) {
	strValue = input.value
	if (filterS != null && !input.value.includes(filterS)) {
		input.setCustomValidity('"' + input.value + '" is not matching the format.');
		return;
	}
	$(input).closest('.needs-validation').find("#serial-exists").remove();
	let pattern;
	if (type == 'batchnumber') {
		pattern = format_batch;
	} else if (type == 'serialnumber') {
		pattern = format_serial;
	}
	
	var re = new RegExp(pattern);
	let result = re.test(input.value);
	if (result) {
		input.setCustomValidity('');
		//check exists
		if (type == 'serialnumber' && input.value != null && input.value != '') {
			$.ajax({
				type: 'post',
				url: url_check_serial_number,
				data: {
					serialNumber: input.value,
					item_type_id: item_type_id,
					_token: token
				},
				success: function(data) {
					if (re.test(input.value)) {
						if (data.success == false) {
							$(input).after('<div id="serial-exists" class="text-danger" <strong>'+ data.message +'<strong></div>');
							input.closest('.needs-validation').querySelector("#postDescription").value = data.message;
							flagSerialExist = true;
							input.closest('.needs-validation').querySelector("#detail").classList.remove("do-none");
							input.closest('.needs-validation').querySelector("#detail").classList.add("do-block");
							input.closest('.needs-validation').querySelector("#postErrorMessage").removeAttribute("readonly");
							input.closest('.needs-validation').querySelector("#postDescription").removeAttribute("readonly");
						} else {
							$(input).after('<div id="serial-exists" class="text-success" <strong>'+ data.message +'<strong></div>');
							input.closest('.needs-validation').querySelector("#postDescription").value = "";
							flagSerialExist = false;
							input.closest('.needs-validation').querySelector("#detail").classList.remove("do-block");
							input.closest('.needs-validation').querySelector("#detail").classList.add("do-none");
							input.closest('.needs-validation').querySelector("#postErrorMessage").setAttribute("readonly", "");
							input.closest('.needs-validation').querySelector("#postDescription").setAttribute("readonly", "");
							if (input.value.includes("xxxx")) {
								$(input).closest('.needs-validation').find("#serial-exists").remove();
								$(input).after('<div id="serial-exists" class="text-danger" <strong> Số serial không xác định. (Hỏng tem, mất tem,...)<strong></div>');
								input.closest('.needs-validation').querySelector("#postDescription").value = "Số serial không xác định. (Hỏng tem, mất tem,...)";
								flagSerialExist = true;
								input.closest('.needs-validation').querySelector("#detail").classList.remove("do-none");
								input.closest('.needs-validation').querySelector("#detail").classList.add("do-block");	
								input.closest('.needs-validation').querySelector("#postErrorMessage").removeAttribute("readonly");
								input.closest('.needs-validation').querySelector("#postDescription").removeAttribute("readonly");
							}
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
	} else {
		$(input).closest('.needs-validation').find("#serial-exists").remove();
		input.setCustomValidity('"' + input.value + '" is not matching the format.');
	}
}

function toast_message(message, title) {
	var toaster = document.getElementById('warningToast');
	toaster.querySelector('.mr-auto').innerHTML = title; // could be dynamic value title
	toaster.querySelector('.toast-body').innerHTML = message; // could be dynamic value message

	$(toaster).toast({animation: false, delay: 5000});
    $(toaster).toast('show');
}

function checkUdisc(batch, serial){
	if (batch == '' || serial == '') {
		return true;
	}
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