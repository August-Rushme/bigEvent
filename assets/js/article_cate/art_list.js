$(function () {
  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = (data) => {
    const dt = new Date(data);
    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };
  //时间补零操作
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
  //定义一个查询参数的对象，将来请求数据的时候，需要将请求参数提交到服务器
  let form = layui.form;
  let layer = layui.layer;
  let laypage = layui.laypage;
  let p = {
    pagenum: 1, //页值码，默认为第一页数据
    pagesize: 2, //没页显示几条数据，默认2条
    cate_id: "", //文章分类的id
    state: "", //文章发布的状态
  };
  initTable();
  initCate();
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: p,
      success: (res) => {
        if (res.status !== 0) {
          console.log(res);
          return layer.msg("获取列表失败");
        }
        //使用模板引擎渲染数据

        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }
  //初始化文章分类的方法

  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("获取数据失败");
        }
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        //通过layui重新渲染表单区域的UI结构
        form.render();
      },
    });
  }
  //为筛选表单绑定submit事件
  $("#form-search").on("submit", (e) => {
    e.preventDefault();
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();

    //为查询参数对象的p赋对应的值
    p.cate_id = cate_id;
    p.state = state;
    //根据筛选条件重新渲染表格
    initTable();
  });
  function renderPage(total) {
    //
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: p.pagesize, //每页显示几条数据
      curr: p.pagenum, //设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 7],
      //分页切换的时候，触发jump回调函数
      jump: (obj, first) => {
        //触发回调函数jump的方式
        //1.点击页码就会触发 fisrt返回undefined
        //2.调用renderPage的时候会触发first返回true,如果直接调用initTable方法会触发死循环
        //因为调用initTable的时候就会调用renderPage,调用renderPage就会调用initTable
        //这样一直循环

        //把最新的页码赋值到查询参数对象跑中
        p.pagenum = obj.curr;
        //把最新的条目数赋值到p的pagenum中
        p.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  //通过代理事件为删除按钮绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    let len = $(".btn-delete").length; //获取页面上按钮的个数
    console.log(len + "按钮");
    let id = $(this).attr("data-id");
    layer.confirm("确定删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: (res) => {
          if (res.status !== 0) {
            return layer.msg("删除失败!");
          }
          layer.msg("删除成功!");

          //当数据删除完后，还需要判断页面上是否还有数据
          //如果当前页面没有数据了则让页码-1
          //再重新调用initTable方法
          if (len === 1) {
            //如果len值等于1，则证明删除完成后页面上没有数据了
            //页码值最小必须为1
            p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});

//编辑
//编辑
