$(function () {
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) {
          return layui.layer.msg("获取数据失败");
        }

        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }
  //为按钮添加绑定事件
  let addIndex = null;
  $("#btnAddCate").on("click", () => {
    addIndex = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  //通过代理的方式给表单绑定sumbit事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layui.layer.msg("添加失败");
        }
        initArtCateList();
        layui.layer.msg("添加成功");
        layui.layer.close(addIndex);
      },
    });
  });
  //通过代理的方式给编辑按钮绑定click事件
  let editIndex = null;
  $("tbody").on("click", ".btnEdit", function () {
    editIndex = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    let id = $(this).attr("data-id");

    //发起请求获取对应数据的分类
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: (res) => {
        layui.form.val("form-edit", res.data);
      },
    });
  });
  //通过代理的方式为表单绑定sumbit事件

  $("body").on("submit", "#form-edit", (e) => {
    e.preventDefault();
    console.log(111);
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $("#form-edit").serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layui.layer.msg("更新分类数据失败");
        }

        layui.layer.msg("更新分类数据成功");
        layui.layer.close(editIndex);
        initArtCateList();
      },
    });
  });
  $("tbody").on("click", ".btn-delete", function () {
    let id = $(this).attr("data-id");

    layer.confirm("确定要删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: (res) => {
          if (res.status !== 0) {
            return layui.layer.msg("删除失败");
          }
          layui.layer.msg("删除成功");
          initArtCateList();
          layer.close(index);
        },
      });
    });
  });
});
