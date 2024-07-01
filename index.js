require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact');

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'));
app.use(express.static('dist'))

let phonebook = [
    {
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

Contact.find({})
    .then(savedPhonebook => {
        if (savedPhonebook.length < 1) {
            phonebook.forEach(defaultContact => {
                const contact = new Contact(defaultContact);

                contact.save()
            });
        }

        phonebook = savedPhonebook;

    });

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${phonebook.length} people</p>
        <p>${Date()}</p>`
    )
});

app.get('/api/persons', (request, response) => {
    Contact.find({})
        .then(phonebook => {
            response.json(phonebook);
        })
});

app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id)
        .then(contact => {
            response.json(contact);
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    const doesNameExists = phonebook.some(contact => {
        return contact.name.toLowerCase() === body.name.toLowerCase()
    });

    if (!body.name || !body.number) {
        return response
            .status(400)
            .json({
                error: 'name or/and number is missing'
            });
    }

    if (doesNameExists) {
        return response
            .status(400)
            .json({
                error: 'name already exists in the phonebook'
            })
    }

    const contact = new Contact({
        name: body.name,
        number: body.number
    });

    contact.save()
        .then(savedContact => {
            phonebook = phonebook.concat(savedContact);

            response.json(savedContact);
        });
})

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response
            .status(400)
            .send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})