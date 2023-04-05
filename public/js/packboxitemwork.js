var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var date = urlParams.get('date');
var filterS = urlParams.get('filter');
var token = $('meta[name="csrf-token"]').attr('content');
var tableDoWork = null;
var table = null;
var tableReport = null;
var doWork = null;
var working = [];
var id_box = null;
var soundError = null;
var soundTing = null;
var soundSuccess = null;
jQuery(document).ready(function($) {
	soundError = document.getElementById("errorAudio"); 
	soundTing = document.getElementById("tingAudio"); 
	soundSuccess = document.getElementById("successAudio"); 
	tableDoWork = $('#packboxitem_dowork').DataTable({
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
		dom: "tl",
		processing: true,
		data: [],
		"ordering": false,

		lengthChange: false,
	});
	
	//table trace
	table = $('#packboxitemworktable').DataTable({
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
		dom: "Bfrtlip",
		processing: true,
		ajax: url_get_packboxitemwork,
		"columns": [
			{
				"data": "batch_number"
			},
			{
				"data": "serial_number"
			},
			{
				"data": "created_at"
			},
		],
		select: false,
		order: [
			[2, 'desc']
		],
		lengthChange: true,
		lengthMenu: [ [20, 50, 100, 200, 500, -1], [20, 50, 100, 200, 500, "All"] ],
		// buttons: [ 'copy', 'excel', 'pdf', {extend: 'colvis', text: 'Show'} ],
		buttons:
		[
			{
				extend: 'colvis',
				text: 'Hiển thị cột'
			},
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
			},
			'excel'

		],
	});

	$('[data-index="1"]').focus();
	drawTableReport();

	$('#reservation').change(function(){
		changeHandler();
		
	});

});
function changeHandler() {
	let dateRange = $('#reservation').val();
	let arrDate = dateRange.split(' - ');
	let url_ajx = url_get_packboxitemwork_new + `?dateFrom=${arrDate[0]}&dateTo=${arrDate[1]}`;
	if (tableReport != null) {
		tableReport.clear();
		tableReport.ajax.url(url_ajx).load();
	}
}
function drawTableReport() {
	let dateRange = $('#reservation').val();
	let arrDate = dateRange.split(' - ');
	let url_ajx = url_get_packboxitemwork_new + `?dateFrom=${arrDate[0]}&dateTo=${arrDate[1]}`;
	//table report
	tableReport = $('#packbox_report').DataTable({
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
		dom: "Bfrtlip",
		processing: true,
		ajax: url_ajx,
		"columns": [
			{
				// "data": "packboxitem.name",
				defaultContent: 'LP_RAF200',
			},
			{
				"data": "packboxitem.name",
				defaultContent: ''
			},
			{
				"data": "packboxitem.number",
				defaultContent: ''
			},
			{
				"data": "batch_number"
			},
			{
				"data": "total"
			},
		],
		select: false,
		order: [
			[3, 'desc']
		],
		lengthChange: true,
		lengthMenu: [ [20, 50, 100, 200, 500, -1], [20, 50, 100, 200, 500, "All"] ],
		buttons: [ 'copy', 'excel', 'pdf', {extend: 'colvis', text: 'Show'} ],
		"footerCallback": function (tfoot, data, start, end, display) {
            var api = this.api();
            var p = api.column(4).data().reduce(function (a, b) {
                return a + b;
            }, 0)
            $(api.column(4).footer()).html(p);
        },
	});
}

$.fn.hasAttr = function(name) {
	return this.attr(name) !== undefined;
};

function toast_message(message, title) {
	var toaster = document.getElementById('warningToast');
	toaster.querySelector('.mr-auto').innerHTML = title; // could be dynamic value title
	toaster.querySelector('.toast-body').innerHTML = message; // could be dynamic value message

	$(toaster).toast({animation: false, delay: 5000});
    $(toaster).toast('show');
}


function checkListWork(input) {
	if(event.key === 'Enter' && input.value != null && input.value != '') {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		arrItem = input.value.split(".");
		lastItem = arrItem.pop();
		if (isNaN(lastItem) || lastItem.length > 4) {
			soundError.currentTime = 0;
			soundError.play();
			soundTing.pause();
			soundSuccess.pause();
			toast_message(`<div class='text-danger'>Mã bao bì ${input.value} không hợp lệ</div>`, "Cảnh báo");
			input.value = null;
			return
		}
		data = {
			'number': arrItem.join('.'),
		}
		console.log(data);
		$.ajax({
			type: "POST",
			url: "ajax_get_dowork",
			data: data,
			dataType: "json",
			success: function(response) {
				console.log(response);
				if (response.length == 0 || response['doWork'].length == 0) {
					soundError.currentTime = 0;
					soundError.play();
					soundTing.pause();
					soundSuccess.pause();
					toast_message(`<div class='text-danger'>Không tìm thấy dữ liệu phù hợp với mã bao bì ${input.value}</div>`, "Cảnh báo");
					input.value = null;
				}else{
					soundTing.currentTime = 0;
					soundTing.play();
					soundError.pause();
					soundSuccess.pause();
					input.disabled = true;
					document.getElementById("postItem").disabled = false;
					document.getElementById("postItem").focus();
					doWork = response['doWork'];
					working = [];
					id_box = response['id_box'];
					//reload table
					refreshTableDoWork();
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				soundError.currentTime = 0;
				soundError.play();
				soundTing.pause();
				soundSuccess.pause();
				toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện tìm dữ liệu</div>", "Cảnh báo");
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			complete: function(data) {
				// console.log("data");
			}
		});
    }
}

function refreshTableDoWork() {
	dataset = [];
	doWork.forEach(element => {
		var valuesOnly = Object.values(element);
		dataset.push(valuesOnly);
		
	});
	tableDoWork.clear().rows.add(dataset).draw();
	for (let index = 0; index < doWork.length; index++) {
		if (doWork[index].actived == doWork[index].quantity) {
			document.querySelector(`#packboxitem_dowork tbody tr:nth-child(${index + 1})`).classList.add("success");
		}
	}
}

function processDoWork(input) {
	if(event.key === 'Enter' && input.value != null && input.value != '') {
		var index = doWork.findIndex(obj => input.value.startsWith(obj.number));
		if (index >= 0) {
			let postPackbox = document.getElementById("postPackbox").value;
			if(postPackbox.includes("UDISC") && input.value.startsWith("UDISC")){
				num_pack1 = postPackbox.split('.').pop();
				num_pack2 = input.value.split('.').pop();
				// console.log("num_pack1: ", num_pack1);
				// console.log("num_pack2: ", num_pack2);
				if (num_pack1 != num_pack2) {
					soundError.currentTime = 0;
					soundError.play();
					soundTing.pause();
					soundSuccess.pause();
					toast_message(`<div class='text-danger'>Mã item ${input.value} không khớp với số lô ${postPackbox}, hãy quét mã khác.</div>`, "Cảnh báo");
					input.value = null;
					return;
				}
			}
			if (doWork[index].quantity != doWork[index].actived) {
				soundTing.currentTime = 0;
				soundTing.play();
				soundError.pause();
				soundSuccess.pause();
				doWork[index].actived += 1;
				refreshTableDoWork();
				var elems = document.querySelectorAll("#packboxitem_dowork tbody tr");

				[].forEach.call(elems, function(el) {
					el.classList.remove("active");
				});
				if (doWork[index].actived == doWork[index].quantity) {
					document.querySelector(`#packboxitem_dowork tbody tr:nth-child(${index + 1})`).classList.add("success");
				} else {
					document.querySelector(`#packboxitem_dowork tbody tr:nth-child(${index + 1})`).classList.add("active");
				}
				working.push(input.value);
			} else {
				soundError.currentTime = 0;
				soundError.play();
				soundTing.pause();
				soundSuccess.pause();
				toast_message(`<div class='text-danger'>Mã item ${input.value} đã thực hiện đầy đủ, hãy quét mã khác.</div>`, "Cảnh báo");
			}
			
			//kiểm tra công việc đã hoàn thành chưa?
			var result = doWork.filter(obj => {
				return obj.quantity != obj.actived;
			});
			if (result.length == 0) {
				input.disabled = true;
				writeToDB(input);
			}
		} else {
			soundError.currentTime = 0;
			soundError.play();
			soundTing.pause();
			soundSuccess.pause();
			toast_message(`<div class='text-danger'>Mã item ${input.value} không có trong danh sách cần thực hiện.</div>`, "Cảnh báo");
		}
		input.value = null;
    }
}

function writeToDB(input) {
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	data = {
		'id_box': id_box,
		'batch_number': document.getElementById("postPackbox").value,
		'working': working,
		'user_id': user_id
	}
	$.ajax({
		type: "POST",
		url: "ajax_create_worked",
		data: data,
		dataType: "json",
		success: function(response) {
			console.log(response);
			$('#submitWriteToDB').addClass("d-none");
			input.value = null;
			document.getElementById("postPackbox").value = null;
			document.getElementById("postPackbox").disabled = false;
			document.getElementById("postPackbox").focus();
			doWork = null;
			working = null;
			tableDoWork.clear().draw();
			table.ajax.reload();
			soundSuccess.currentTime = 0;
			soundSuccess.play();
			soundTing.pause();
			soundError.pause();
			toast_message("<div class='text-success'>Đã thực hiện xong, hãy quét mã bao bì mới</div>", "Thông báo");
			changeHandler();
			//reload table
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			soundError.currentTime = 0;
			soundError.play();
			soundTing.pause();
			soundSuccess.pause();
			toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện lưu dữ liệu, hãy bấm ghi dữ liệu.</div>", "Cảnh báo");
			$('#submitWriteToDB').removeClass("d-none");
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		},
		complete: function(data) {
			
			
			
		}
	});
}
function handleClickWriteToDB() {
	writeToDB(document.getElementById("postItem"))
}
function handleClickCancel() {
	$('#submitWriteToDB').addClass("d-none");
	document.getElementById("postItem").value = null;
	document.getElementById("postPackbox").disabled = true;
	document.getElementById("postPackbox").value = null;
	document.getElementById("postPackbox").disabled = false;
	document.getElementById("postPackbox").focus();
	doWork = null;
	working = null;
	tableDoWork.clear().draw();
}


// $(document).ready( function () {
// 	var table = $('#example').DataTable({
	  
//   "footerCallback": function(row, data, start, end, display) {
// 	var api = this.api();
// 	api.columns(2, {
// 	  page: 'current'
// 	}).every(function() {
// 	  var sum = this
// 	  .nodes()
// 	  .reduce(function(a, b) {
// 		var x = parseFloat(a) || 0;
// 		var y = parseFloat($(b).attr('data-sort')) || 0;
// 		return x + y;
// 	  }, 0);
// 	  $(this.footer()).html(sum);
// 	});
//   }     
	  
// 	});
//   } );