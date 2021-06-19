let selectedUserId

function getUsers() {
  const lsData = localStorage.getItem("users")

  try {
    return JSON.parse(lsData)
  } catch (e) {
    console.log(e)
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

function handleEmptyState(query) {
  let currTabName = document.querySelector(".navbar__item.active").dataset.tab
  currTabName = currTabName.split("-").join(" ")

  console.log(`The ${currTabName} tab is empty!!`)

  const emptyState = document.createElement("div")
  emptyState.setAttribute("class", "empty")

  const emptyIcon = document.createElement("img")
  emptyIcon.setAttribute("class", "empty__icon")
  emptyIcon.setAttribute("src", "../empty.svg")

  const emptyMessage = document.createElement("p")
  emptyMessage.setAttribute("class", "empty__message")

  if (!query) {
    emptyMessage.innerHTML = `You have no <span>${currTabName}</span> here. Try switching the tabs from above!</em>`
  } else {
    emptyMessage.innerHTML = `No results found for "<span>${query}</span>"`
  }

  emptyState.append(emptyIcon, emptyMessage)
  Main_Page.appendChild(emptyState)
}

// const loader = document.querySelector(".pages .overlay")

// function showLoader() {
//   loader.style.display = "block"
//   document.querySelector(".pages").style.overflowY = "hidden"
// }

// function hideLoader() {
//   loader.style.display = "none"
//   document.querySelector(".pages").style.overflowY = "auto"
// }

function sortUserData(userData) {
  return userData.sort((a, b) => {
    if (a.lastmsgtime > b.lastmsgtime) return -1
    else if (b.lastmsgtime > a.lastmsgtime) return 1
    else return 0
  })
}

function getSearchResults(users) {
  return users.filter((user) =>
    user.name.toLowerCase().includes(searchFilter.toLowerCase())
  )
}

function modifyChat(e) {
  const targetUser = userData.find(
    (user) => user.id === selectedUserId.textContent
  )

  const targetedUserIndex = userData.findIndex(
    (user) => user.id === selectedUserId.textContent
  )

  const targetedUserCategories = targetUser.category.split(" / ")

  switch (e.target.id) {
    case "pin":
      if (targetedUserCategories[0] === "all") {
        targetedUserCategories[0] = "pinned"
        targetUser.category = targetedUserCategories.join(" / ")
      }
      break
    case "unpin":
      if (targetedUserCategories[0] === "pinned") {
        targetedUserCategories[0] = "all"
        targetUser.category = targetedUserCategories.join(" / ")
      }
      break
    case "delete":
      userData.splice(targetedUserIndex, 1)
      break
  }

  saveUsers(userData)
  populateData(document.querySelector(".navbar__item.active"))
}

function showCustomMenu(evt, tab) {
  dropdown.classList.remove("hidden")

  selectedUserId = evt.target.closest(".user").childNodes[1].childNodes[3]

  const firstOption = document.querySelector(".dropdown .option-one")

  if (tab === "all-chats") {
    firstOption.setAttribute("id", "pin")
    firstOption.textContent = "Pin Chat"
  } else {
    firstOption.setAttribute("id", "unpin")
    firstOption.textContent = "Unpin Chat"
  }

  const rect = Main_Page.getBoundingClientRect()
  const x = evt.clientX - rect.left
  const y = evt.clientY - rect.top

  dropdown.style.top = `${y}px`
  dropdown.style.left = `${x}px`
  dropdown.style.display = "block"
}

function populateData(tab) {
  const currentTab = tab.dataset.tab

  switch (currentTab) {
    case "pinned-chats":
      const pinnedChats = userData.filter((user) =>
        user.category.includes("pinned")
      )
      renderUsers(pinnedChats)

      break

    case "all-chats":
      const allChats = userData.filter((user) => user.category.includes("all"))
      renderUsers(allChats)
      break

    case "group-chats":
      const groupChats = userData.filter((user) =>
        user.category.includes("group")
      )
      renderUsers(groupChats)
      break

    case "contacts":
      const contacts = userData.map((user) => {
        return { id: user.id, avatar: user.avatar, name: user.name }
      })
      renderUsers(contacts)
      break
  }
}

function generateUserDOM(users) {
  users.forEach((user) => {
    const userCard = document.createElement("div")
    userCard.setAttribute("class", "user")

    const userImage = document.createElement("div")
    userImage.setAttribute("class", "user__image")
    const image = document.createElement("img")
    image.setAttribute("class", "user__image--img")

    const userInfo = document.createElement("div")
    userInfo.setAttribute("class", "user__info")

    const userName = document.createElement("h4")
    userName.setAttribute("class", "user__info--name")

    const userMessage = document.createElement("p")
    userMessage.setAttribute("class", "user__info--msg")

    const userTimeStamp = document.createElement("p")
    userTimeStamp.setAttribute("class", "user__info--time")

    const timeMonth = document.createElement("span")
    timeMonth.setAttribute("class", "user__info-time--month")

    const timeMinutes = document.createElement("span")
    timeMinutes.setAttribute("class", "user__info-time--minutes")

    const userId = document.createElement("input")
    userId.setAttribute("class", "user__info--id")
    userId.setAttribute("type", "hidden")
    userId.textContent = user.id

    image.setAttribute("src", user.avatar)
    userImage.appendChild(image)

    userName.textContent = user.name || null
    userMessage.textContent = user.message || null

    const time = new Date(user.lastmsgtime)

    if (time != "Invalid Date") {
      let realTime = time.toLocaleDateString("en-us", {
        hour: "numeric",
        minute: "numeric",
      })

      realTime = realTime.split(",")[1]

      timeMinutes.textContent = realTime
      timeMonth.textContent = `${time.getMonth()}/${time.getFullYear()}`

      userTimeStamp.append(timeMonth, timeMinutes)
    }

    userImage.appendChild(image)
    userInfo.append(userName, userTimeStamp, userMessage, userId)

    userCard.append(userImage, userInfo)
    Main_Page.appendChild(userCard)
  })
}

function renderUsers(incomingData) {
  Main_Page.innerHTML = ""

  if (Array.isArray(incomingData) && !incomingData.length) {
    handleEmptyState()
    return
  }

  const sortedUsers = sortUserData(incomingData)
  const filteredUsers = getSearchResults(sortedUsers)

  filteredUsers.length > 0
    ? generateUserDOM(filteredUsers)
    : handleEmptyState(searchFilter)

  // showLoader()
  // setTimeout(() => {
  //   hideLoader()
  //   generateUserDOM(sortedUsers)
  // }, 1500)
}
