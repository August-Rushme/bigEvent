$(function () {
  //验证密码
  let form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: (value) => {
      if (value === $("[name=oldPwd]").val()) {
        return "新旧密码不能一样";
      }
    },
    rePwd: (value) => {
      if (value !== $("[name=newPwd]").val()) {
        return "新旧密码不一致";
      }
    },
  });
  $(".layui-form").on("submit", (e) => {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(".layui-form").serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layui.layer.msg("更新密码失败!");
        }
        layui.layer.msg("更新密码成功!");
        //通过原生的dom清空密码单
        $(".layui-form")[0].reset();
      },
    });
  });
});
