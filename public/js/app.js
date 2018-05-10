var vue = new Vue({
  el: '#app',
  data: {
    allHomes: [],
    userLogged: [],
    currentUser: null,
    currentCompany: null,
    statusHome: false,
    errorMessage: null,
    allFlights: [],
    allBooks: null,
    searchFlight: null,
    status: 'signup',
    newUser: {
      name: '',
      surname: '',
      email: '',
      password: ''
    },
    newCompany: {
      name: '',
      password: ''
    },
    newFlight: {
      date: '',
      departures: '',
      arrivals: '',
      price: ''
    },
    fullMessage: 'Full',
    users: []
  },
  methods: {
    signup: function () {
      this.errorMessage = null
      this.$http.post('http://localhost:3001/users/signup', this.newUser)
        .then(function (response) {
          console.log('response:', response)
        })
        .catch(function (err) {
          this.errorMessage = err.body.message
          console.log(err)
        })
    },
    login: function () {
      this.errorMessage = null
      this.$http.post('http://localhost:3001/users/login', {email: this.newUser.email, password: this.newUser.password})
        .then(function (response) {
          localStorage.setItem('token', response.body.token)
          this.me()
          this.getAllBooks()
        })
    },
    logout: function () {
      this.currentUser = null
      this.searchFlight = null
      this.currentCompany = null
      this.allBooks = null
      localStorage.removeItem('token')
    },
    me: function () {
      this.$http.get(`http://localhost:3001/users/me?token=${localStorage.getItem('token')}`)
        .then(function (response) {
          console.log('response:', response)
          this.currentUser = response.body
        })
    },
    signupCompany: function () {
      this.errorMessage = null
      this.$http.post('http://localhost:3001/companies/signupCompany', this.newCompany)
        .then(function (response) {
          console.log('response:', response)
        })
        .catch(function (err) {
          this.errorMessage = err.body.message
          console.log(err)
        })
    },
    loginCompany: function () {
      this.errorMessage = null
      this.$http.post('http://localhost:3001/companies/loginCompany', this.newCompany)
        .then(function (response) {
          localStorage.setItem('token', response.body.token)
          this.meCompany()
          this.getAllFlights()

        })
    },
    logoutCompany: function () {
      this.currentCompany = null
      this.allFlights = null
      localStorage.removeItem('token')
    },
    meCompany: function () {
      this.$http.get(`http://localhost:3001/companies/meCompany?token=${localStorage.getItem('token')}`)
        .then(function (response) {
          console.log('response:', response)
          this.currentCompany = response.body
        })
    },
    createFlight: function () {
      this.$http.post(`http://localhost:3001/flights?token=${localStorage.getItem('token')}`, this.newFlight)
        .then(response => response.json())
        .then(response => {
          console.log('response:', response)
          this.getAllFlights()
        })
    },
    getAllFlights: function () {
      this.$http.get(`http://localhost:3001/flights`)
        .then(function (response) {
          console.log('response:', response)
          this.allFlights = response.body
        })
    },
    deleteFlight: function (id) {
      this.$http.delete(`http://localhost:3001/flights/${id}?token=${localStorage.getItem('token')}`)
        .then(response => response.json())
        .then(response => {
          console.log('response:', response)
          this.getAllFlights()
        })
    },
    searchBook: function (departures, arrivals) {
      this.$http.get(`http://localhost:3001/users/${departures}/${arrivals}`)
        .then(response => response.json())
        .then(response => {
          console.log('response:', response)
          this.searchFlight = response
          this.getAllFlights()
        })
    },
    createBook: function (id) {
      this.$http.post(`http://localhost:3001/books/${id}?token=${localStorage.getItem('token')}`)
        .then(response => response.json())
        .then(response => {
          console.log('response:', response)
        })
    },
    getAllBooks: function () {
      this.$http.get(`http://localhost:3001/books`)
        .then(function (response) {
          console.log('response:', response)
          this.allBooks = response.body
        })
    },
    doCeckin: function () {
      this.$http.put(`http://localhost:3001/users/ceckin?token=${localStorage.getItem('token')}`)
        .then(function (response) {
          console.log('response:', response)
          this.me()
        })
    }
  },
  created () {
    if (localStorage.getItem('token')) {
      this.me()
      this.meCompany()
      this.getAllFlights()
      this.getAllBooks()
    }
  }
})
