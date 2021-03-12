$(function () {
  getUserInfo();
});
//退出登陆
let layer = layui.layer;
$("#btnLogout").on("click", () => {
  layer.confirm(
    "确定退出登陆吗?",
    { icon: 3, title: "提示" },
    function (index) {
      //do something
      //清除本地的localStorage
      localStorage.removeItem("token");
      //重新跳转到登陆页面
      location.href = "./login.html";
      //关闭询问框
      layer.close(index);
    }
  );
});
//获取用户的基本信息

function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      renderVatar(res.data);
    },
    //无论请求成功还是失败都会执行complete
    // complete: (res) => {}
  });
}
//渲染用户头像
function renderVatar(user) {
  //获取用户的名称
  let name = user.nickname || user.username;
  //设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  //获取用户头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    let first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
