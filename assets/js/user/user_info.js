$(function () {
  //自定义规则
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: (value) => {
      if (value.length > 6) {
        return "用户昵称必须在1~6个字符之间";
      }
    },
  });
  initUserInfo();
  //初始化用户的信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败");
        }
        //调用form。val快速为表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  }
  //重置表单的数据
  $("#btnReset").on("click", (e) => {
    e.preventDefault();
    initUserInfo();
  });
  //更新用户信息
  $("#formUserInfo").on("submit", (e) => {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $("#formUserInfo").serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败");
        }
        layer.msg("更新用户信息成功");
        //调用父页面的方法，重新渲染用户的头像和信息
        window.parent.getUserInfo();
      },
    });
  });
});
