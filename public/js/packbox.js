
    var token = $('meta[name="csrf-token"]').attr('content');
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    var format_input = params.get("filter");

    date = params.get("date");
    $.fn.dataTable.ext.buttons.printBox = {
        action: function(e, table, node, config) {
            var count = table.rows({
                selected: true
            }).count();
            if (count > 0) {
                let row_data = table.rows({
                    selected: true
                }).data()[0];
                window.open(url_create_tem_box+"?idBox="+row_data.id_box+"&status="+packed+"&packtype="+packtype, 'popup');
            } else {
                toast_message("<div class='text-danger'>Hãy chọn thùng bất kỳ để in!</div>", "Cảnh báo");
            }
        }

    };
    
    $( document ).ready(function() {
        // console.log(packtype);
        
        var table = $('#example').DataTable
        ({
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
            processing: true,
            ajax: url_get_data,
            "columns": [
                { "data": 'id' },
                { "data": 'id_box' },
                { "data": 'batch_number' },
                {
                    "data": "batch_number", defaultContent: '',
                    "render": function (data, type, row) {
                        if (data == null) {
                            return;
                        }
                        dataArr = data.split('.');
                        dataArr.pop();
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
                { "data": 'serial_number' },
                { "data": "pack_status.status_pack" , defaultContent: ''},
                { "data": 'created_at' },
                { "data": 'updated_at' },
                { "data": 'date'},
                
            ],
            select: true,
            "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
            // searchPanes: true,
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
            // "searching": false,
            
            "responsive": true,
            order: [
                [0, 'desc']
            ],
            columnDefs: [
                {
                    target: 0,
                    visible: false,
                },
                {
                    target: 7,
                    visible: false,
                },
                {
                    target: 8,
                    visible: false,
                },
                {
				searchPanes: {
					show: false,
					initCollapsed: true
				},
				targets: [0, 3, 4, 6, 7]
			},
			{
				searchPanes: {
					show: true
				},
				targets: [1, 2, 5, 8]
			},

            ],
            buttons: [{
            extend: 'colvis',
            text: 'Hiển thị cột'
            },{
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
            },{
                extend: 'excel',
                text: 'Excel',
                exportOptions: {
                    columns: ':visible'
                },
                title:    new Date().getUTCFullYear().toString() +'.' +(new Date().getMonth() +1).toString() + '.' + (new Date().getDay() - 1).toString() + '-' + new Date().getHours().toString() + '.' + new Date().getMinutes().toString(),
            },{
                extend: 'printBox',
                text: 'In Thùng'
            },
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
        

        // $('.needs-validation').on('keydown', 'input', function(event) {
        //     if (event.which == 13) {
        //         // event.preventDefault();
        //         // var $this = $(event.target);
        //         // var form = $this.closest('form');
        //         // var index = parseFloat($this.attr('data-index'));
        //         // nextFocus(index + 1, form);
        //         $('[data-index="2"]').focus();
        //     }
        // });

        var input = document.getElementById("postIdBox");
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter" ) {
                $(input).closest('.needs-validation').find("#idBox-exists").remove();
                if(input.value !='')
                {
                    $.ajax({
                        type: 'post',
                        url: url_check_id_box,
                        data: {
                            idbox: input.value,
                            status_id: packed,
                            packtype: packtype,
                            _token: token
                        },
                        success: function(data) {
                            if (data.success == false) {
                                $(input).after('<div id="idBox-exists" class="text-danger" <strong>'+ data.message +'<strong></div>');
                                
                                input.closest('.needs-validation').querySelector("#detail").classList.add("d-none");
                                input.closest('.needs-validation').querySelector("#postIdBox").removeAttribute("readonly");
                            } else {
                                $(input).closest('.needs-validation').find("#idBox-exists").remove();
                                $('#form-scan').removeClass('was-validated');
                                input.closest('.needs-validation').querySelector("#detail").classList.remove("d-none");
                                input.closest('.needs-validation').querySelector("#postIdBox").setAttribute("readonly", "");
                                $('[data-index="2"]').focus();
                            }
                        },
                        error: function() {
                            toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện lưu dữ liệu</div>", "Cảnh báo");
                            return false;
                        },
                    });
                }else{
                    $('#form-scan').addClass('was-validated');
                    input.closest('.needs-validation').querySelector("#detail").classList.add("d-none");
                    input.closest('.needs-validation').querySelector("#postIdBox").removeAttribute("readonly");
                }
                input.blur();
                event.preventDefault();
                event.stopPropagation();
            }
            if(input.value){
                $('#form-scan').addClass('was-validated');
                $(input).closest('.needs-validation').find("#idBox-exists").remove();
            }
        });

        var inputSerial = document.getElementById("post_serial_number");
        inputSerial.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                $(inputSerial).closest('.needs-validation').find("#serial-exists").remove();
                $('#serial-exists').removeClass('d-none');
                suggestFormat();
                pattern = format_serial;
                var re = new RegExp(pattern);
                let result = re.test(inputSerial.value);
                if(result){
                    inputSerial.setCustomValidity('');
                    if (inputSerial.value != null && inputSerial.value != '') {
                        id_Box = $("#createForm #postIdBox").val();
                        $.ajax({
                            type: 'post',
                            url: url_check_serial,
                            data: {
                                idBox : id_Box,
                                user_id: user_id,
                                serialNumber: inputSerial.value,
                                packtype: packtype,
                                item_type_id: item_type_id,
                                _token: token
                            },
                            success: function(data) {
                                if (data.success == false) {
                                    inputSerial.blur();
                                    $(inputSerial).after('<div id="serial-exists" class="text-danger" <strong>'+ data.message +'<strong></div>');
                                    // $(inputSerial).closest('.needs-validation').find("#serial-exists").remove();
                                } else {
                                    if (inputSerial.value.includes("xxxx")) {
                                        inputSerial.blur();
                                        $(inputSerial).closest('.needs-validation').find("#serial-exists").remove();
                                        $(inputSerial).after('<div id="serial-exists" class="text-danger" <strong> Số serial không xác định. (Hỏng tem, mất tem,...)<strong></div>');
                                    }else{
                                        $(inputSerial).after('<div id="serial-exists" class="text-success" <strong>'+ data.message +'<strong></div>');
                                        SendData('POST', inputSerial.value);
                                        inputSerial.value ='';
                                        $('#form-scan').removeClass('was-validated');
                                        $(inputSerial).closest('.needs-validation').find("#serial-exists").remove();
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
                            // complete: function(data) {
                            //     console.log(data);
                            // }
                        });
                    }
                    
                }else{
                    inputSerial.setCustomValidity('"' + inputSerial.value + '" is not matching the format.');
                }
                
            }
            
        });
    });



    $.fn.hasAttr = function(name) { 
        return this.attr(name) !== undefined;
    };


    function nextFocus(index, form){
        var input = $(form).find('[data-index="' + index.toString() + '"]');
        if (input.length > 0 && !input.hasAttr("readonly")) {
            input.focus();
        } else {
            nextFocus(index + 1, form);
        }
    }


    function suggestFormat() {
        var postSerialNumbers = document.querySelectorAll("#post_serial_number");
        $('#form-scan').addClass('was-validated');
        var suggestSerial;
        suggestSerial = new RandExp(format_serial).gen();
        [].forEach.call(postSerialNumbers, function(ele) {
            ele.parentElement.querySelector('.c_format').innerHTML = suggestSerial;
        });
    }

    function CheckIdBox(input)
    {
        if(input.value ==''){
            $(input).closest('.needs-validation').find("#idBox-exists").remove();
        }
    }

    function checkSerial(input)
    {
        if(input.value ==''){
            $(input).closest('.needs-validation').find("#serial-exists").remove();
        }
    }

    function CancelPacking()
    {
        $("#createForm #postIdBox").val('');
        $("#createForm #post_serial_number").val('');
        $('#form-scan').removeClass('was-validated');
        
        document.getElementById("postIdBox").removeAttribute("readonly");
        $("#detail").addClass( "d-none" );
        $('#serial-exists').addClass('d-none');
    }

    function CompletePacking()
    {
        SendData('PUT');
        // ,'popup'
        // , 'box item', 'width=400', 'height=400', 'left=200', 'top=200'

        window.location.href = url_create_tem_box+"?idBox="+$("#createForm #postIdBox").val()+"&status="+packed+"&packtype="+packtype;

        // window.location.href = url_create_tem_box+"?idBox="+$("#createForm #postIdBox").val()+"&status="+packed;

        // window.location.reload(true);
        // window.close();
    }

    function DeletePacking(){
        let id_Box;
        id_Box = $("#createForm #postIdBox").val();
        data = {
            'id_box': id_Box,
            'status_id' : packing,
            'user_id': user_id,
            'packtype':packtype
        }
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'POST',
            url: url_delete_pack,
            data: data,
            dataType: "json",
            success: function(response) {
                toast_message("<div class='text-success'>Xóa thành công</div>", "Thông báo");
                $("#createForm #post_serial_number").val('');
                $('#example').DataTable().ajax.reload();
                $("#createForm #postIdBox").val('');
                $("#createForm #post_serial_number").val('');
                $('#form-scan').removeClass('was-validated');
                document.getElementById("postIdBox").removeAttribute("readonly");
                $("#detail").addClass( "d-none" );
                $('#serial-exists').addClass('d-none');
                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện</div>", "Cảnh báo");
                // return false;
                console.log(XMLHttpRequest);
                console.log(data);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });

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

    function SendData(type_ajax, serial =null)
    {
        let id_Box;
        let data;
        let batchNumber;
        let serialNumber;
        let batchRegex;
        let arr_batch;
        if(serial != null){
            serialNumber = serial;
            var str_serial = serialNumber;
            // batchNumber = str_serial.slice(0, 14);
            let arr_serial = str_serial.split(".");
            batchRegex = format_batch.split("|");
            switch(arr_serial.length) {
                case 5:
                    arr_batch = batchRegex[0].split("\\.");
                    arr_batch[0] = arr_batch[0].substring(1, 4) + arr_serial[1];
                    arr_batch[2] = arr_serial[2];
                    arr_batch[3] = arr_serial[3];
                    batchNumber = arr_batch.join(".");
                    break;
                case 6:
                    arr_batch = batchRegex[1].split("\\.");
                    arr_batch[0] = arr_batch[0].substring(1, 4) + arr_serial[1] + arr_serial[2];
                    arr_batch[3] = arr_serial[3];
                    arr_batch[4] = arr_serial[4];
                    batchNumber = arr_batch.join(".");
                    break;
                default:
                  // code block
              }
        }
        var today = new Date();
        var tday= 
        today.getFullYear() + '-' + (
        
        today.getMonth() < 9 ? '0' : ''
        ) + (today.getMonth() + 1) + '-' + (
        today.getDate() < 10 ? '0' : ''
        ) + today.getDate() ; 
        
        // console.log(tday);
        if(type_ajax == "POST"){
            url_ajax = url_create_pack;
            id_Box = $("#createForm #postIdBox").val();
            data = {
                'id_box': id_Box,
                'batch_number': batchNumber,
                'serial_number': serialNumber,
                'user_id': user_id,
                'status_id' : packing,
                'item_type_id': item_type_id,
                'date': tday,
                'packtype':packtype
                }
        }else if(type_ajax == "PUT"){
            url_ajax = url_complete_pack;
            id_Box = $("#createForm #postIdBox").val();
            data = {
                'id_box': id_Box,
                'user_id': user_id,
                'status_id' : packed,
                'item_type_id': item_type_id,
                'packtype':packtype,
                }
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
                toast_message("<div class='text-success'>Lưu thành công</div>", "Thông báo");
                $("#createForm #post_serial_number").val('');
                $('#example').DataTable().ajax.reload();
                if(type_ajax == "PUT"){
                    $("#createForm #postIdBox").val('');
                    $("#createForm #post_serial_number").val('');
                    $('#form-scan').removeClass('was-validated');
                    
                    document.getElementById("postIdBox").removeAttribute("readonly");
                    $("#detail").addClass( "d-none" );
                    $('#serial-exists').addClass('d-none');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toast_message("<div class='text-danger'>Có lỗi xảy ra trong quá trình thực hiện lưu dữ liệu</div>", "Cảnh báo");
                // return false;
                console.log(XMLHttpRequest);
                // console.log(data);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    }
