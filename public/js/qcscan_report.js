var table = $('#reporttable').DataTable({
    
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
    ajax: url_ajax_qcscan_report,
    "columns": [
        { "data": "date", defaultContent: ''},
        { "data": "content.total", defaultContent: '' },
        { "data": "content.quality.OK", defaultContent: '', className: "col-pass" },
        { "data": "content.quality.QT", defaultContent: '', className: "col-QT" },
        { "data": "content.quality.NG", defaultContent: '', className: "col-NG"  },
        { "data": "content.quality.NG_Pct", defaultContent: '', className: "col-NG"  },
        { "data": "content.data.R.total", defaultContent: '' },
        { "data": "content.data.R.quality.OK", defaultContent: '', className: "col-pass" },
        { "data": "content.data.R.quality.QT", defaultContent: '', className: "col-QT" },
        { "data": "content.data.R.quality.NG", defaultContent: '', className: "col-NG" },
        { "data": "content.data.R.quality.NG_Pct", defaultContent: '', className: "col-NG" },
        { "data": "content.data.G.total", defaultContent: '' },
        { "data": "content.data.G.quality.OK", defaultContent: '', className: "col-pass" },
        { "data": "content.data.G.quality.QT", defaultContent: '', className: "col-QT" },
        { "data": "content.data.G.quality.NG", defaultContent: '', className: "col-NG" },
        { "data": "content.data.G.quality.NG_Pct", defaultContent: '', className: "col-NG" },
        { "data": "content.data.B.total", defaultContent: '' },
        { "data": "content.data.B.quality.OK", defaultContent: '', className: "col-pass" },
        { "data": "content.data.B.quality.QT", defaultContent: '', className: "col-QT" },
        { "data": "content.data.B.quality.NG", defaultContent: '', className: "col-NG" },
        { "data": "content.data.B.quality.NG_Pct", defaultContent: '', className: "col-NG" },
        { "data": "content.data.P.total", defaultContent: '' },
        { "data": "content.data.P.quality.OK", defaultContent: '', className: "col-pass" },
        { "data": "content.data.P.quality.QT", defaultContent: '', className: "col-QT" },
        { "data": "content.data.P.quality.NG", defaultContent: '', className: "col-NG" },
        { "data": "content.data.P.quality.NG_Pct", defaultContent: '', className: "col-NG" },
        { "data": "content.data.W.total", defaultContent: '' },
        { "data": "content.data.W.quality.OK", defaultContent: '', className: "col-pass" },
        { "data": "content.data.W.quality.QT", defaultContent: '', className: "col-QT" },
        { "data": "content.data.W.quality.NG", defaultContent: '', className: "col-NG" },
        { "data": "content.data.W.quality.NG_Pct", defaultContent: '', className: "col-NG" },
        { "data": "content.data.Y.total", defaultContent: '' },
        { "data": "content.data.Y.quality.OK", defaultContent: '', className: "col-pass" },
        { "data": "content.data.Y.quality.QT", defaultContent: '', className: "col-QT" },
        { "data": "content.data.Y.quality.NG", defaultContent: '', className: "col-NG" },
        { "data": "content.data.Y.quality.NG_Pct", defaultContent: '', className: "col-NG" },
    ],
    order: [
        // [0, 'desc']
    ],
    lengthChange: true,
    lengthMenu: [50, 100, 200, 500],
    buttons: [
                'copy', 'excel', 'pdf',
                {
                    text: 'Tháng trước',
                    action: function() {
                        ReloadTable(table, -1);
                    }
                },
                {
                    text: 'Tháng sau',
                    action: function() {
                        ReloadTable(table, 1);
                    },
                    enabled: false
                }
            
    ],
    initComplete: function() {
        table.buttons().container()
            .appendTo($('.col-md-6:eq(0)', table.table().container()));
    },
    "drawCallback": function( settings ) {
        var api = this.api();
        for (let i = 1; i < api.columns().header().length; i++) {
            if(i % 5 != 0){
                var total = api.column(i).data().reduce(function (a, b) {
                    return Number(a) + Number(b);
                }, 0);
                $('tr:eq(2) th:eq('+i+')').text(Number(total));
            }else{
                var ng = Number($('tr:eq(2) th:eq('+(i-1)+')').text());
                var total = Number($('tr:eq(2) th:eq('+(i-4)+')').text());
                var perc = (ng/total)*100;
                $('tr:eq(2) th:eq('+i+')').text(perc.toFixed(2));
            }
        }
    }
});
new $.fn.dataTable.FixedHeader( table, {
    header: true,
    headerOffset: $('.wrapper nav').outerHeight()
});

var ro = new ResizeObserver(entries => {
    table.fixedHeader.adjust();
  });
  
  // Observe one or multiple elements
  ro.observe(document.getElementById("reporttable"));

function dateToYM(date) {
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    $("#cur_mo").text(m<=9 ? '0' + m : m);
    $("#cur_ye").text(y);
    const date_now = new Date();

    date_now.setDate(1);
    date_now.setHours(0,0,0,0);
    console.log(date);
    console.log(date_now);
    table.button( 4 ).enable(date_now > date);
    table.button( 5 ).enable(date_now < date);
    return '' + y + (m<=9 ? '0' + m : m);
}
function ReloadTable(table, index) {
    let url = new URL(url_ajax_qcscan_report);
    let params = new URLSearchParams(url.search);
    current_date.setMonth(current_date.getMonth() + index);
    params.set('date', dateToYM(current_date));
    url_ajax_qcscan_report = url.origin + url.pathname + "?" + params.toString();
    table.clear().draw();
    table.ajax.url( url_ajax_qcscan_report ).load();
}