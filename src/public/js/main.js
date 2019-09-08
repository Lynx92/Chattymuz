$(function() {
  const socket = io();

  const $messageForm = $("#message-form");
  const $messageBox = $("#message");
  const $chat = $("#chat");

  const $nickForm = $("#nickForm");
  const $nickError = $("#nickError");
  const $nickname = $("#nickname");

  const $users = $("#usernames");

  $nickForm.submit(e => {
    e.preventDefault();
    socket.emit("new user", $nickname.val(), data => {
      if (data) {
        $("#nickWrap").hide();
        $("#contentWrap").show();
      } else {
        $nickError.html(`<div class="alert alert-danger">
                That username already exist </div>`);
      }
      $nickname.val("");
    });
  });

  $messageForm.submit(e => {
    e.preventDefault();
    socket.emit("send message", $messageBox.val());
    $messageBox.val("");
  });

  socket.on("new message", data => {
    $chat.append("<b>" + data.nick + "</b>" + ": " + data.msg + "<br/>");
  });

  socket.on("usernames", data => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
      html += `<p>${data[i]}</p>`;
    }
    $users.html(html);
  });

  socket.on("load old msgs", msgs => {
    for (let i = 0; i < msgs.length; i++) {
      displayMsg(msgs[i]);
    }
  });

  function displayMsg(data) {
    $chat.append("<b>" + data.nick + "</b>" + ": " + data.msg + "<br/>");
  }
});
