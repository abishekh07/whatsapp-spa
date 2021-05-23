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

renderUsers(userData)

function refreshData() {
  userData.forEach((user) => {
    user.lastmsgtime = faker.datatype.datetime().getTime()
  })

  saveUsers(userData)
  newUserData = getUsers()
  renderUsers(newUserData)
}

// setInterval(refreshData, 3000)
