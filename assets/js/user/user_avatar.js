// 1.1 获取裁剪区域的 DOM 元素
var $image = $("#image");
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: ".img-preview",
};
// 1.3 创建裁剪区域
$image.cropper(options);
//为上传按钮绑定点击事件
$("#btnChooseImage").on("click", () => {
  $("#file").click();
});

$("#file").on("change", (e) => {
  //获取用户选择的文件
  let fileList = e.target.files;
  if (fileList.length === 0) {
    return layui.layer.msg("请选择图片!");
  }
  //拿到用户的文件
  let file = e.target.files[0];
  //将文件转换为路径
  let newImgURL = URL.createObjectURL(file);
  $image
    .cropper("destroy") // 销毁旧的裁剪区域
    .attr("src", newImgURL) // 重新设置图片路径
    .cropper(options); // 重新初始化裁剪区域
});
$("#btnUpload").on("click", () => {
  //拿到用户剪裁后的图片
  let dataURL = $image
    .cropper("getCroppedCanvas", {
      // 创建一个 Canvas 画布
      width: 100,
      height: 100,
    })
    .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
  //调用接口上传图片
  $.ajax({
    method: "POST",
    url: "/my/update/avatar",
    data: {
      avatar: dataURL,
    },
    success: (res) => {
      if (res.status !== 0) {
        return layui.layer.msg("更换头像失败!");
      }
      layui.layer.msg("更换头像成功！");
      window.parent.getUserInfo();
    },
  });
});
