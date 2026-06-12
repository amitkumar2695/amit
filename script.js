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
