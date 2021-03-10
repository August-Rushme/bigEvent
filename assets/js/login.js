$(function () {
  //点击去注册隐藏登录框
  $("#link_reg").on("click", () => {
    $(".box-login").hide();
    $(".box-reg").show();
  });
  //点击器登录隐藏注册框
  $("#link_login").on("click", () => {
    $(".box-login").show();
    $(".box-reg").hide();
  });
  //从layui中获取form对象
  let form = layui.form;
  let layer = layui.layer;
  //通过form.verify函数自定义校验规则
  form.verify({
    //自定义一个校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须是6到12位，且不能出现空格"],
    //校验注册的两次密码是否一致
    repwd: (value) => {
      var pwd = $("#pwd1").val();
      if (pwd !== value) {
        return "两次的密码不一致，请重新输入";
      }
    },
  });
  //监听注册表单的提交事件
  $("#form_reg").on("submit", (e) => {
    e.preventDefault();
    $.post(
      "/api/reguser",
      {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("注册成功");
        $("#link_login").click();
      }
    );
  });
  //监听登陆表单的事件
  $("#form_login").submit((e) => {
    e.preventDefault();
    console.log(123);
    $.ajax({
      url: "/api/login",
      method: "POST",
      data: $("#form_login").serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("账号或密码错误");
        }
        layer.msg("登陆成功");
        //将服务器返回的token保存到locaStorage中
        localStorage.setItem("token", res.token);
        location.href = "./index.html";
      },
    });
  });
});
