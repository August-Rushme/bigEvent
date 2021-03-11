$.ajaxPrefilter((options) => {
  options.url = " http://ajax.frontend.itheima.net" + options.url;

  //统一为有权限的接口设置headers
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  //全局统一挂载complete回调函数
  options.complete = (res) => {
    //complete回调函数中，可以使用res.responseJSON
    //拿到服务器响应回来的数据
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //强行清空token
      localStorage.removeItem("token");
      //强制跳转到登录页
      location.href = "./login.html";
    }
  };
});
