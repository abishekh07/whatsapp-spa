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

function sortUserData(userData) {
  return userData.sort((a, b) => {
    if (a.lastmsgtime > b.lastmsgtime) return -1
    else if (b.lastmsgtime > a.lastmsgtime) return 1
    else return 0
  })
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
    userTimeStamp.setAttribute("class", "user__info-time")

    const timeMonth = document.createElement("span")
    timeMonth.setAttribute("class", "user__info-time--month")

    const timeMinutes = document.createElement("span")
    timeMinutes.setAttribute("class", "user__info-time--minutes")

    image.setAttribute("src", user.avatar)
    userImage.appendChild(image)

    userName.textContent = user.name
    userMessage.textContent = user.message

    const time = new Date(user.lastmsgtime)
    let realTime = time.toLocaleTimeString()

    realTime =
      realTime.split(" ")[0].slice(0, -3) + " " + realTime.split(" ")[1]

    timeMinutes.textContent = realTime
    timeMonth.textContent = `${time.getMonth()}/${time.getFullYear()}`

    userTimeStamp.append(timeMonth, timeMinutes)

    userImage.appendChild(image)
    userInfo.append(userName, userTimeStamp, userMessage)

    userCard.append(userImage, userInfo)
    document.querySelector("#dm-chats").appendChild(userCard)
  })
}

function renderUsers(userData) {
  document.querySelector(".pages .page.active").innerHTML = ""

  const sortedUsers = sortUserData(userData)
  generateUserDOM(sortedUsers)
}
