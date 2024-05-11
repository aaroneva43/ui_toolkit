(() => {
  return (b) => {
    var branch = b || "br_for_onboarding_code_merge";
    fetch(
      "https://dolphinjenkins.corp.fortinet.com/job/Dolphin/job/Lab/job/Build_Proxy_GUI/build?delay=0sec",
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language":
            "en-US,en;q=0.9,zh-US;q=0.8,zh;q=0.7,zh-CN;q=0.6,pt;q=0.5,zh-TW;q=0.4",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          pragma: "no-cache",
          "upgrade-insecure-requests": "1",
        },
        referrer:
          "https://dolphinjenkins.corp.fortinet.com/job/Dolphin/job/Lab/job/Build_Proxy_GUI/build?delay=0sec",
        referrerPolicy: "same-origin",
        body: `name=BRANCH&value=origin%2F${branch}&statusCode=303&redirectTo=.&Jenkins-Crumb=${document.head.dataset.crumbValue}&json=%7B%22parameter%22%3A%7B%22name%22%3A%22BRANCH%22%2C%22value%22%3A%22origin%2F${branch}%22%7D%2C%22statusCode%22%3A%22303%22%2C%22redirectTo%22%3A%22.%22%2C%22%22%3A%22%22%2C%22Jenkins-Crumb%22%3A%227ac400fe989efb4d4f67a26d6f4663674da9625810e8262c8fb0febaa8c6155c%22%7D`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
  };
})();
