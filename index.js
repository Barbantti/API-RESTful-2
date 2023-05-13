const express = require('express')

const mongoose = require('mongoose')

const Products = require('./models/Products')

const app = express()

const dotenv = require("dotenv")

dotenv.config()


app.use(

    express.urlencoded({

        extended: true,

    })

)


app.use(express.json())

console.log(mongoose)

//Connecting to mongoose with process.env

mongoose

.connect(
    
    `mongodb+srv://Barbantti:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.i5wyo8t.mongodb.net/?retryWrites=true&w=majority`,
    
    )


.then(() => {

    console.log('Database connected!')

    app.listen(3000)

})


.catch((err) => console.log(err))

//Sending with get url from database, in this case localhost 3000, returning with the message "Express alive!"

app.get("/", (req, res) => {

    res.json({ message: "Express alive!" })
    
})

//Posting products info on database

app.post('/products', async (req, res) => {

    const { ProductName, ProductPrice, ProductApproved, EmployerName, EmployerSalary, EmployerApplicationApproved } = req.body

    const products = {

        ProductName,

        ProductPrice,

        ProductApproved,

        EmployerName,

        EmployerSalary,

        EmployerApplicationApproved,

    }

    try {

        const addProducts = await Products.create(products)

        res.status(201).json({ message: 'Data inserted with successful!' })

    } catch (error) {

        res.status(500).json({ error: error})

    }

})


app.get('/products', async (req, res) => {

    try {

    const products = await Products.find()

    res.status(200).json(products)

} catch (error) {

    res.status(500).json({ error: error })

}

})


app.get('/products/:id', async (req, res) => {

    const id = req.params.id

    try {

        const products = await Products.findOne({ _id: id })

        if (!products) {

            res.redirect(`/products/error/${id}`)

            return

        }

        res.status(200).json(products)
        
    } catch (error) {
        
        res.status(500).json({ error: error })

    }

})


app.get('/products/error/:id', async (req, res) => {

    const id = req.params.id

    res.status(422).json({ message: 'Data not found!' })

})


app.patch('/products/:id', async (req, res) => {

    const id = req.params.id.trim()

    const { ProductName, ProductPrice, ProductApproved, EmployerName, EmployerSalary, EmployerApplicationApproved } = req.body 

    const products = {

        ProductName,

        ProductPrice,

        ProductApproved,

        EmployerName,

        EmployerSalary,

        EmployerApplicationApproved,

    }

    try {
        
        const updatedProducts = await Products.updateOne({ _id: id }, products)

        if (updatedProducts.nModified === 0) {

            res.status(422).json({ message: 'Data not found! '})

            return

        }

        res.status(200).json(products)

    } catch (error) {

        res.status(500).json({ error: error })
               
    }

})

app.delete('/products/:id', async (req, res) => {

    const id = req.params.id.trim()

    const products = await Products.findOne({ _id: id }) 

    if (!products) {

        res.status(422).json({ message: 'Data not found! '})

            return

    }

    try {
        
        await Products.deleteOne({ _id: id }) 

        res.status(200).json({ message: 'Data removed successful!' })

    } catch (error) {
        
        res.status(500).json({ error: error })

    }

})
