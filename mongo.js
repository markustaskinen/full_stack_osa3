const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const generateRandomId = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.yra55.mongodb.net/pl-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length < 4) {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const contact = new Contact({
    id: generateRandomId(10000),
    name: name,
    number: number,
  })

  contact.save().then(response => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
