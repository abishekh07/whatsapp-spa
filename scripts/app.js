"use strict"

function setUserData() {
  const fakeUsers = []

  for (let i = 0; i < 200; i++) {
    fakeUsers.push({
      id: faker.datatype.uuid(),
      avatar: faker.image.avatar(),
      name: faker.name.firstName(),
      message: faker.lorem.sentence(),
      lastmsgtime: faker.date.past(),
      category: "all / contacts",
    })
  }

  saveUsers(fakeUsers)
}

const userData = getUsers() || setUserData()
populateData(document.querySelector(".navbar__item.active"))

/* Search Event Listener */

const searchInput = document.querySelector(".header__search")

searchInput.addEventListener("input", (e) => {
  searchFilter = e.target.value
  populateData(document.querySelector(".navbar__item.active"))
})

function refreshData() {
  userData.forEach((user) => {
    user.lastmsgtime = faker.date.recent().getTime()
  })

  saveUsers(userData)

  const dropdown = document.querySelector(".dropdown")
  if (!dropdown.classList.contains("hidden")) {
    dropdown.classList.add("hidden")
  }

  populateData(document.querySelector(".navbar__item.active"))
}

setInterval(refreshData, 30000)

/* Tabs */

const tabSwitchers = document.querySelectorAll("[data-switcher]")

tabSwitchers.forEach((switcher) => {
  switcher.addEventListener("click", (e) => {
    e.preventDefault()
    const activeTab = document.querySelector(".navbar__item.active")

    activeTab.classList.remove("active")
    switcher.classList.add("active")

    populateData(switcher)
  })
})

Main_Page.addEventListener("contextmenu", (e) => {
  const displayedTab = document.querySelector(".navbar__item.active").dataset
    .tab

  if (
    (displayedTab === "pinned-chats" || displayedTab === "all-chats") &&
    e.target.closest(".user")
  ) {
    if (!e.target.classList.contains("image")) {
      e.preventDefault()

      showCustomMenu(e, displayedTab)
    }
  }
})

const dropdown = document.querySelector(".dropdown")
dropdown.addEventListener("click", (e) => {
  modifyChat(e)
  dropdown.classList.add("hidden")
})

window.addEventListener("mouseup", (e) => {
  if (e.target !== dropdown) dropdown.classList.add("hidden")
})
