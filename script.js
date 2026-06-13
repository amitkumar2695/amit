function openTab(evt, tabName) {

  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("active");
  }

  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}
function openPositionTab(evt, tabName) {

    let i;

    let tabcontent =
    document.getElementsByClassName("position-subtab");

    for(i=0;i<tabcontent.length;i++) {

        tabcontent[i].classList.remove("active");
    }

    let tablinks =
    document.getElementsByClassName("subtab-btn");

    for(i=0;i<tablinks.length;i++) {

        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName)
    .classList.add("active");

    evt.currentTarget.classList.add("active");
}

function openTalkTab(evt, tabName) {

    let i;

    let tabcontent =
    document.getElementsByClassName("talk-subtab");

    for(i = 0; i < tabcontent.length; i++) {

        tabcontent[i].classList.remove("active");
    }

    let tablinks =
    document.querySelectorAll("#talks .subtab-btn");

    for(i = 0; i < tablinks.length; i++) {

        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName)
    .classList.add("active");

    evt.currentTarget.classList.add("active");
}

function openAwardTab(evt, tabName) {

    let i;

    let tabs =
    document.getElementsByClassName("award-subtab");

    for(i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }

    let buttons =
    document.querySelectorAll("#awards .subtab-btn");

    for(i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    document.getElementById(tabName)
    .classList.add("active");

    evt.currentTarget.classList.add("active");
}
