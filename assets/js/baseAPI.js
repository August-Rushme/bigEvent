$.ajaxPrefilter((options) => {
  options.url = " http://ajax.frontend.itheima.net" + options.url;
  console.log(options.url);
});
