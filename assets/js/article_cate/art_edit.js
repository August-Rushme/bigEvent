$(function () {
  $("tbody").on("click", "#btn-edit", function () {
    // let id = $(this).attr("data-id");
    // initData();

    // function initData() {
    //   $.ajax({
    //     method: "GET",
    //     url: "/my/article/" + id,

    //     success: (res) => {
    //       console.log(res);
    //     },
    //   });
    // }
    location.href = "/big_event/article/art_edit.html";
  });
  let form = layui.form;
  let layer = layui.layer;
  //富文本编辑器
  // 初始化富文本编辑器

  initCate();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("初始化分类选项失败");
        }
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }
  // 1. 初始化图片裁剪器
  var $image = $("#image");
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };
  // 3. 初始化裁剪区域
  $image.cropper(options);
  //上传图片
  $("#btnUpload").on("click", () => {
    $("#file").click();
  });
  //监听file的change事件，拿到用户上传的文件列表
  $("#file").on("change", (e) => {
    //获取文件数组列表
    let files = e.target.files;
    //判断是否上传了文件
    if (files.length === 0) {
      return;
    }
    //根据文件，创建对应的URL地址
    let newImgURL = URL.createObjectURL(files[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  var art_state = "已发布";
  $("#btnSave2").on("click", () => {
    art_state = "草稿";
  });
  //为表单绑定submit事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    //基于form表单，快速创建一个FormData对象
    let fd = new FormData($(this)[0]);
    fd.append("state", art_state);
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //将文件对象追加到fd中
        fd.append("cover_img", blob);

        //发ajax请求
        publishArticle(fd);
      });
  });

  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("发布文章失败");
        }
        layer.msg("发布文章成功");
        location.href = "/big_event/article/art_list.html";
      },
    });
  }
});
